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
  width: 80%;
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
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow-y: auto;
`;

const ExerciseItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ExerciseName = styled.h3`
  margin: 0px 20px;
  font-size: 18px;
`;

const ExerciseImage = styled.img`
  width: 50px;
  height: 50px;
`;

const SetContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px;
`;

const SetItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SetNumber = styled.span`
  font-weight: bold;
`;

const SetDetail = styled.span`
  margin: 2px 0;
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

const ExerciseDetailItem = styled.div`
  display: flex;
`;

export default function DailyTraining() {
  const location = useLocation();
  const navigate = useNavigate();
  const { date } = location.state || {};
  const formattedDate = format(new Date(date), "yyyy-MM-dd");
  const { accessToken, userId } = useContext(UserContext);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // 실제 서버 요청 부분
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
  
        // 데이터 변환 후 설정
        const data = response.data.map(record => ({
          exerciseLogId: record.exerciseLogId,
          exerciseName: record.exerciseName,
          exerciseType: record.exerciseType,
          image: record.image, // 이미지 URL 추가
          set: record.set,
          weight: record.weight,
          repetition: record.repetition,
          distance: record.distance,
          exerciseTime: record.exerciseTime
        }));
        console.log("response : ", response);
        console.log("data : ", data);
        setExercises(data); // ✨ 수정된 부분: data 사용
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
    
    // 더미 데이터를 사용합니다.
    // const data = dummyData.filter(
    //   (record) => record.exerciseDate === formattedDate
    // );
    // setExercises(data);
  }, [formattedDate, userId, accessToken]);

  const addExercise = () => {
    navigate("/selecttraining", { state: { date } });
  };

  const deleteExercise = async (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // 실제 삭제 요청 부분
    try {
      const response = await axios.delete('http://localhost:4000/exerciseLog', {
        data: { exerciseLogId: id },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        setExercises(exercises.filter((exercise) => exercise.exerciseLogId !== id));
      } else {
        alert('운동 기록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('운동 기록 삭제 중 오류가 발생했습니다.');
    }

    // 더미 데이터에서 필터링
    setExercises(exercises.filter((exercise) => exercise.exerciseLogId !== id));
  };

  const editExercise = (exerciseLogId, exerciseName) => {
    navigate("/edittraining", { state: { date, exerciseLogId, exerciseName } });
  };

  return (
    <Container>
      <Header>
        <Title>{formattedDate} 운동 기록</Title>
        <AddButton onClick={addExercise}>+</AddButton>
      </Header>
      <RecordContainer>
        {exercises.length === 0 ? (
          <h2>운동 기록이 없습니다.</h2>
        ) : (
          exercises.map((exercise) => (
            <ExerciseItem key={exercise.exerciseLogId}>
              <ExerciseHeader>
                <ExerciseDetailItem>
                  <ExerciseName>{exercise.exerciseName}</ExerciseName>
                  <div>{exercise.exerciseTime}분</div>
                </ExerciseDetailItem>
                <ExerciseImage src={exercise.image} alt={exercise.exerciseName} />
              </ExerciseHeader>

              {exercise.exerciseType === "AerobicExercise" ? (
                <SetContainer>
                  <span>거리 : {exercise.distance}km</span>
                </SetContainer>
              ) : (
                <SetContainer>
                  {Array.from({ length: exercise.set }).map((_, index) => (
                    <SetItem key={index}>
                      <SetNumber>{index + 1}세트</SetNumber>
                      <SetDetail>{exercise.weight[index]}kg</SetDetail>
                      <SetDetail>{exercise.repetition[index]}회</SetDetail>
                    </SetItem>
                  ))}
                </SetContainer>
              )}
              <ButtonContainer>
                <Button onClick={() => editExercise(exercise.exerciseLogId, exercise.exerciseName)}>수정</Button>
                <Button onClick={() => deleteExercise(exercise.exerciseLogId)}>삭제</Button>
              </ButtonContainer>
            </ExerciseItem>
          ))
        )}
      </RecordContainer>
    </Container>
  );
}
