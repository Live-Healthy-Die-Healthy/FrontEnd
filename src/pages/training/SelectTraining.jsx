import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
// import axios from "axios"; // 서버 통신 시 사용할 axios

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

const ExerciseImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const ExerciseContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default function SelectTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = location.state;

  // 더미 데이터
  const exercises = [
    {
      exerciseName: "스쿼트",
      exerciseImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" // 더미 base64 이미지 데이터
    }
  ];

  // 실제 서버 통신 코드
  // useEffect(() => {
  //   const fetchExercises = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:4000/exerciseList');
  //       setExercises(response.data);
  //     } catch (error) {
  //       console.error('Error fetching exercises:', error);
  //     }
  //   };

  //   fetchExercises();
  // }, []);

  const handleExerciseClick = (exercise) => {
    navigate("/recordtraining", { state: { date, exercise } });
  };

  return (
    <Container>
      <h3>운동 선택</h3>
      {exercises.map((exercise) => (
        <ExerciseButton key={exercise.exerciseName} onClick={() => handleExerciseClick(exercise)}>
          <ExerciseContainer>
            <ExerciseImage src={exercise.exerciseImage} alt={exercise.exerciseName} />
            {exercise.exerciseName}
          </ExerciseContainer>
        </ExerciseButton>
      ))}
    </Container>
  );
}
