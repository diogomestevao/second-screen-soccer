import { Goal, AlertTriangle, ArrowRightLeft, Clock } from 'lucide-react';

interface MatchEvent {
  id: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  time: number;
  team: 'home' | 'away';
  player: string;
  description?: string;
}

const mockEvents: MatchEvent[] = [
  { id: 1, type: 'goal', time: 12, team: 'home', player: 'Flaco López', description: 'Assistência de Estêvão' },
  { id: 2, type: 'yellow_card', time: 28, team: 'away', player: 'Gerson' },
  { id: 3, type: 'goal', time: 35, team: 'away', player: 'Pedro', description: 'Cobrança de pênalti' },
  { id: 4, type: 'substitution', time: 46, team: 'home', player: 'Rony', description: 'Entra no lugar de Dudu' },
  { id: 5, type: 'goal', time: 58, team: 'home', player: 'Raphael Veiga', description: 'Cobrança de falta' },
  { id: 6, type: 'yellow_card', time: 62, team: 'home', player: 'Murilo' },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'goal':
      return <Goal className="w-4 h-4" />;
    case 'yellow_card':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'red_card':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'substitution':
      return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'goal':
      return 'bg-primary/20 border-primary/40';
    case 'yellow_card':
      return 'bg-yellow-500/20 border-yellow-500/40';
    case 'red_card':
      return 'bg-red-500/20 border-red-500/40';
    case 'substitution':
      return 'bg-blue-500/20 border-blue-500/40';
    default:
      return 'bg-muted border-border';
  }
};

const MatchTimeline = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">Eventos da Partida</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className={`
              flex items-start gap-3 p-2.5 rounded-lg border
              ${getEventColor(event.type)}
              ${event.team === 'home' ? 'mr-4' : 'ml-4'}
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 flex-shrink-0">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{event.time}'</span>
                <span className="text-sm font-medium text-foreground truncate">{event.player}</span>
              </div>
              {event.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
              )}
            </div>
            <span className={`text-[10px] uppercase font-semibold ${event.team === 'home' ? 'text-primary' : 'text-accent'}`}>
              {event.team === 'home' ? 'PAL' : 'FLA'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchTimeline;
