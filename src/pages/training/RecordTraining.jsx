import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

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

const SetContainer = styled.div`
  margin: 10px 0;
`;

export default function RecordTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, exerciseId, exerciseName, exerciseType } = location.state;
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [exerciseTime, setExerciseTime] = useState("");
  const [distance, setDistance] = useState("");
  
  const { accessToken, userId } = useContext(UserContext);

  const handleAddSet = () => {
    setSets([...sets, { weight: "", reps: "" }]);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    );
    setSets(newSets);
  };

  const handleSave = async () => {
    // 유효성 검사
    let isValid = true;
    if (exerciseType === "AerobicExercise") {
      if (!exerciseTime || !distance) {
        isValid = false;
      }
    } else {
      sets.forEach((set) => {
        if (!set.weight || !set.reps) {
          isValid = false;
        }
      });
      if (!exerciseTime) {
        isValid = false;
      }
    }

    if (!isValid) {
      alert("작성하지 않은 칸이 있습니다");
      return;
    }

    // 유효성 검사를 통과한 경우
    let exerciseData = {};

    if (exerciseType === "AerobicExercise") {
      exerciseData = {
        userId,
        exerciseId, 
        exerciseDate: formattedDate,
        exerciseType,
        distance: Number(distance),
        exerciseTime: Number(exerciseTime)
      };
    } else {
      const setsData = sets.map(set => ({
        weight: Number(set.weight),
        repetition: Number(set.reps)
      }));
      exerciseData = {
        userId,
        exerciseId, // This should be dynamically set based on actual exercise data
        exerciseDate: formattedDate,
        exerciseType,
        exercisePart: "chest", // This should be dynamically set based on actual exercise data
        sets: setsData,
        exerciseTime: Number(exerciseTime)
      };
    }

    console.log("exerciseData : ", exerciseData);

    try {
      const response = await axios.post("http://localhost:4000/addExerciseLog", exerciseData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {

        navigate(`/traindaily/${formattedDate}`, {
          state: { date }
        });
      } else {
        // 요청 실패 시 에러 처리
        alert("운동 기록 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving exercise log:", error);
      alert("운동 기록 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <h3>{formattedDate} {exerciseName} 기록</h3>
      {exerciseType === "AerobicExercise" ? (
        <>
          <Input
            type="number"
            placeholder="총 운동 시간 (분)"
            value={exerciseTime}
            onChange={(e) => setExerciseTime(e.target.value)}
          />
          <Input
            type="number"
            placeholder="운동 거리 (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </>
      ) : (
        <>
          {sets.map((set, index) => (
            <SetContainer key={index}>
              <Input
                type="number"
                placeholder="중량 (kg)"
                value={set.weight}
                onChange={(e) => handleSetChange(index, "weight", e.target.value)}
              />
              <Input
                type="number"
                placeholder="횟수"
                value={set.reps}
                onChange={(e) => handleSetChange(index, "reps", e.target.value)}
              />
            </SetContainer>
          ))}
          <Button onClick={handleAddSet}>+ 세트 추가</Button>
          <Input
            type="number"
            placeholder="총 운동 시간 (분)"
            value={exerciseTime}
            onChange={(e) => setExerciseTime(e.target.value)}
          />
        </>
      )}
      <Button onClick={handleSave}>저장</Button>
    </Container>
  );
}
