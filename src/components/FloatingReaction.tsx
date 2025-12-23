import { useEffect, useState } from 'react';

interface FloatingReactionProps {
  emoji: string;
  onComplete: () => void;
}

const FloatingReaction = ({ emoji, onComplete }: FloatingReactionProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="floating-reaction absolute -top-4 left-1/2 -translate-x-1/2 text-2xl pointer-events-none">
      {emoji}
    </div>
  );
};

export default FloatingReaction;
