import { ThumbsDown, ThumbsUp, Star, DoorOpen, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface RadialMenuProps {
  isCoach: boolean;
  onReaction: (type: string) => void;
  onClose: () => void;
}

const RadialMenu = ({ isCoach, onReaction, onClose }: RadialMenuProps) => {
  const baseButtons = [
    { id: 'cornetar', icon: ThumbsDown, label: 'Cornetar', color: 'bg-reaction-boo', angle: 0 },
    { id: 'aplaudir', icon: ThumbsUp, label: 'Aplaudir', color: 'bg-reaction-applaud', angle: 90 },
    { id: 'favoritar', icon: Star, label: 'Favoritar', color: 'bg-reaction-favorite', angle: 180 },
    { id: 'embora', icon: DoorOpen, label: 'Mandar Embora', color: 'bg-reaction-leave', angle: 270 },
  ];

  const coachButtons = [
    { id: 'boa-escalacao', icon: CheckCircle, label: 'Boa Escalação', color: 'bg-reaction-good', angle: 45 },
    { id: 'pessima-escalacao', icon: XCircle, label: 'Péssima Escalação', color: 'bg-reaction-bad', angle: 135 },
    { id: 'boa-substituicao', icon: RefreshCw, label: 'Boa Substituição', color: 'bg-reaction-good', angle: 225 },
    { id: 'pessima-substituicao', icon: AlertCircle, label: 'Péssima Substituição', color: 'bg-reaction-bad', angle: 315 },
  ];

  const buttons = isCoach ? [...baseButtons, ...coachButtons] : baseButtons;
  const radius = isCoach ? 85 : 70;

  const getPosition = (angle: number, r: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: Math.cos(radian) * r,
      y: Math.sin(radian) * r,
    };
  };

  return (
    <div className="radial-menu" onClick={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu center */}
      <div className="relative z-50">
        {buttons.map((btn, index) => {
          const pos = getPosition(btn.angle, radius);
          const Icon = btn.icon;
          
          return (
            <button
              key={btn.id}
              className={`radial-button ${btn.color} w-12 h-12`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 50}ms`,
              }}
              onClick={() => {
                onReaction(btn.id);
                onClose();
              }}
              title={btn.label}
            >
              <Icon className="w-5 h-5 text-foreground" />
            </button>
          );
        })}
        
        {/* Close button at center */}
        <button
          className="absolute w-10 h-10 rounded-full bg-secondary flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-50"
          onClick={onClose}
        >
          <span className="text-lg font-bold">×</span>
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
