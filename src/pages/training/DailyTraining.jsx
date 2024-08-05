import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
    format,
    addDays,
    subDays,
    isAfter,
    startOfDay,
    isSameDay,
    parseISO,
} from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import EditTrainingOverlay from "../../components/RecordOverlay/EditTrainingOverlay";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    height: 100vh;
`;

const BackHeader = styled.div`
    display: flex;
    align-items: center;
    width: 80%;
    padding: 50px 20px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 20px;
    margin-bottom: 50px;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 30px;
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
    font-size: 22px;
    font-weight: bold;
`;

const ExerciseContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 0 20px;
    margin-top: 20px;
`;

const ExerciseItem = styled.div`
    background-color: #ffeeae;
    border-radius: 10px;
    margin-bottom: 15px;
    padding: 15px;
`;

const ExerciseName = styled.h3`
    margin: 0 0 10px 0;
    font-size: 22px;
`;

const ExerciseImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 25px;
`;

const SetItem = styled.span`
    font-size: 20px;
    color: #666;
    margin-bottom: 5px;
`;

const ArrowIcon = styled.span`
    font-size: 20px;
`;

const AddButton = styled.button`
    background-color: #ffa500;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 30px;
    color: white;
    cursor: pointer;
    position: fixed;
    bottom: 80px;
    right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const Title = styled.div`
    font-size: 40px;
    font-weight: bold;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 40px;
    color: #fc6a03;
    cursor: pointer;
    font-weight: bold;
`;

const TrainingBox = styled.div`
    width: 80%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    background: white;
    border: 2px dashed #ff8000;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s;
    position: relative;
    padding: 0 20px;

    &:hover {
        background: #fff3e0;
    }
`;

const NoTraining = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 18px;
    color: grey;
`;
const ExerciseContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const SetInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
`;

const Vertical = styled.span`
    width: 33%;
    text-align: center;
    display: inline-block;
`;

const PlusButton = styled.div`
    width: 50px;
    height: 50px;
    background-color: #ffcb5b;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ff8000;
    font-size: 50px;
`;

export default function DailyTraining() {
    const navigate = useNavigate();
    const { date } = useParams();
    const formattedDate = format(parseISO(date), "yyyy-MM-dd");
    const { accessToken, userId } = useContext(UserContext);
    const [exercises, setExercises] = useState([]);
    const [editExerciseData, setEditExerciseData] = useState(null);

    const today = startOfDay(new Date());
    const pageDate = parseISO(formattedDate);

    useEffect(() => {
        if (isAfter(pageDate, today)) {
            navigate(`/traindaily/${format(today, "yyyy-MM-dd")}`);
        }
    }, [formattedDate, navigate, pageDate, today]);

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

                console.log(response);

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

    const editExercise = (exerciseLogId, exerciseName) => {
        setEditExerciseData({ exerciseLogId, exerciseName });
    };

    const handleDateChange = (increment) => {
        const newDate = increment ? addDays(pageDate, 1) : subDays(pageDate, 1);

        if (isAfter(newDate, today)) {
            return;
        }

        navigate(`/traindaily/${format(newDate, "yyyy-MM-dd")}`);
    };

    const handleEditSave = () => {
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
    };

    return (
        <Container>
            <BackHeader>
                <BackButton onClick={() => navigate(`/dietmonth`)}>
                    {"<"}
                </BackButton>
                <Title>운동 기록</Title>
            </BackHeader>
            <Header>
                {!isSameDay(pageDate, today) && (
                    <ArrowButton
                        direction='left'
                        onClick={() => handleDateChange(false)}
                    />
                )}
                <DateText>{format(pageDate, "yyyy.MM.dd")}</DateText>
                {isSameDay(pageDate, today) ? (
                    <ArrowButton style={{ visibility: "hidden" }} />
                ) : (
                    !isSameDay(addDays(pageDate, 1), today) && (
                        <ArrowButton
                            direction='right'
                            onClick={() => handleDateChange(true)}
                        />
                    )
                )}
            </Header>
            <TrainingBox>
                <PlusButton
                    onClick={() =>
                        navigate("/selecttraining", { state: { date } })
                    }
                >
                    +
                </PlusButton>
            </TrainingBox>
            <ExerciseContainer>
                {exercises.length === 0 ? (
                    <NoTraining>운동 기록이 없습니다.</NoTraining>
                ) : (
                    exercises.map((exercise) => (
                        <>
                            <ExerciseName>{exercise.exerciseName}</ExerciseName>
                            {exercise.exerciseType === "AerobicExercise" ? (
                                <ExerciseItem
                                    key={exercise.exerciseLogId}
                                    onClick={() =>
                                        editExercise(
                                            exercise.exerciseLogId,
                                            exercise.exerciseName
                                        )
                                    }
                                >
                                    <ExerciseContent>
                                        <ExerciseImage
                                            src={`data:image/jpeg;base64,${exercise.exerciseImage}`}
                                            alt={exercise.exerciseName}
                                        />
                                        <SetItem>
                                            {exercise.distance}km
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {exercise.exerciseTime}분
                                        </SetItem>
                                        <ArrowIcon>{">"}</ArrowIcon>
                                    </ExerciseContent>
                                </ExerciseItem>
                            ) : (
                                <ExerciseItem
                                    key={exercise.exerciseLogId}
                                    onClick={() =>
                                        editExercise(
                                            exercise.exerciseLogId,
                                            exercise.exerciseName
                                        )
                                    }
                                >
                                    <ExerciseContent>
                                        <ExerciseImage
                                            src={`data:image/jpeg;base64,${exercise.exerciseImage}`}
                                            alt={exercise.exerciseName}
                                        />
                                        <SetInfo>
                                            {Array.from({
                                                length: exercise.set,
                                            }).map((_, index) => (
                                                <SetItem key={index}>
                                                    <Vertical>
                                                        {index + 1}세트
                                                    </Vertical>
                                                    <Vertical>
                                                        {exercise.weight[index]}
                                                        kg
                                                    </Vertical>
                                                    <Vertical>
                                                        {
                                                            exercise.repetition[
                                                                index
                                                            ]
                                                        }
                                                        회
                                                    </Vertical>
                                                </SetItem>
                                            ))}
                                        </SetInfo>
                                        <ArrowIcon>{">"}</ArrowIcon>
                                    </ExerciseContent>
                                </ExerciseItem>
                            )}
                        </>
                    ))
                )}
            </ExerciseContainer>
            <AddButton onClick={addExercise}>+</AddButton>
            {editExerciseData && (
                <EditTrainingOverlay
                    exerciseLogId={editExerciseData.exerciseLogId}
                    exerciseName={editExerciseData.exerciseName}
                    date={date}
                    onClose={() => setEditExerciseData(null)}
                    onSave={handleEditSave}
                />
            )}
        </Container>
    );
}
