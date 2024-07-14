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
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const RemoveButton = styled.button`
  background: #ff6b6b;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  color: white;
  border-radius: 5px;
`;

export default function RecordTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, exerciseId, exerciseName, exerciseType, exercisePart } = location.state;
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [exerciseTime, setExerciseTime] = useState("");
  const [distance, setDistance] = useState("");
  
  const { accessToken, userId } = useContext(UserContext);

  const handleAddSet = () => {
    setSets([...sets, { weight: "", reps: "" }]);
  };

  const handleRemoveSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index, field, value) => {
    const newSets = sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    );
    setSets(newSets);
  };

  const handleSave = async () => {
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

    let exerciseData = {};

    if (exerciseType === "AerobicExercise") {
      exerciseData = {
        userId,
        exerciseId, 
        exerciseDate: formattedDate,
        exercisePart: exercisePart,
        exerciseType,
        distance: Number(distance),
        exerciseTime: Number(exerciseTime)
      };
    } else {
      const weights = sets.map(set => Number(set.weight));
      const repetitions = sets.map(set => Number(set.reps));
      exerciseData = {
        userId,
        exerciseId,
        exerciseDate: formattedDate,
        exerciseType,
        exercisePart: exercisePart,
        set: sets.length,
        weight: weights,
        repetition: repetitions,
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
              <RemoveButton onClick={() => handleRemoveSet(index)}>삭제</RemoveButton>
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
