import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const RecordContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const ExerciseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 5px;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export default function DailyTraining() {
  const location = useLocation();
  const { date } = location.state;
  const formattedDate = date.toISOString().split("T")[0];

  const [exercises, setExercises] = useState({
    "2024-07-10": ["런닝 5km", "팔굽혀펴기 20회", "윗몸일으키기 30회"],
    "2024-07-11": ["사이클링 10km", "스쿼트 50회"]
  }[formattedDate] || []);

  const [newExercise, setNewExercise] = useState("");

  const addExercise = () => {
    setExercises([...exercises, newExercise]);
    setNewExercise("");
  };

  const deleteExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    setNewExercise(e.target.value);
  };

  return (
    <Container>
      <h3>{formattedDate} 운동 기록</h3>
      <RecordContainer>
        {exercises.map((exercise, index) => (
          <ExerciseItem key={index}>
            <span>{exercise}</span>
            <Button onClick={() => deleteExercise(index)}>삭제</Button>
          </ExerciseItem>
        ))}
        <ExerciseItem>
          <Input 
            type="text" 
            value={newExercise} 
            onChange={handleInputChange} 
            placeholder="새 운동 추가"
          />
          <Button onClick={addExercise}>추가</Button>
        </ExerciseItem>
      </RecordContainer>
    </Container>
  );
}
