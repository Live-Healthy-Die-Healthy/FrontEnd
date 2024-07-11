import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh; 
`;

const ExerciseButton = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  width: 80%;
`;

const exercises = [
  "데드리프트",
  "스쿼트",
  "벤치프레스",
  "런닝",
  "사이클링"
];

export default function SelectTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = location.state;

  const handleExerciseClick = (exercise) => {
    navigate("/recordtraining", { state: { date, exercise } });
  };

  return (
    <Container>
      <h3>운동 선택</h3>
      {exercises.map((exercise) => (
        <ExerciseButton key={exercise} onClick={() => handleExerciseClick(exercise)}>
          {exercise}
        </ExerciseButton>
      ))}
    </Container>
  );
}
