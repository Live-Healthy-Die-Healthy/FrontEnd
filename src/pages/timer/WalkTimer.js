import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoMdWalk } from 'react-icons/io';

const walk = keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(10px) rotate(20deg); }
  50% { transform: translateX(20px) rotate(0deg); }
  75% { transform: translateX(10px) rotate(-20deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const WalkTimerContainer = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 10px;
  width: ${props => props.progress}%;
  background-color: #ff6b6b;
  transition: width 0.5s ease-in-out;
`;

const WalkIconContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  animation: ${walk} 2s infinite linear;
`;

const WalkIcon = styled(IoMdWalk)`
  font-size: 3rem;
  color: #ffffff;
`;

const TimerText = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  font-family: 'Roboto Mono', monospace;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const MotivationalText = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  margin-top: 10px;
  text-align: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
`;

const CompletionIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: #feca57;
  animation: ${pulse} 1s infinite;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.5s ease-in-out;
`;

const WalkTimer = ({ isActive, onComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [motivationalText, setMotivationalText] = useState('');

  const motivationalPhrases = [
    "Great job, keep it up!",
    "You're doing amazing!",
    "Feel the energy flow!",
    "Every step counts!",
    "You're becoming healthier with each step!"
  ];

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(sec => {
          if (sec >= 15) {
            clearInterval(interval);
            onComplete();
            return 15;
          }
          return sec + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  useEffect(() => {
    setProgress((seconds / 15) * 100);
    if (seconds % 5 === 0 && seconds > 0) {
      setMotivationalText(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
    }
  }, [seconds]);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <WalkTimerContainer>
      <TimerText>{`${formatTime(seconds)}`}</TimerText>
      <MotivationalText isVisible={motivationalText !== ''}>{motivationalText}</MotivationalText>
      <WalkIconContainer>
        <WalkIcon />
      </WalkIconContainer>
      <ProgressBar progress={progress} />
      <CompletionIcon isVisible={seconds === 15}>🎉</CompletionIcon>
    </WalkTimerContainer>
  );
};

export default WalkTimer;