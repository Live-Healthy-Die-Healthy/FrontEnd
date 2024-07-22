import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

const FormContainer = styled.div`
    width: 80%;
    max-width: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Button = styled.button`
    background: #a3d2ca;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 10px;
`;

const SetContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`;

const RemoveButton = styled.button`
    width: 15%;
    background: #ff6b6b;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    color: white;
    border-radius: 5px;
`;

const EditTrain = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { date, exerciseLogId, exerciseName } = location.state || {};
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const { accessToken, userId } = useContext(UserContext);

    const [exerciseType, setExerciseType] = useState("");
    const [exerciseTime, setExerciseTime] = useState("");
    const [distance, setDistance] = useState("");
    const [sets, setSets] = useState([{ weight: "", reps: "" }]);

    useEffect(() => {
        const fetchExerciseLog = async () => {
            try {
                const response = await axios.post(
                    `http://${process.env.REACT_APP_API_PORT}:4000/getTrainingLog`,
                    {
                        exerciseLogId: exerciseLogId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    const data = response.data;
                    setExerciseType(data.exerciseType);
                    setExerciseTime(data.exerciseTime.toString());
                    if (data.exerciseType === "AerobicExercise") {
                        setDistance(data.distance.toString());
                    } else {
                        setSets(
                            data.weight.map((weight, index) => ({
                                weight: weight.toString(),
                                reps: data.repetition[index].toString(),
                            }))
                        );
                    }
                } else {
                    alert("운동 기록을 불러오는데 실패했습니다.");
                    navigate(`/traindaily/${formattedDate}`, {
                        state: { date },
                    });
                }
            } catch (error) {
                console.error("Error fetching exercise log:", error);
                alert("운동 기록을 불러오는 중 오류가 발생했습니다.");
                navigate(`/traindaily/${formattedDate}`, { state: { date } });
            }
        };

        fetchExerciseLog();
    }, [exerciseLogId, accessToken]);

    const handleAddSet = () => {
        setSets([...sets, { weight: "", reps: "" }]);
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleSetChange = (index, field, value) => {
        if (value > 0) {
            const newSets = sets.map((set, i) =>
                i === index ? { ...set, [field]: value } : set
            );
            setSets(newSets);
        }
    };

    const handleTimeChange = (e) => {
        const value = e.target.value;
        if (value > 0) {
            setExerciseTime(value);
        }
    };

    const handleDistanceChange = (e) => {
        const value = e.target.value;
        if (value > 0) {
            setDistance(value);
        }
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
                exerciseLogId,
                exerciseDate: formattedDate,
                exerciseType,
                distance: Number(distance),
                exerciseTime: Number(exerciseTime),
            };
        } else {
            const setsData = sets.map((set) => ({
                weight: Number(set.weight),
                repetition: Number(set.reps),
            }));
            exerciseData = {
                userId,
                exerciseLogId,
                exerciseDate: formattedDate,
                exerciseType,
                weight: setsData.map((set) => set.weight),
                repetition: setsData.map((set) => set.repetition),
                exerciseTime: Number(exerciseTime),
            };
        }

        try {
            const response = await axios.put(
                `http://${process.env.REACT_APP_API_PORT}:4000/exerciseLog`,
                exerciseData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("운동 기록이 수정되었습니다.");
                navigate(`/traindaily/${formattedDate}`, { state: { date } });
            } else {
                alert("운동 기록 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error updating exercise:", error);
            alert("운동 기록 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container>
            <h3>
                {formattedDate} &nbsp; {exerciseName} 운동 기록 수정
            </h3>
            <FormContainer>
                {exerciseType === "AerobicExercise" ? (
                    <>
                        <Input
                            type='number'
                            placeholder='총 운동 시간 (분)'
                            value={exerciseTime}
                            onChange={handleTimeChange}
                        />
                        <Input
                            type='number'
                            placeholder='운동 거리 (km)'
                            value={distance}
                            onChange={handleDistanceChange}
                        />
                    </>
                ) : (
                    <>
                        {sets.map((set, index) => (
                            <SetContainer key={index}>
                                <h3>set{index + 1}</h3>
                                <Input
                                    type='number'
                                    placeholder='중량 (kg)'
                                    value={set.weight}
                                    onChange={(e) =>
                                        handleSetChange(
                                            index,
                                            "weight",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    type='number'
                                    placeholder='횟수'
                                    value={set.reps}
                                    onChange={(e) =>
                                        handleSetChange(
                                            index,
                                            "reps",
                                            e.target.value
                                        )
                                    }
                                />
                                <RemoveButton
                                    onClick={() => handleRemoveSet(index)}
                                >
                                    삭제
                                </RemoveButton>
                            </SetContainer>
                        ))}
                        <Button onClick={handleAddSet}>+ 세트 추가</Button>
                        <Input
                            type='number'
                            placeholder='총 운동 시간 (분)'
                            value={exerciseTime}
                            onChange={handleTimeChange}
                        />
                    </>
                )}
                <Button onClick={handleSave}>수정 완료</Button>
            </FormContainer>
        </Container>
    );
};

export default EditTrain;
