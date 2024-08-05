import React, { useState, useContext } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const OverlayContainer = styled.div`
    font-size: 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const OverlayContent = styled.div`
    position: relative;
    background-color: #ffcb5b;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    text-align: center;
`;

const Input = styled.input`
    padding: 10px;
    margin: 10px;
    width: 60px;
    border: none;
    border-radius: 5px;
    background-color: #e5f3ec;
    color: #7ebc9e;
    &::placeholder {
        color: #7ebc9e;
    }
    font-size: 20px;
`;

const Button = styled.button`
    background: #ff8000;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px 5px;
    cursor: pointer;
    font-size: 20px;
    border-radius: 5px;
    &:first-of-type {
        background: #ff8000;
        color: white;
    }
`;

const SetContainer = styled.div`
    background-color: #ffffff;
    padding: 0px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`;

const RemoveButton = styled.button`
    background: #ff6b6b;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    width: 30px;
    height: 30px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    left: 10px; /* 닫기 버튼 위치 변경 */
    background: #96ceb3;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.h4`
    margin: 10px;
`;

const TimeContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 20px;
    width: 80%;
`;

const AeroContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 20px;
    width: 80%;
    margin: 10px;
    padding: 0px 10px;
`;

const RecordTrainingOverlay = ({ date, exercise, onClose, onSave }) => {
    const [sets, setSets] = useState([{ weight: "", reps: "" }]);
    const [exerciseTime, setExerciseTime] = useState("");
    const [distance, setDistance] = useState("");
    const { accessToken, userId } = useContext(UserContext);
    const formattedDate = format(new Date(date), "yyyy-MM-dd");

    const handleAddSet = () => {
        setSets([...sets, { weight: "", reps: "" }]);
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleSetChange = (index, field, value) => {
        if (value > 0 || value === "") {
            const newSets = sets.map((set, i) =>
                i === index ? { ...set, [field]: value } : set
            );
            setSets(newSets);
        }
    };

    const handleTimeChange = (e) => {
        const value = e.target.value;
        if (value > 0 || value === "") {
            setExerciseTime(value);
        }
    };

    const handleDistanceChange = (e) => {
        const value = e.target.value;
        if (value > 0 || value === "") {
            setDistance(value);
        }
    };

    const handleSave = async () => {
        let isValid = true;
        if (exercise.exerciseType === "AerobicExercise") {
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

        if (exercise.exerciseType === "AerobicExercise") {
            exerciseData = {
                userId,
                exerciseId: exercise.exerciseId,
                exerciseDate: formattedDate,
                exercisePart: exercise.exercisePart,
                exerciseType: exercise.exerciseType,
                distance: Number(distance),
                exerciseTime: Number(exerciseTime),
            };
        } else {
            const weights = sets.map((set) => Number(set.weight));
            const repetitions = sets.map((set) => Number(set.reps));
            exerciseData = {
                userId,
                exerciseId: exercise.exerciseId,
                exerciseDate: formattedDate,
                exerciseType: exercise.exerciseType,
                exercisePart: exercise.exercisePart,
                set: sets.length,
                weight: weights,
                repetition: repetitions,
                exerciseTime: Number(exerciseTime),
            };
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/addExerciseLog`,
                exerciseData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                onSave();
                onClose();
            } else {
                alert("운동 기록 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error saving exercise log:", error);
            alert("운동 기록 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <OverlayContainer onClick={onClose}>
            <OverlayContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <h3>{exercise.exerciseName}</h3>
                {exercise.exerciseType === "AerobicExercise" ? (
                    <FormContainer>
                        <AeroContainer>
                            <Label>총 운동 시간</Label>
                            <div>
                                <Input
                                    type='number'
                                    placeholder='시간'
                                    value={exerciseTime}
                                    onChange={handleTimeChange}
                                />
                                분
                            </div>
                        </AeroContainer>
                        <AeroContainer>
                            <Label>운동 거리</Label>
                            <div>
                                <Input
                                    type='number'
                                    placeholder='km'
                                    value={distance}
                                    onChange={handleDistanceChange}
                                />
                                km
                            </div>
                        </AeroContainer>
                    </FormContainer>
                ) : (
                    <Container>
                        {sets.map((set, index) => (
                            <SetContainer key={index}>
                                <h4>{index + 1}세트</h4>
                                <Input
                                    type='number'
                                    placeholder='kg'
                                    value={set.weight}
                                    onChange={(e) =>
                                        handleSetChange(
                                            index,
                                            "weight",
                                            e.target.value
                                        )
                                    }
                                />
                                kg
                                <Input
                                    type='number'
                                    placeholder='회'
                                    value={set.reps}
                                    onChange={(e) =>
                                        handleSetChange(
                                            index,
                                            "reps",
                                            e.target.value
                                        )
                                    }
                                />
                                회
                                <RemoveButton
                                    onClick={() => handleRemoveSet(index)}
                                >
                                    -
                                </RemoveButton>
                            </SetContainer>
                        ))}
                        <Button onClick={handleAddSet}>+ 세트 추가</Button>
                        <TimeContainer>
                            <Label>총 운동 시간</Label>
                            <Input
                                type='number'
                                placeholder='분'
                                value={exerciseTime}
                                onChange={handleTimeChange}
                            />
                        </TimeContainer>
                    </Container>
                )}
                <Button onClick={handleSave}>저장하기</Button>
            </OverlayContent>
        </OverlayContainer>
    );
};

export default RecordTrainingOverlay;
