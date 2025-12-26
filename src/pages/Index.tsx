import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import FixtureCard from '@/components/FixtureCard';
import { supabase } from '@/integrations/supabase/client';
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

const Index = () => {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleMatchClick = (fixtureId: number) => {
    navigate(`/live?fixture=${fixtureId}`);
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
                onClick={() => handleMatchClick(fixture.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
