import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import RecordTrainingOverlay from "../../components/RecordOverlay/RecordTrainingOverlay";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10vh;
    margin-bottom: 10vh;
`;

const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    padding: 10px;
    width: 80%;
    font-size: 2vw;
    background-color: rgba(150, 206, 179, 0.25);
    color: black;
    border-radius: 30px;

    &::placeholder {
        color: #7ebc9e;
    }

    @media (max-width: 768px) {
        font-size: 4vw;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const FilterContainer = styled.div`
    display: flex;
    overflow-x: scroll;
    white-space: nowrap;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    scrollbar-width: none; /* Firefox */
    cursor: grab;

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }

    & > * {
        scroll-snap-align: start;
        flex-shrink: 0; /* Prevents the items from shrinking */
    }
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding-left: 20px; /* Optional: Add some padding to the left */
`;

const MenuSelect = styled.div`
    font-size: 4vw;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 4vw; /* Responsive font size */
    cursor: pointer;
    align-self: flex-start;
    margin: 0px 5px;
    font-weight: bold;
    color: #fc6a03;

    @media (max-width: 768px) {
        font-size: 4vw;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const ExerciseButton = styled.button`
    background: #ffeeae;
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

const FilterButton = styled.button`
    background: #ffffff;
    border: 2px solid #a3d2ca;
    border-radius: 15px;
    padding: 5px 10px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 16px;
    flex-shrink: 0;
    scroll-snap-align: start;
    &.active {
        background-color: #cbf1df;
    }
    &:hover {
        background: #cbf1df;
    }
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
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // 새로 추가된 상태
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/exerciseList`,
                { userId }
            );
            const exercisesWithScrapStatus =
                response.data.exercisesWithBase64Images.map((exercise) => ({
                    ...exercise,
                    isScraped: response.data.scrapIds.includes(
                        exercise.exerciseId
                    ),
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

    const filterExercises = useCallback(
        (term, part) => {
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
        },
        [exercises]
    );

    useEffect(() => {
        filterExercises(searchTerm, selectedPart);
    }, [filterExercises, searchTerm, selectedPart]);

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setShowOverlay(true);
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setSelectedExercise(null);
    };

    const handleSaveExercise = () => {
        // 운동 저장 후 필요한 작업 수행
        // 예: 운동 목록 새로고침
        fetchExercises();
    };

    const handleScrapClick = useCallback(
        async (exerciseId) => {
            try {
                await axios.post(
                    `${process.env.REACT_APP_API_PORT}/exerciseScrap`,
                    {
                        userId,
                        exerciseId,
                    }
                );

                setExercises((prevExercises) =>
                    prevExercises.map((exercise) =>
                        exercise.exerciseId === exerciseId
                            ? { ...exercise, isScraped: !exercise.isScraped }
                            : exercise
                    )
                );

                setLocalScrapIds((prev) =>
                    prev.includes(exerciseId)
                        ? prev.filter((id) => id !== exerciseId)
                        : [...prev, exerciseId]
                );
            } catch (error) {
                console.error("Error scrapping exercise:", error);
            }
        },
        [userId]
    );

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

    const startDragging = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const onDragging = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX) * 1.5; //scroll-fast
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}>&lt; </BackButton>
                <MenuSelect>운동선택</MenuSelect>
            </Header>
            <SearchInput
                type='text'
                placeholder='운동 이름 검색'
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FilterContainer
                onMouseDown={startDragging}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
                onMouseMove={onDragging}
            >
                <FilterButton
                    onClick={() => handleFilterClick("all")}
                    className={selectedPart === "all" ? "active" : ""}
                >
                    전체
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("chest")}
                    className={selectedPart === "chest" ? "active" : ""}
                >
                    가슴
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("back")}
                    className={selectedPart === "back" ? "active" : ""}
                >
                    등
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("arm")}
                    className={selectedPart === "arm" ? "active" : ""}
                >
                    팔
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("leg")}
                    className={selectedPart === "leg" ? "active" : ""}
                >
                    하체
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("shoulder")}
                    className={selectedPart === "shoulder" ? "active" : ""}
                >
                    어깨
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("core")}
                    className={selectedPart === "core" ? "active" : ""}
                >
                    코어
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("AerobicExercise")}
                    className={
                        selectedPart === "AerobicExercise" ? "active" : ""
                    }
                >
                    유산소
                </FilterButton>
                <FilterButton
                    onClick={() => handleFilterClick("scrap")}
                    className={selectedPart === "scrap" ? "active" : ""}
                >
                    즐겨찾기 보기
                </FilterButton>
            </FilterContainer>
            {filteredExercises.map((exercise) => (
                <ExerciseButton
                    key={exercise.exerciseId}
                    onClick={() => handleExerciseClick(exercise)}
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
            {showOverlay && selectedExercise && (
                <RecordTrainingOverlay
                    date={date}
                    exercise={selectedExercise}
                    onClose={handleCloseOverlay}
                    onSave={handleSaveExercise}
                />
            )}
        </Container>
    );
}
