import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import catImage from '../../image/SlimCat.png';

const TOTAL_TIME = 1800000;  // 30분 = 1800000밀리초
const SIMULATION_TIME = 60000; // 시연 모드에서는 1분 동안 동작 (60000밀리초)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: #FFEDC0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const SimulationIndicator = styled.div`
  background-color: #FC6A03;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const TimerText = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProgressCircle = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 20px;
`;

const CatImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
`;

const MessageBox = styled.div`
  background-color: #FFF;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 280px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 80px;
`;

const Button = styled.button`
  background-color: #FC6A03;
  color: white;
  font-size: 18px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #E55A00;
  }
`;

export default function TimerPage() {
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [message, setMessage] = useState("식사 시작 버튼을 누르세요!");
  const [isSimulating, setIsSimulating] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const navigate = useNavigate();

  const formatTime = (milliseconds) => {
    const mins = String(Math.floor(milliseconds / 60000)).padStart(2, '0');
    const secs = String(Math.floor((milliseconds % 60000) / 1000)).padStart(2, '0');
    const millis = String(milliseconds % 1000).padStart(3, '0').slice(0, 2);
    return `${mins}:${secs}:${millis}`;
  };

  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const updateInterval = isSimulating ? 33 : 100; // 시연 모드에서는 더 자주 업데이트

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const scaleFactor = isSimulating ? TOTAL_TIME / SIMULATION_TIME : 1;
        const adjustedElapsed = elapsed * scaleFactor;
        
        const newTimeRemaining = Math.max(TOTAL_TIME - adjustedElapsed, 0);
        setTimeRemaining(newTimeRemaining);
        
        const newProgress = (newTimeRemaining / TOTAL_TIME) * 100;
        setProgress(newProgress);

        if (newTimeRemaining <= 0) {
          clearInterval(intervalRef.current);
          setMessage("식사가 완료되었습니다!");
          setIsTimerActive(false);
        } else if (newTimeRemaining > 1200000) {
          setMessage('채소를 먹을 시간입니다!');
        } else if (newTimeRemaining > 600000) {
          setMessage('단백질을 먹을 시간입니다!');
        } else {
          setMessage('탄수화물을 먹을 시간입니다!');
        }
      }, updateInterval);

      return () => clearInterval(intervalRef.current);
    }
  }, [isTimerActive, isSimulating]);

  const startTimer = () => {
    setIsTimerActive(true);
    startTimeRef.current = Date.now();
    setMessage("채소를 먹을 시간입니다!");
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(TOTAL_TIME);
    setProgress(100);
    setMessage("식사 시작 버튼을 누르세요!");
    setIsSimulating(false);
    clearInterval(intervalRef.current);
  };

  const simulateTimer = () => {
    setIsSimulating(true);
    setIsTimerActive(true);
    startTimeRef.current = Date.now();
    setTimeRemaining(TOTAL_TIME);
    setProgress(100);
    setMessage("채소를 먹을 시간입니다!");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/home')}>
          {'<'}
        </BackButton>
        {isSimulating && <SimulationIndicator>시연 모드</SimulationIndicator>}
      </Header>
      <TimerContainer>
        <TimerText>{formatTime(timeRemaining)}</TimerText>
        <ProgressCircle>
          <CircularProgressbar
            value={progress}
            styles={buildStyles({
              pathColor: '#FC6A03',
              trailColor: '#E0E0E0',
              strokeLinecap: 'round',
            })}
          />
          <CatImage src={catImage} alt="고양이" />
        </ProgressCircle>
        <MessageBox>
          {message}
        </MessageBox>
      </TimerContainer>
      <ButtonContainer>
        <Button onClick={startTimer}>식사 시작</Button>
        <Button onClick={resetTimer}>초기화</Button>
        <Button onClick={simulateTimer}>시연하기</Button>
      </ButtonContainer>
    </Container>
  );
}