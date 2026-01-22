'use client';

interface BouncingBallProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BouncingBall({ size = 'md' }: BouncingBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="bouncing-ball-container">
      <div className={`bouncing-ball ${sizeClasses[size]}`} />
    </div>
  );
}
