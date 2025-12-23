import { ThumbsDown, ThumbsUp, LucideIcon } from 'lucide-react';

interface RadialMenuProps {
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

const RadialMenu = ({ onReaction, onClose }: RadialMenuProps) => {
  const buttons: ReactionButton[] = [
    { id: 'aplaudir', icon: ThumbsUp, label: 'Aplaudir', color: 'bg-reaction-applaud', textColor: 'text-white' },
    { id: 'cornetar', icon: ThumbsDown, label: 'Cornetar', color: 'bg-reaction-boo', textColor: 'text-white' },
  ];

  return (
    <div className="radial-menu" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu container - positioned around the player icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        {/* Buttons positioned on left and right of the player */}
        <div className="flex items-center gap-20">
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

        {/* Close button below */}
        <button
          className="absolute left-1/2 -translate-x-1/2 top-20 px-6 py-2 rounded-xl bg-secondary/90 text-muted-foreground text-sm font-bold hover:bg-secondary transition-colors animate-scale-in"
          style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
