import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh; 
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
`;

export default function RecordTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, exercise } = location.state;
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const handleSave = () => {
    // Save the record (this can be done using a state management library or context)
    // Here, we simply navigate back to the daily training page with the new exercise details
    navigate(`/traindaily/${formattedDate}`, {
      state: { date, newExercise: `${exercise} - ${weight}kg x ${sets}세트 x ${reps}회` }
    });
  };

  return (
    <Container>
      <h3>{exercise} 기록</h3>
      <Input
        type="number"
        placeholder="중량 (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <Input
        type="number"
        placeholder="세트 수"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <Input
        type="number"
        placeholder="횟수"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <Button onClick={handleSave}>저장</Button>
    </Container>
  );
}
