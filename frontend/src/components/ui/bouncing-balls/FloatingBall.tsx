'use client';

import { useEffect, useState } from 'react';

interface FloatingBallProps {
  size?: number;
  opacity?: number;
}

export function FloatingBall({ size = 80, opacity = 0.25 }: FloatingBallProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const animate = () => {
      setPosition({
        x: Math.sin(Date.now() / 2000) * 30,
        y: Math.cos(Date.now() / 1500) * 40,
      });
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="floating-ball"
      style={{
        width: size,
        height: size,
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity,
      }}
    />
  );
}
