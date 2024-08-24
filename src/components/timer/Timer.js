// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// TimerText styling
const TimerText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.isActive ? '#ff5722' : '#7b1fa2')};
`;

export default function Timer({ duration, isActive, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return <TimerText isActive={isActive}>{formatTime(timeLeft)}</TimerText>;
}