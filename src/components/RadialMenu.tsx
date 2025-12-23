import { ThumbsDown, ThumbsUp, Star, DoorOpen, CheckCircle, XCircle, RefreshCw, AlertCircle, LucideIcon } from 'lucide-react';

interface RadialMenuProps {
  isCoach: boolean;
  playerName: string;
  onReaction: (type: string) => void;
  onClose: () => void;
}

interface ReactionButton {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  textColor: string;
}

const RadialMenu = ({ isCoach, playerName, onReaction, onClose }: RadialMenuProps) => {
  const playerButtons: ReactionButton[] = [
    { id: 'aplaudir', icon: ThumbsUp, label: 'Aplaudir', color: 'bg-reaction-applaud', textColor: 'text-white' },
    { id: 'cornetar', icon: ThumbsDown, label: 'Cornetar', color: 'bg-reaction-boo', textColor: 'text-white' },
    { id: 'favoritar', icon: Star, label: 'Favoritar', color: 'bg-reaction-favorite', textColor: 'text-black' },
    { id: 'embora', icon: DoorOpen, label: 'Embora', color: 'bg-reaction-leave', textColor: 'text-white' },
  ];

  const coachButtons: ReactionButton[] = [
    { id: 'boa-escalacao', icon: CheckCircle, label: 'Boa Escalação', color: 'bg-reaction-good', textColor: 'text-white' },
    { id: 'pessima-escalacao', icon: XCircle, label: 'Péssima', color: 'bg-reaction-bad', textColor: 'text-white' },
    { id: 'boa-substituicao', icon: RefreshCw, label: 'Boa Subst.', color: 'bg-reaction-good', textColor: 'text-white' },
    { id: 'pessima-substituicao', icon: AlertCircle, label: 'Má Subst.', color: 'bg-reaction-bad', textColor: 'text-white' },
  ];

  const buttons = isCoach ? [...playerButtons, ...coachButtons] : playerButtons;
  const columns = isCoach ? 4 : 2;

  return (
    <div className="radial-menu" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu container */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-max">
        {/* Player name header */}
        <div className="text-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Avaliando</span>
          <h3 className="text-base font-display font-bold text-foreground">{playerName}</h3>
        </div>

        {/* Reaction buttons grid */}
        <div 
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {buttons.map((btn, index) => {
            const Icon = btn.icon;
            
            return (
              <button
                key={btn.id}
                className={`
                  ${btn.color} ${btn.textColor} 
                  flex flex-col items-center justify-center gap-1 
                  w-14 h-14 
                  rounded-xl 
                  transition-all duration-200 
                  hover:scale-105 hover:shadow-lg
                  animate-scale-in
                `}
                style={{
                  animationDelay: `${index * 40}ms`,
                  animationFillMode: 'both',
                }}
                onClick={() => {
                  onReaction(btn.id);
                  onClose();
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span className="text-[9px] font-semibold text-center leading-tight px-0.5">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          className="mt-3 w-full py-2 rounded-xl bg-secondary/90 text-muted-foreground text-xs font-semibold hover:bg-secondary transition-colors"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
