-- Tabela de Ranking/Leaderboard
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  correct_winners INTEGER NOT NULL DEFAULT 0,
  exact_scores INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - todos podem ver o ranking
CREATE POLICY "Ranking é público para leitura"
ON public.leaderboard
FOR SELECT
USING (true);

-- Apenas o sistema pode inserir/atualizar (via service role)
CREATE POLICY "Sistema pode inserir no ranking"
ON public.leaderboard
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sistema pode atualizar ranking"
ON public.leaderboard
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Função para processar pontuação quando jogo termina
CREATE OR REPLACE FUNCTION public.process_fixture_predictions(p_fixture_id INTEGER, p_home_score INTEGER, p_away_score INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pred RECORD;
  points_earned INTEGER;
  predicted_winner TEXT;
  actual_winner TEXT;
BEGIN
  -- Determinar vencedor real
  IF p_home_score > p_away_score THEN
    actual_winner := 'home';
  ELSIF p_away_score > p_home_score THEN
    actual_winner := 'away';
  ELSE
    actual_winner := 'draw';
  END IF;

  -- Processar cada palpite para este jogo
  FOR pred IN 
    SELECT * FROM public.predictions WHERE fixture_id = p_fixture_id
  LOOP
    points_earned := 0;
    
    -- Determinar vencedor previsto
    IF pred.home_score > pred.away_score THEN
      predicted_winner := 'home';
    ELSIF pred.away_score > pred.home_score THEN
      predicted_winner := 'away';
    ELSE
      predicted_winner := 'draw';
    END IF;
    
    -- Verificar placar exato (25 pontos)
    IF pred.home_score = p_home_score AND pred.away_score = p_away_score THEN
      points_earned := 25;
      
      -- Atualizar ou inserir no leaderboard
      INSERT INTO public.leaderboard (user_id, total_points, correct_winners, exact_scores)
      VALUES (pred.user_id, points_earned, 1, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET 
        total_points = leaderboard.total_points + points_earned,
        correct_winners = leaderboard.correct_winners + 1,
        exact_scores = leaderboard.exact_scores + 1,
        updated_at = now();
        
    -- Verificar se acertou o vencedor (10 pontos)
    ELSIF predicted_winner = actual_winner THEN
      points_earned := 10;
      
      INSERT INTO public.leaderboard (user_id, total_points, correct_winners, exact_scores)
      VALUES (pred.user_id, points_earned, 1, 0)
      ON CONFLICT (user_id)
      DO UPDATE SET 
        total_points = leaderboard.total_points + points_earned,
        correct_winners = leaderboard.correct_winners + 1,
        updated_at = now();
    END IF;
  END LOOP;
END;
$$;