import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from 'axios';
import { UserContext } from "../../context/LoginContext";
import dummyData from "../../mocks/dummyTrain.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Header = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
`;

const AddButton = styled.button`
  background-color: #a3d2ca;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
`;

const RecordContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow-y: auto;
`;

const ExerciseItem = styled.div`
  margin-bottom: 20px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ExerciseName = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const ExerciseDetails = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExerciseDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

export default function DailyTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const { date } = location.state || {};
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

        const data = response.data.map(record => ({
          exerciseLogId: record.exerciseLogId,
          name: `${record.exerciseName} - ${record.set}세트`
        }));
        console.log("response", response);
        console.log("data", data);
        setExercises(response);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
    

    // 더미 데이터 사용
    // const data = dummyData.filter(
    //   (record) => record.exerciseDate === formattedDate
    // );
    // console.log(data);
    // setExercises(data);
  }, [formattedDate, userId, accessToken]);

  const addExercise = () => {
    navigate("/selecttraining", { state: { date } });
  };

  const deleteExercise = async (id) => {
    try {
      const response = await axios.delete('http://localhost:4000/exerciseLog', {
        data: { exerciseLogId: id },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        setExercises(exercises.filter((exercise) => exercise.id !== id));
      } else {
        alert('운동 기록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('운동 기록 삭제 중 오류가 발생했습니다.');
    }
    

  };

  const editExercise = (exerciseLogId) => {
    navigate("/edittraining", { state: { formattedDate, exerciseLogId } });
  };

  return (
    <Container>
      <Header>
        <Title>{formattedDate} 운동 기록</Title>
        <AddButton onClick={addExercise}>+</AddButton>
      </Header>
      <RecordContainer>
        {exercises.map((exercise) => (
          <ExerciseItem key={exercise.exerciseLogId}>
            <ExerciseHeader>
              <ExerciseName>{exercise.exerciseName}</ExerciseName>
              <span>{exercise.exerciseTime}분</span>
            </ExerciseHeader>
            <ExerciseDetails>
              {exercise.exerciseType === "AerobicExercise" ? (
                <ExerciseDetailItem>
                  <span>거리</span>
                  <span>{exercise.distance}km</span>
                </ExerciseDetailItem>
              ) : (
                Array.from({ length: exercise.set }).map((_, index) => (
                  <ExerciseDetailItem key={index}>
                    <span>{index + 1}세트</span>
                    <span>{exercise.weight[index]}kg x {exercise.repetition[index]}회</span>
                  </ExerciseDetailItem>
                ))
              )}
            </ExerciseDetails>
            <ButtonContainer>
              <Button onClick={() => editExercise(exercise.exerciseLogId)}>수정</Button>
              <Button onClick={() => deleteExercise(exercise.exerciseLogId)}>삭제</Button>
            </ButtonContainer>
          </ExerciseItem>
        ))}
      </RecordContainer>
    </Container>
  );
}
