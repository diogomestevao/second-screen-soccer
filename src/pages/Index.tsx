import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import FixtureCard from '@/components/FixtureCard';
import PredictionModal from '@/components/PredictionModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Fixture {
  id: number;
  date_time: string;
  status_short: string;
  home_team_id: number;
  home_team_name: string;
  home_team_logo: string;
  away_team_id: number;
  away_team_name: string;
  away_team_logo: string;
  league_id: number;
  round: string | null;
  home_score: number | null;
  away_score: number | null;
}

interface Prediction {
  fixture_id: number;
  home_score: number;
  away_score: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<Map<number, Prediction>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('fixtures')
          .select('*')
          .order('date_time', { ascending: true })
          .limit(5);

        if (dbError) throw dbError;
        
        setFixtures(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError('Erro ao carregar partidas');
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  // Fetch user predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user || fixtures.length === 0) return;

      try {
        const fixtureIds = fixtures.map(f => f.id);
        const { data, error } = await supabase
          .from('predictions')
          .select('fixture_id, home_score, away_score')
          .eq('user_id', user.id)
          .in('fixture_id', fixtureIds);

        if (error) throw error;

        const predictionsMap = new Map<number, Prediction>();
        data?.forEach(p => {
          predictionsMap.set(p.fixture_id, {
            fixture_id: p.fixture_id,
            home_score: p.home_score,
            away_score: p.away_score,
          });
        });
        setPredictions(predictionsMap);
      } catch (err) {
        console.error('Error fetching predictions:', err);
      }
    };

    fetchPredictions();
  }, [user, fixtures]);

  const handlePredictClick = (fixture: Fixture) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para fazer palpites',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    setSelectedFixture(fixture);
    setModalOpen(true);
  };

  const handleSavePrediction = async (fixtureId: number, homeScore: number, awayScore: number) => {
    if (!session?.access_token) {
      throw new Error('Sessão expirada');
    }

    const response = await supabase.functions.invoke('save-prediction', {
      body: { fixture_id: fixtureId, home_score: homeScore, away_score: awayScore },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Erro ao salvar palpite');
    }

    if (response.data?.error) {
      throw new Error(response.data.error);
    }

    // Update local state
    setPredictions(prev => {
      const updated = new Map(prev);
      updated.set(fixtureId, { fixture_id: fixtureId, home_score: homeScore, away_score: awayScore });
      return updated;
    });

    toast({
      title: 'Palpite salvo!',
      description: `Seu palpite: ${homeScore} x ${awayScore}`,
    });
  };

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0">
        <div className="px-4 py-2 flex items-center justify-center border-b border-border/50">
          <h1 className="font-display text-2xl tracking-wider text-primary">
            2S<span className="text-accent">FUT</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Próximas Partidas</h2>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && fixtures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Nenhuma partida encontrada</p>
          </div>
        )}

        {!loading && !error && fixtures.length > 0 && (
          <div className="flex flex-col gap-3">
            {fixtures.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                id={fixture.id}
                dateTime={fixture.date_time}
                statusShort={fixture.status_short}
                homeTeamName={fixture.home_team_name}
                homeTeamLogo={fixture.home_team_logo}
                awayTeamName={fixture.away_team_name}
                awayTeamLogo={fixture.away_team_logo}
                homeScore={fixture.home_score}
                awayScore={fixture.away_score}
                round={fixture.round}
                prediction={predictions.get(fixture.id)}
                isAuthenticated={!!user}
                onPredictClick={() => handlePredictClick(fixture)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Prediction Modal */}
      {selectedFixture && (
        <PredictionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          homeTeamName={selectedFixture.home_team_name}
          homeTeamLogo={selectedFixture.home_team_logo}
          awayTeamName={selectedFixture.away_team_name}
          awayTeamLogo={selectedFixture.away_team_logo}
          fixtureId={selectedFixture.id}
          existingHomeScore={predictions.get(selectedFixture.id)?.home_score}
          existingAwayScore={predictions.get(selectedFixture.id)?.away_score}
          onSave={handleSavePrediction}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
