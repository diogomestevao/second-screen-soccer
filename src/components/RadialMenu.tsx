import { ThumbsDown, ThumbsUp, Star, DoorOpen, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface RadialMenuProps {
  isCoach: boolean;
  playerName: string;
  onReaction: (type: string) => void;
  onClose: () => void;
}

const RadialMenu = ({ isCoach, playerName, onReaction, onClose }: RadialMenuProps) => {
  const baseButtons = [
    { id: 'cornetar', icon: ThumbsDown, label: 'Cornetar', color: 'bg-reaction-boo', textColor: 'text-white' },
    { id: 'aplaudir', icon: ThumbsUp, label: 'Aplaudir', color: 'bg-reaction-applaud', textColor: 'text-white' },
    { id: 'favoritar', icon: Star, label: 'Favoritar', color: 'bg-reaction-favorite', textColor: 'text-black' },
    { id: 'embora', icon: DoorOpen, label: 'Mandar Embora', color: 'bg-reaction-leave', textColor: 'text-white' },
  ];

  const coachButtons = [
    { id: 'boa-escalacao', icon: CheckCircle, label: 'Boa Escalação', color: 'bg-reaction-good', textColor: 'text-white' },
    { id: 'pessima-escalacao', icon: XCircle, label: 'Péssima Escalação', color: 'bg-reaction-bad', textColor: 'text-white' },
    { id: 'boa-substituicao', icon: RefreshCw, label: 'Boa Substituição', color: 'bg-reaction-good', textColor: 'text-white' },
    { id: 'pessima-substituicao', icon: AlertCircle, label: 'Péssima Substituição', color: 'bg-reaction-bad', textColor: 'text-white' },
  ];

  const buttons = isCoach ? [...baseButtons, ...coachButtons] : baseButtons;

  return (
    <div className="radial-menu" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu container - grid layout below player */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
        {/* Player name header */}
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Avaliando</span>
          <h3 className="text-xl font-display text-foreground">{playerName}</h3>
        </div>

        {/* Reaction buttons grid */}
        <div className={`grid gap-2 ${isCoach ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {buttons.map((btn, index) => {
            const Icon = btn.icon;
            
            return (
              <button
                key={btn.id}
                className={`${btn.color} ${btn.textColor} flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-[140px]`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => {
                  onReaction(btn.id);
                  onClose();
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          className="mt-4 w-full py-2 rounded-xl bg-secondary/80 text-muted-foreground text-sm font-medium hover:bg-secondary transition-colors"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
