import { useState } from 'react';
import Scoreboard from '@/components/Scoreboard';
import FootballField from '@/components/FootballField';

const Index = () => {
  const [matchData] = useState({
    teamA: 'Palmeiras',
    teamB: 'Flamengo',
    scoreA: 2,
    scoreB: 1,
    matchTime: 67,
  });

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0">
        <div className="px-4 py-2 flex items-center justify-center border-b border-border/50">
          <h1 className="font-display text-2xl tracking-wider text-primary">
            2S<span className="text-accent">FUT</span>
          </h1>
        </div>
        <Scoreboard
          teamA={matchData.teamA}
          teamB={matchData.teamB}
          scoreA={matchData.scoreA}
          scoreB={matchData.scoreB}
          matchTime={matchData.matchTime}
        />
      </header>

      {/* Field */}
      <main className="flex-1 relative overflow-hidden">
        <FootballField />
      </main>

      {/* Footer hint */}
      <footer className="flex-shrink-0 py-3 px-4 text-center bg-secondary/50">
        <p className="text-xs text-muted-foreground">
          Toque em um jogador para reagir • Arraste para explorar
        </p>
      </footer>
    </div>
  );
};

export default Index;
