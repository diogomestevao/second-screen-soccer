import { Goal, AlertTriangle, ArrowRightLeft, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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
      return <Goal className="w-3 h-3" />;
    case 'yellow_card':
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    case 'red_card':
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
    case 'substitution':
      return <ArrowRightLeft className="w-3 h-3 text-blue-400" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

const getEventBg = (type: string) => {
  switch (type) {
    case 'goal':
      return 'bg-primary/20';
    case 'yellow_card':
      return 'bg-yellow-500/20';
    case 'red_card':
      return 'bg-red-500/20';
    case 'substitution':
      return 'bg-blue-500/20';
    default:
      return 'bg-muted';
  }
};

const EventRow = ({ event }: { event: MatchEvent }) => (
  <div className={`flex items-center gap-2 px-2 py-1.5 rounded ${getEventBg(event.type)}`}>
    <span className="text-[10px] font-mono text-muted-foreground w-6">{event.time}'</span>
    <div className="w-5 h-5 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
      {getEventIcon(event.type)}
    </div>
    <span className={`text-[10px] font-semibold w-6 ${event.team === 'home' ? 'text-primary' : 'text-accent'}`}>
      {event.team === 'home' ? 'PAL' : 'FLA'}
    </span>
    <span className="text-xs text-foreground truncate flex-1">{event.player}</span>
    {event.description && (
      <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{event.description}</span>
    )}
  </div>
);

const MatchTimeline = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lastEvent = mockEvents[mockEvents.length - 1];
  const previousEvents = mockEvents.slice(0, -1).reverse();

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-border/50 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-foreground">Eventos</h2>
        <span className="text-[10px] text-muted-foreground">{mockEvents.length} eventos</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1">
        {/* Last event always visible */}
        <div className="border-l-2 border-primary pl-1">
          <EventRow event={lastEvent} />
        </div>

        {/* Collapsible previous events */}
        {previousEvents.length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger className="w-full flex items-center justify-center gap-1 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Ver todos ({previousEvents.length})
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {previousEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default MatchTimeline;
