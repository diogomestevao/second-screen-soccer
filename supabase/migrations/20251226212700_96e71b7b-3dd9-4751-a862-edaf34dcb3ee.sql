-- Create predictions table
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fixture_id INTEGER NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  home_score INTEGER NOT NULL CHECK (home_score >= 0),
  away_score INTEGER NOT NULL CHECK (away_score >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fixture_id)
);

-- Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create function to check if predictions are allowed for a fixture
CREATE OR REPLACE FUNCTION public.can_place_prediction(p_fixture_id INTEGER)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT status_short = 'NS' FROM public.fixtures WHERE id = p_fixture_id),
    FALSE
  )
$$;

-- RLS Policies
-- Users can view their own predictions
CREATE POLICY "Users can view own predictions"
ON public.predictions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert predictions only if fixture status is NS
CREATE POLICY "Users can insert predictions if fixture open"
ON public.predictions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND public.can_place_prediction(fixture_id)
);

-- Users can update their own predictions only if fixture status is NS
CREATE POLICY "Users can update predictions if fixture open"
ON public.predictions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (public.can_place_prediction(fixture_id));

-- Users can delete their own predictions only if fixture status is NS
CREATE POLICY "Users can delete predictions if fixture open"
ON public.predictions
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id 
  AND public.can_place_prediction(fixture_id)
);

-- Trigger for updated_at
CREATE TRIGGER update_predictions_updated_at
BEFORE UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();