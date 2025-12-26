-- Criar tabela fixtures para armazenar partidas
CREATE TABLE public.fixtures (
  id INTEGER PRIMARY KEY,
  date_time TIMESTAMPTZ NOT NULL,
  status_short TEXT NOT NULL,
  home_team_id INTEGER NOT NULL,
  home_team_name TEXT NOT NULL,
  home_team_logo TEXT NOT NULL,
  away_team_id INTEGER NOT NULL,
  away_team_name TEXT NOT NULL,
  away_team_logo TEXT NOT NULL,
  league_id INTEGER NOT NULL,
  round TEXT,
  home_score INTEGER,
  away_score INTEGER,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;

-- Política: Leitura pública (todos podem ver partidas)
CREATE POLICY "Partidas são públicas para leitura"
  ON public.fixtures
  FOR SELECT
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER handle_fixtures_updated_at
  BEFORE UPDATE ON public.fixtures
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Índices para melhorar performance de consultas
CREATE INDEX idx_fixtures_date_time ON public.fixtures(date_time);
CREATE INDEX idx_fixtures_status ON public.fixtures(status_short);
CREATE INDEX idx_fixtures_home_team ON public.fixtures(home_team_id);
CREATE INDEX idx_fixtures_away_team ON public.fixtures(away_team_id);
CREATE INDEX idx_fixtures_league ON public.fixtures(league_id);
CREATE INDEX idx_fixtures_processed ON public.fixtures(processed);