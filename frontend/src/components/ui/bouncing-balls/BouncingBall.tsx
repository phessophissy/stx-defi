'use client';

interface BouncingBallProps {
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  variant?: 'light' | 'medium' | 'dark';
  speed?: 'slow' | 'normal' | 'fast';
}

export function BouncingBall({ 
  size = 'md', 
  delay = 0, 
  variant = 'medium',
  speed = 'normal',
}: BouncingBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const variantStyles = {
    light: 'rgba(232, 201, 168, 0.35)',
    medium: 'rgba(196, 149, 106, 0.3)',
    dark: 'rgba(139, 99, 64, 0.4)',
  };

  const speedClass = {
    slow: 'bouncing-ball-slow',
    normal: '',
    fast: 'bouncing-ball-fast',
  };

  return (
    <div className="bouncing-ball-container">
      <div 
        className={`bouncing-ball ${sizeClasses[size]} ${speedClass[speed]}`}
        style={{ 
          animationDelay: `${delay}ms`,
          background: variantStyles[variant],
        }}
      />
    </div>
  );
}
