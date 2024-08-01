import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { format, addDays, subDays } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10vh;
    margin-bottom: 10vh;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #5ddebe;
    cursor: pointer;
    &::before {
        content: "▶";
        display: inline-block;
        transform: ${(props) =>
            props.direction === "left" ? "rotate(180deg)" : "none"};
    }
`;

const DateText = styled.div`
    background-color: #ffeeba;
    color: #b53a14;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
`;

const ExerciseContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 800px;
    margin-top: 20px;
`;

const ExerciseItem = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const Title = styled.div`
    font-size: 30px;
    margin: 10px 10px;
`;

const TitleContainer = styled.div`
    font-size: 30px;
    margin: 10px 10px;
    display: flex;
    align-self: flex-start;
    width: 100%;
    justify-content: space-between; // 추가된 부분
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    padding: 5px;
`;

const AddButton = styled.button`
    background-color: #a3d2ca;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    margin-left: 20px;
`;

const ButtonCon = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    margin-right: 60px;
`;

export default function DailyTraining() {
    const navigate = useNavigate();
    const { date } = useParams();
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const { accessToken, userId } = useContext(UserContext);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/exerciseLog`,
                    {
                        exerciseDate: formattedDate,
                        userId: userId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const data = response.data.map((record) => ({
                    exerciseLogId: record.exerciseLogId,
                    exerciseName: record.exerciseName,
                    exerciseType: record.exerciseType,
                    exerciseImage: record.exerciseImage,
                    set: record.set,
                    weight: record.weight,
                    repetition: record.repetition,
                    distance: record.distance,
                    exerciseTime: record.exerciseTime,
                }));
                setExercises(data);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };

        fetchExercises();

        return () => {
            setExercises([]);
        };
    }, [formattedDate, userId, accessToken]);

    const addExercise = () => {
        navigate("/selecttraining", { state: { date } });
    };

    const deleteExercise = async (id) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API_PORT}/exerciseLog`,
                {
                    data: { exerciseLogId: id },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                setExercises(
                    exercises.filter(
                        (exercise) => exercise.exerciseLogId !== id
                    )
                );
            } else {
                alert("운동 기록 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting exercise:", error);
            alert("운동 기록 삭제 중 오류가 발생했습니다.");
        }
    };

    const editExercise = (exerciseLogId, exerciseName) => {
        navigate("/edittraining", {
            state: { date, exerciseLogId, exerciseName },
        });
    };

    const handleDateChange = (increment) => {
        const newDate = increment
            ? addDays(new Date(date), 1)
            : subDays(new Date(date), 1);
        navigate(`/traindaily/${format(newDate, "yyyy-MM-dd")}`);
    };

    return (
        <Container>
            <TitleContainer>
                <BackButton onClick={() => navigate(`/dietmonth`)}>
                    {"<"}
                </BackButton>
                <Title>운동 기록</Title>
                <ButtonCon>
                    <AddButton onClick={addExercise}>+</AddButton>
                </ButtonCon>
            </TitleContainer>
            <Header>
                <ArrowButton
                    direction='left'
                    onClick={() => handleDateChange(false)}
                ></ArrowButton>
                <DateText>
                    {format(new Date(formattedDate), "yyyy.MM.dd")}
                </DateText>
                <ArrowButton
                    direction='right'
                    onClick={() => handleDateChange(true)}
                ></ArrowButton>
            </Header>
            <ExerciseContainer>
                {exercises.length === 0 ? (
                    <h2>운동 기록이 없습니다.</h2>
                ) : (
                    exercises.map((exercise) => (
                        <ExerciseItem key={exercise.exerciseLogId}>
                            <ExerciseHeader>
                                <ExerciseName>
                                    {exercise.exerciseName}
                                </ExerciseName>
                                <ExerciseImage
                                    src={`data:image/jpeg;base64,${exercise.exerciseImage}`}
                                    alt={exercise.exerciseName}
                                />
                            </ExerciseHeader>
                            {exercise.exerciseType === "AerobicExercise" ? (
                                <SetContainer>
                                    <span>거리 : {exercise.distance}km</span>
                                    <span>
                                        시간 : {exercise.exerciseTime}분
                                    </span>
                                </SetContainer>
                            ) : (
                                <SetContainer>
                                    {Array.from({ length: exercise.set }).map(
                                        (_, index) => (
                                            <SetItem key={index}>
                                                <SetNumber>
                                                    {index + 1}세트
                                                </SetNumber>
                                                <SetDetail>
                                                    {exercise.weight[index]}kg
                                                </SetDetail>
                                                <SetDetail>
                                                    {exercise.repetition[index]}
                                                    회
                                                </SetDetail>
                                            </SetItem>
                                        )
                                    )}
                                </SetContainer>
                            )}
                            <ButtonContainer>
                                <Button
                                    onClick={() =>
                                        editExercise(
                                            exercise.exerciseLogId,
                                            exercise.exerciseName
                                        )
                                    }
                                >
                                    수정
                                </Button>
                                <Button
                                    onClick={() =>
                                        deleteExercise(exercise.exerciseLogId)
                                    }
                                >
                                    삭제
                                </Button>
                            </ButtonContainer>
                        </ExerciseItem>
                    ))
                )}
            </ExerciseContainer>
        </Container>
    );
}
