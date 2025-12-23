import { useState, useEffect } from 'react';

interface ScoreboardProps {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  matchTime: number;
}

const Scoreboard = ({ teamA, teamB, scoreA, scoreB, matchTime }: ScoreboardProps) => {
  const [time, setTime] = useState(matchTime);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setTime((prev) => (prev < 90 ? prev + 1 : prev));
    }, 60000); // Update every minute for realism

    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (minutes: number) => {
    if (minutes <= 45) return `${minutes}'`;
    if (minutes > 45 && minutes <= 47) return `45+${minutes - 45}'`;
    if (minutes > 47 && minutes <= 90) return `${minutes - 2}'`;
    return `90+${minutes - 90}'`;
  };

  return (
    <div className="scoreboard w-full px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-display text-lg">
          {teamA.charAt(0)}
        </div>
        <span className="font-semibold text-sm truncate max-w-[80px]">{teamA}</span>
      </div>
      
      <div className="flex flex-col items-center gap-1 px-4">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {isLive ? 'Ao Vivo' : 'Encerrado'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-4xl">{scoreA}</span>
          <span className="font-display text-2xl text-muted-foreground">×</span>
          <span className="font-display text-4xl">{scoreB}</span>
        </div>
        <span className="font-display text-xl text-accent">{formatTime(time)}</span>
      </div>
      
      <div className="flex items-center gap-3 flex-1 justify-end">
        <span className="font-semibold text-sm truncate max-w-[80px]">{teamB}</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-display text-lg">
          {teamB.charAt(0)}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
