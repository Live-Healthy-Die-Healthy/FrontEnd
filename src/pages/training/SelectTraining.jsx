import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
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

const TypeContainer = styled.div`
    margin-left: auto;
`;

const StarButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    margin-left: auto;
`;

export default function SelectTraining() {
    const navigate = useNavigate();
    const location = useLocation();
    const { date } = location.state;
    const { userId } = useContext(UserContext);

    const [exercises, setExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [selectedPart, setSelectedPart] = useState("");
    const [localScrapIds, setLocalScrapIds] = useState([]);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/exerciseList`,
                { userId }
            );
            const exercisesWithScrapStatus = response.data.exercisesWithBase64Images.map(exercise => ({
                ...exercise,
                isScraped: response.data.scrapIds.includes(exercise.exerciseId)
            }));
            setExercises(exercisesWithScrapStatus);
            setFilteredExercises(exercisesWithScrapStatus);
            setLocalScrapIds(response.data.scrapIds);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterExercises(e.target.value, selectedPart);
    };

    const handleFilterClick = (part) => {
        setSelectedPart(part);
        filterExercises(searchTerm, part);
    };

    const filterExercises = useCallback((term, part) => {
        const filtered = exercises.filter((exercise) => {
            const matchesPart =
                part === "all" ||
                part === "" ||
                exercise.exercisePart === part ||
                (part === "AerobicExercise" &&
                    exercise.exerciseType === "AerobicExercise") ||
                (part === "scrap" && exercise.isScraped);
            const matchesSearchTerm = exercise.exerciseName
                .toLowerCase()
                .includes(term.toLowerCase());
            return matchesPart && matchesSearchTerm;
        });
        setFilteredExercises(filtered);
    }, [exercises]);

    useEffect(() => {
        filterExercises(searchTerm, selectedPart);
    }, [filterExercises, searchTerm, selectedPart]);

    const handleExerciseClick = (
        exerciseId,
        exerciseName,
        exerciseType,
        exercisePart
    ) => {
        navigate("/recordtraining", {
            state: {
                date,
                exerciseId,
                exerciseName,
                exerciseType,
                exercisePart,
            },
        });
    };

    const handleScrapClick = useCallback(async (exerciseId) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_PORT}/exerciseScrap`, {
                userId,
                exerciseId,
            });
            
            setExercises(prevExercises => 
                prevExercises.map(exercise => 
                    exercise.exerciseId === exerciseId
                        ? { ...exercise, isScraped: !exercise.isScraped }
                        : exercise
                )
            );

            setLocalScrapIds(prev => 
                prev.includes(exerciseId) 
                    ? prev.filter(id => id !== exerciseId)
                    : [...prev, exerciseId]
            );
        } catch (error) {
            console.error("Error scrapping exercise:", error);
        }
    }, [userId]);

    const getExercisePartName = (part) => {
        switch (part) {
            case "arm":
                return "팔";
            case "chest":
                return "가슴";
            case "back":
                return "등";
            case "leg":
                return "하체";
            case "shoulder":
                return "어깨";
                case "core":
                    return "코어";
            case "AerobicExercise":
                return "유산소";
            default:
                return part;
        }
    };

    return (
        <Container>
            <h3>운동 선택</h3>
            <SearchInput
                type='text'
                placeholder='운동 이름 검색'
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
                <FilterButton onClick={() => handleFilterClick("core")}>코어</FilterButton>
                <FilterButton onClick={() => handleFilterClick("AerobicExercise")}>유산소</FilterButton>
                <FilterButton onClick={() => handleFilterClick("scrap")}>즐겨찾기 보기</FilterButton>
            </div>
            {filteredExercises.map((exercise) => (
                <ExerciseButton
                    key={exercise.exerciseId}
                    onClick={() =>
                        handleExerciseClick(
                            exercise.exerciseId,
                            exercise.exerciseName,
                            exercise.exerciseType,
                            exercise.exercisePart
                        )
                    }
                >
                    <ExerciseContainer>
                        <ExerciseImage
                            src={`data:image/jpeg;base64,${exercise.exerciseImage}`}
                            alt={exercise.exerciseName}
                        />
                        {exercise.exerciseName}
                        <div>&nbsp;</div>
                        <TypeContainer>
                            {getExercisePartName(exercise.exercisePart)}
                        </TypeContainer>
                        <StarButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleScrapClick(exercise.exerciseId);
                            }}
                        >
                            {exercise.isScraped ? "⭐" : "☆"}
                        </StarButton>
                    </ExerciseContainer>
                </ExerciseButton>
            ))}
        </Container>
    );
}