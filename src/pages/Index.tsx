import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import MatchCard from '@/components/MatchCard';
import { footballApi, Fixture } from '@/services/footballApi';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        // Buscar últimas 3 partidas do Palmeiras (team id: 121)
        const response = await footballApi.getLastFixtures(121, 3);
        setFixtures(response.response);
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
        <h2 className="text-lg font-semibold text-foreground mb-4">Últimas Partidas</h2>
        
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
            {fixtures.map((match) => (
              <MatchCard
                key={match.fixture.id}
                fixture={match.fixture}
                league={match.league}
                teams={match.teams}
                goals={match.goals}
                onClick={() => handleMatchClick(match.fixture.id)}
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
