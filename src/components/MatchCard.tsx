import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Calendar } from 'lucide-react';

interface MatchCardProps {
  fixture: {
    id: number;
    date: string;
    venue: {
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    name: string;
    logo: string;
    round: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  onClick?: () => void;
}

const MatchCard = ({ fixture, league, teams, goals, onClick }: MatchCardProps) => {
  const matchDate = new Date(fixture.date);
  const formattedDate = format(matchDate, "dd MMM", { locale: ptBR });
  const formattedTime = format(matchDate, "HH:mm");

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(fixture.status.short);
  const isFinished = fixture.status.short === 'FT';

  return (
    <div 
      className="bg-card border border-border/50 rounded-xl p-4 cursor-pointer hover:bg-accent/10 transition-colors"
      onClick={onClick}
    >
      {/* League & Round */}
      <div className="flex items-center gap-2 mb-3">
        <img src={league.logo} alt={league.name} className="w-5 h-5 object-contain" />
        <span className="text-xs text-muted-foreground truncate">{league.name}</span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground truncate">{league.round}</span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          <img src={teams.home.logo} alt={teams.home.name} className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium text-foreground text-center truncate w-full">
            {teams.home.name}
          </span>
        </div>

        {/* Score/Status */}
        <div className="flex flex-col items-center gap-1 px-4">
          {isLive && (
            <span className="text-[10px] font-bold text-red-500 animate-pulse">AO VIVO</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {goals.home ?? '-'}
            </span>
            <span className="text-lg text-muted-foreground">:</span>
            <span className="text-2xl font-bold text-foreground">
              {goals.away ?? '-'}
            </span>
          </div>
          {isFinished && (
            <span className="text-[10px] text-muted-foreground uppercase">Encerrado</span>
          )}
          {!isLive && !isFinished && (
            <span className="text-[10px] text-muted-foreground">{formattedTime}</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          <img src={teams.away.logo} alt={teams.away.name} className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium text-foreground text-center truncate w-full">
            {teams.away.name}
          </span>
        </div>
      </div>

      {/* Match Info */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px]">{formattedDate}</span>
        </div>
        {fixture.venue.name && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] truncate max-w-[120px]">{fixture.venue.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
