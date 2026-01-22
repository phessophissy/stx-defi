'use client';

import { BouncingBallsDecor } from './BouncingBallsDecor';

interface BackgroundBallsProps {
  showLeft?: boolean;
  showRight?: boolean;
}

export function BackgroundBalls({ 
  showLeft = false, 
  showRight = true 
}: BackgroundBallsProps) {
  return (
    <>
      {showRight && <BouncingBallsDecor position="bottom-right" />}
      {showLeft && <BouncingBallsDecor position="bottom-left" />}
    </>
  );
}
