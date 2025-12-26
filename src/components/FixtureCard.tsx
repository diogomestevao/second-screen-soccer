import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Prediction {
  home_score: number;
  away_score: number;
}

interface FixtureCardProps {
  id: number;
  dateTime: string;
  statusShort: string;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  round: string | null;
  prediction?: Prediction | null;
  isAuthenticated?: boolean;
  onClick?: () => void;
  onPredictClick?: () => void;
}

const FixtureCard = ({
  dateTime,
  statusShort,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
  homeScore,
  awayScore,
  round,
  prediction,
  isAuthenticated = false,
  onClick,
  onPredictClick,
}: FixtureCardProps) => {
  const matchDate = new Date(dateTime);
  const formattedDate = format(matchDate, "dd MMM", { locale: ptBR });
  const formattedTime = format(matchDate, "HH:mm");

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(statusShort);
  const isFinished = statusShort === 'FT';
  const isScheduled = statusShort === 'NS' || statusShort === 'TBD';
  const canPredict = statusShort === 'NS';

  const handlePredictClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPredictClick?.();
  };

  return (
    <div 
      className="bg-card border border-border/50 rounded-xl p-4 cursor-pointer hover:bg-accent/10 transition-colors"
      onClick={onClick}
    >
      {/* Round */}
      {round && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground truncate">{round}</span>
        </div>
      )}

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          <img src={homeTeamLogo} alt={homeTeamName} className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium text-foreground text-center truncate w-full">
            {homeTeamName}
          </span>
        </div>

        {/* Score/Status */}
        <div className="flex flex-col items-center gap-1 px-4">
          {isLive && (
            <span className="text-[10px] font-bold text-red-500 animate-pulse">AO VIVO</span>
          )}
          {isScheduled ? (
            <span className="text-lg font-semibold text-primary">{formattedTime}</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {homeScore ?? '-'}
              </span>
              <span className="text-lg text-muted-foreground">:</span>
              <span className="text-2xl font-bold text-foreground">
                {awayScore ?? '-'}
              </span>
            </div>
          )}
          {isFinished && (
            <span className="text-[10px] text-muted-foreground uppercase">Encerrado</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          <img src={awayTeamLogo} alt={awayTeamName} className="w-12 h-12 object-contain" />
          <span className="text-xs font-medium text-foreground text-center truncate w-full">
            {awayTeamName}
          </span>
        </div>
      </div>

      {/* Match Info & Prediction */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px]">{formattedDate}</span>
        </div>

        {/* Prediction Section */}
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            {prediction ? (
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                <Target className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {prediction.home_score} x {prediction.away_score}
                </span>
              </div>
            ) : canPredict ? (
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs px-3"
                onClick={handlePredictClick}
              >
                <Target className="w-3 h-3 mr-1" />
                Palpitar
              </Button>
            ) : (
              <span className="text-[10px] text-muted-foreground">Fechado</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureCard;
