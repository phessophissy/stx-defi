'use client';

interface BouncingBallsDecorProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function BouncingBallsDecor({ position = 'bottom-right' }: BouncingBallsDecorProps) {
  const positionStyles = {
    'bottom-right': { bottom: '30px', right: '30px' },
    'bottom-left': { bottom: '30px', left: '30px' },
    'top-right': { top: '100px', right: '30px' },
    'top-left': { top: '100px', left: '30px' },
  };

  return (
    <div 
      className="bouncing-balls-decor"
      style={positionStyles[position]}
    >
      <div className="bouncing-ball ball-1" />
      <div className="bouncing-ball ball-2" />
      <div className="bouncing-ball ball-3" />
    </div>
  );
}
