import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// SleepReminder styling
const ReminderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ReminderText = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #f44336;
  font-family: 'Roboto Mono', monospace;
  text-align: center;
`;

const AlertButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #c62828;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// SleepReminder component
const SleepReminder = ({ isActive, onAlert }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => {
          if (sec >= 15) {
            onAlert();
            return 0;
          }
          return sec + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, onAlert]);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <ReminderContainer>
      <ReminderText>
        {`졸음 감지: ${formatTime(seconds)} 초`}
      </ReminderText>
      <AlertButton onClick={onAlert}>알림 확인</AlertButton>
    </ReminderContainer>
  );
};

export default SleepReminder;