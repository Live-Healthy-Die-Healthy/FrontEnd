import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"; // 서버 통신 시 사용할 axios
import dummyData from "../../mocks/dummyTrainList.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh; 
`;

const SearchInput = styled.input`
  margin: 20px 0;
  padding: 10px;
  width: 80%;
  font-size: 16px;
`;

const FilterButton = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
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

  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");

  useEffect(() => {
    // 실제 서버 통신 코드
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:4000/exerciseList');
        setExercises(response.data);
        setFilteredExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();

    // 더미 데이터 사용
    // setExercises(dummyData);
    // setFilteredExercises(dummyData);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterExercises(e.target.value, selectedPart);
  };

  const handleFilterClick = (part) => {
    setSelectedPart(part);
    filterExercises(searchTerm, part);
  };

  const filterExercises = (searchTerm, part) => {
    if(part==='all'){setFilteredExercises(exercises); return;}
    const filtered = exercises.filter((exercise) => {
      const matchesPart = part ? exercise.exercisePart === part || (part === "AerobicExercise" && exercise.exerciseType === "AerobicExercise") : true;
      const matchesSearchTerm = exercise.exerciseName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPart && matchesSearchTerm;
    });
    setFilteredExercises(filtered);
  };

  const handleExerciseClick = (exerciseId, exerciseName, exerciseType, exercisePart) => {
    navigate("/recordtraining", { state: { date, exerciseId, exerciseName, exerciseType, exercisePart } });
  };

  return (
    <Container>
      <h3>운동 선택</h3>
      <SearchInput
        type="text"
        placeholder="운동 이름 검색"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        <FilterButton onClick={() => handleFilterClick("all")}>전체</FilterButton>
        <FilterButton onClick={() => handleFilterClick("chest")}>가슴</FilterButton>
        <FilterButton onClick={() => handleFilterClick("back")}>등</FilterButton>
        <FilterButton onClick={() => handleFilterClick("arm")}>팔</FilterButton>
        <FilterButton onClick={() => handleFilterClick("leg")}>하체</FilterButton>
        <FilterButton onClick={() => handleFilterClick("shoulder")}>어깨</FilterButton>
        <FilterButton onClick={() => handleFilterClick("AerobicExercise")}>유산소</FilterButton>
      </div>
      {filteredExercises && filteredExercises.map((exercise) => (
        <ExerciseButton
         key={exercise.exerciseId} 
         onClick={() => handleExerciseClick(exercise.exerciseId ,exercise.exerciseName, exercise.exerciseType, exercise.exercisePart)}
        >
          <ExerciseContainer>
            <ExerciseImage src={exercise.exerciseImage} alt={exercise.exerciseName} />
            {exercise.exerciseName}
            <div>&nbsp;</div>
            {exercise.exercisePart}
          </ExerciseContainer>
        </ExerciseButton>
      ))}
    </Container>
  );
}
