import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

const RecordContainer = styled.div`
    width: 80%;
    max-width: 800px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const MealContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
`;

const MealBox = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    background: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    padding: 0 20px;
    transition: background 0.3s;

    &:hover {
        background: #e0e0e0;
    }
`;

const MealText = styled.h4`
    margin: 0;
`;

const MealDetails = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
`;

const MealDetailItem = styled.span`
    font-size: 14px;
    &:not(:last-child)::after {
        content: "|";
        margin-left: 5px;
    }
`;

const BackButton = styled.button`
    margin: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

export default function DailyDiet() {
    const location = useLocation();
    const navigate = useNavigate();
    const { date } = location.state || {};
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const { userId, accessToken } = useContext(UserContext);
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    });

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/dailyDiet`,
                    {
                        date: formattedDate,
                        userId: userId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const fetchedMeals = response.data;
                const processedMeals = {
                    breakfast: fetchedMeals.filter(
                        (item) => item.dietType === "breakfast"
                    ),
                    lunch: fetchedMeals.filter(
                        (item) => item.dietType === "lunch"
                    ),
                    dinner: fetchedMeals.filter(
                        (item) => item.dietType === "dinner"
                    ),
                    snack: fetchedMeals.filter(
                        (item) => item.dietType === "snack"
                    ),
                };

                setMeals(processedMeals);
            } catch (error) {
                console.error("Error fetching meals:", error);
            }
        };

        fetchMeals();
    }, [formattedDate, userId, accessToken]);

    const handleMealClick = (dietType) => {
        navigate(`/dietdetail/${formattedDate}/${dietType}`, {
            state: { date, userId, activeTab: "diet" }, // activeTab 상태를 전달
        });
    };

    const renderMealBox = (dietType, mealName) => (
        <MealBox key={dietType} onClick={() => handleMealClick(dietType)}>
            <MealText>{mealName}</MealText>
            <MealDetails>
                {meals[dietType].length > 0 ? (
                    <>
                        <MealDetailItem>{`총 칼로리: ${meals[dietType].reduce(
                            (total, item) => total + item.calories,
                            0
                        )} kcal`}</MealDetailItem>
                        {meals[dietType][0].menuNames &&
                        Array.isArray(meals[dietType][0].menuNames) ? (
                            meals[dietType][0].menuNames.map((menu, index) => (
                                <MealDetailItem key={index}>
                                    {menu}
                                </MealDetailItem>
                            ))
                        ) : (
                            <MealDetailItem>
                                {meals[dietType][0].menuNames ||
                                    "메뉴 정보 없음"}
                            </MealDetailItem>
                        )}
                    </>
                ) : (
                    <MealDetailItem>기록이 없습니다.</MealDetailItem>
                )}
            </MealDetails>
        </MealBox>
    );

    return (
        <Container>
            <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
            <h3>{formattedDate} 일간 식단 기록</h3>
            <RecordContainer>
                <MealContainer>
                    {renderMealBox("breakfast", "아침")}
                    {renderMealBox("lunch", "점심")}
                    {renderMealBox("dinner", "저녁")}
                    {renderMealBox("snack", "간식")}
                </MealContainer>
            </RecordContainer>
        </Container>
    );
}
