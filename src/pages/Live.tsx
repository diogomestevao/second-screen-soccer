import { useState } from 'react';
import Scoreboard from '@/components/Scoreboard';
import FootballField from '@/components/FootballField';
import MatchTimeline from '@/components/MatchTimeline';
import BottomNav from '@/components/BottomNav';

const Live = () => {
  const [matchData] = useState({
    teamA: 'Palmeiras',
    teamB: 'Flamengo',
    scoreA: 2,
    scoreB: 1,
    matchTime: 67,
  });

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-background overflow-hidden">
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

      {/* Main content - Field and Timeline */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Half Field - Top */}
        <div className="h-[45%] relative flex-shrink-0">
          <FootballField />
        </div>
        
        {/* Timeline Feed - Bottom */}
        <div className="flex-1 min-h-0 bg-secondary/30 border-t border-border/50">
          <MatchTimeline />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Live;
