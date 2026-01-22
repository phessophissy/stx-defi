'use client';

import { useEffect, useRef, useState } from 'react';

interface InteractiveBallProps {
  size?: number;
}

export function InteractiveBall({ size = 60 }: InteractiveBallProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.02;
      const deltaY = (e.clientY - centerY) * 0.02;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bouncing-ball-container"
    >
      <div 
        className="bouncing-ball"
        style={{
          width: size,
          height: size,
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </div>
  );
}
