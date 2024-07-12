import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from 'axios';
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;
`;

const RecordContainer = styled.div`
  width: 80%;
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

export default function DailyTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, newExercise } = location.state || {};
  const formattedDate = format(new Date(date), "yyyy-MM-dd");
  
  const { accessToken, userId } = useContext(UserContext);

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.post('http://localhost:4000/exerciseLog', {
          exerciseDate: formattedDate,
          userId: userId
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = response.data.map(record => `${record.exerciseName} - ${record.set}세트`);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, [date, formattedDate, userId, accessToken]);

  useEffect(() => {
    if (newExercise) {
      setExercises((prevExercises) => [...prevExercises, newExercise]);
    }
  }, [newExercise]);

  const addExercise = () => {
    navigate("/selecttraining", { state: { date } });
  };

  const deleteExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
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
        <Button onClick={addExercise}>운동 추가</Button>
      </RecordContainer>
    </Container>
  );
}
