import { useState } from 'react';
import RadialMenu from './RadialMenu';
import FloatingReaction from './FloatingReaction';

interface PlayerProps {
  id: number;
  name: string;
  number: number;
  position: { x: number; y: number };
  isCoach?: boolean;
}

interface Reactions {
  [key: string]: number;
}

const reactionEmojis: { [key: string]: string } = {
  cornetar: '👎',
  aplaudir: '👏',
  favoritar: '⭐',
  embora: '🚪',
  'boa-escalacao': '✅',
  'pessima-escalacao': '❌',
  'boa-substituicao': '🔄',
  'pessima-substituicao': '💢',
};

const Player = ({ id, name, number, position, isCoach = false }: PlayerProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState<Reactions>({});
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string }[]>([]);

  const handleReaction = (type: string) => {
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    const newFloating = {
      id: Date.now(),
      emoji: reactionEmojis[type] || '👍',
    };
    setFloatingReactions((prev) => [...prev, newFloating]);
  };

  const removeFloating = (id: number) => {
    setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const mainReaction = Object.entries(reactions).sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      {/* Blur overlay when menu is open */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Player in original position (placeholder when centered) */}
      {showMenu && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
          <div className={`player-icon ${isCoach ? 'coach' : ''} w-14 h-14 flex flex-col items-center justify-center`}>
            <span className="font-display text-lg leading-none">{number}</span>
          </div>
        </div>
      )}

      {/* Player - centered when being evaluated */}
      <div
        className={`transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
          showMenu 
            ? 'fixed z-50 scale-125 left-1/2 top-1/2' 
            : 'absolute'
        }`}
        style={showMenu ? {} : { left: `${position.x}%`, top: `${position.y}%` }}
      >
        {/* Floating reactions */}
        {floatingReactions.map((r) => (
          <FloatingReaction
            key={r.id}
            emoji={r.emoji}
            onComplete={() => removeFloating(r.id)}
          />
        ))}

        {/* Reaction counter */}
        {totalReactions > 0 && (
          <div 
            className="reaction-counter bg-accent text-accent-foreground"
            style={{ zIndex: 60 }}
          >
            {totalReactions}
          </div>
        )}

        {/* Player circle */}
        <button
          className={`player-icon ${isCoach ? 'coach' : ''} w-14 h-14 flex flex-col items-center justify-center ${
            showMenu ? 'ring-4 ring-primary/50 shadow-2xl' : ''
          }`}
          onClick={() => setShowMenu(true)}
        >
          <span className="font-display text-lg leading-none">{number}</span>
          <span className="text-[8px] font-medium uppercase tracking-tight truncate max-w-[50px]">
            {name.split(' ').pop()}
          </span>
        </button>

        {/* Player name when centered */}
        {showMenu && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-sm font-semibold text-foreground bg-background/80 px-3 py-1 rounded-full">
              {name}
            </span>
          </div>
        )}

        {/* Main reaction indicator */}
        {!showMenu && mainReaction && mainReaction[1] > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">
            {reactionEmojis[mainReaction[0]]}
          </div>
        )}

        {/* Radial menu */}
        {showMenu && (
          <RadialMenu
            isCoach={isCoach}
            onReaction={handleReaction}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    </>
  );
};

export default Player;
