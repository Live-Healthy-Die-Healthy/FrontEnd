// src/components/WalkTimer.js
import React from 'react';
import Timer from './Timer';

export default function WalkTimer({ isActive, onComplete }) {
  return (
    <div>
      <h2>15분 걷기 타이머</h2>
      <Timer duration={15 * 60} isActive={isActive} onComplete={onComplete} />
    </div>
  );
}