'use client';

interface BouncingBallProps {
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}

export function BouncingBall({ size = 'md', delay = 0 }: BouncingBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="bouncing-ball-container">
      <div 
        className={`bouncing-ball ${sizeClasses[size]}`}
        style={{ animationDelay: `${delay}ms` }}
      />
    </div>
  );
}
