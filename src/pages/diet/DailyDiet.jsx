import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

import dummyDietData from "../../mocks/dummyDailyDiet.json";

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
    max-width: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const MealContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
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
                    "http://localhost:4000/dailyDiet",
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
                console.log("response : ", response);

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
                // 더미 데이터를 설정합니다.
                const dummyMeals = {
                    breakfast: dummyDietData.filter(
                        (item) => item.dietType === "breakfast"
                    ),
                    lunch: dummyDietData.filter(
                        (item) => item.dietType === "lunch"
                    ),
                    dinner: dummyDietData.filter(
                        (item) => item.dietType === "dinner"
                    ),
                    snack: dummyDietData.filter(
                        (item) => item.dietType === "snack"
                    ),
                };

                setMeals(dummyMeals);
            }
        };

        fetchMeals();
    }, [formattedDate, userId, accessToken]);

    const handleMealClick = (dietType) => {
        navigate(`/dietdetail/${formattedDate}/${dietType}`, {
            state: { date, userId },
        });
    };

    return (
        <Container>
            <h3>{formattedDate} 일간 식단 기록</h3>
            <RecordContainer>
                <MealContainer>
                    <MealBox onClick={() => handleMealClick("breakfast")}>
                        <MealText>아침</MealText>
                        <MealDetails>
                            {meals.breakfast.length > 0 ? (
                                <>
                                    <MealDetailItem>{`총 칼로리: ${meals.breakfast.reduce(
                                        (total, item) => total + item.calories,
                                        0
                                    )} kcal`}</MealDetailItem>
                                    {meals.breakfast[0].menuNames &&
                                    Array.isArray(
                                        meals.breakfast[0].menuNames
                                    ) ? (
                                        meals.breakfast[0].menuNames.map(
                                            (menu, index) => (
                                                <MealDetailItem key={index}>
                                                    {menu}
                                                </MealDetailItem>
                                            )
                                        )
                                    ) : (
                                        <MealDetailItem>
                                            {meals.breakfast[0].menuNames ||
                                                "메뉴 정보 없음"}
                                        </MealDetailItem>
                                    )}
                                </>
                            ) : (
                                <MealDetailItem>
                                    기록이 없습니다.
                                </MealDetailItem>
                            )}
                        </MealDetails>
                    </MealBox>
                    <MealBox onClick={() => handleMealClick("lunch")}>
                        <MealText>점심</MealText>
                        <MealDetails>
                            {meals.lunch.length > 0 ? (
                                <>
                                    <MealDetailItem>{`총 칼로리: ${meals.lunch.reduce(
                                        (total, item) => total + item.calories,
                                        0
                                    )} kcal`}</MealDetailItem>
                                    {meals.lunch[0].menuNames &&
                                    Array.isArray(meals.lunch[0].menuNames) ? (
                                        meals.lunch[0].menuNames.map(
                                            (menu, index) => (
                                                <MealDetailItem key={index}>
                                                    {menu}
                                                </MealDetailItem>
                                            )
                                        )
                                    ) : (
                                        <MealDetailItem>
                                            {meals.lunch[0].menuNames ||
                                                "메뉴 정보 없음"}
                                        </MealDetailItem>
                                    )}
                                </>
                            ) : (
                                <MealDetailItem>
                                    기록이 없습니다.
                                </MealDetailItem>
                            )}
                        </MealDetails>
                    </MealBox>
                    <MealBox onClick={() => handleMealClick("dinner")}>
                        <MealText>저녁</MealText>
                        <MealDetails>
                            {meals.dinner.length > 0 ? (
                                <>
                                    <MealDetailItem>{`총 칼로리: ${meals.dinner.reduce(
                                        (total, item) => total + item.calories,
                                        0
                                    )} kcal`}</MealDetailItem>
                                    {meals.dinner[0].menuNames &&
                                    Array.isArray(meals.dinner[0].menuNames) ? (
                                        meals.dinner[0].menuNames.map(
                                            (menu, index) => (
                                                <MealDetailItem key={index}>
                                                    {menu}
                                                </MealDetailItem>
                                            )
                                        )
                                    ) : (
                                        <MealDetailItem>
                                            {meals.dinner[0].menuNames ||
                                                "메뉴 정보 없음"}
                                        </MealDetailItem>
                                    )}
                                </>
                            ) : (
                                <MealDetailItem>
                                    기록이 없습니다.
                                </MealDetailItem>
                            )}
                        </MealDetails>
                    </MealBox>
                    <MealBox onClick={() => handleMealClick("snack")}>
                        <MealText>간식</MealText>
                        <MealDetails>
                            {meals.snack.length > 0 ? (
                                <>
                                    <MealDetailItem>{`총 칼로리: ${meals.snack.reduce(
                                        (total, item) => total + item.calories,
                                        0
                                    )} kcal`}</MealDetailItem>
                                    {meals.snack[0].menuNames &&
                                    Array.isArray(meals.snack[0].menuNames) ? (
                                        meals.snack[0].menuNames.map(
                                            (menu, index) => (
                                                <MealDetailItem key={index}>
                                                    {menu}
                                                </MealDetailItem>
                                            )
                                        )
                                    ) : (
                                        <MealDetailItem>
                                            {meals.snack[0].menuNames ||
                                                "메뉴 정보 없음"}
                                        </MealDetailItem>
                                    )}
                                </>
                            ) : (
                                <MealDetailItem>
                                    기록이 없습니다.
                                </MealDetailItem>
                            )}
                        </MealDetails>
                    </MealBox>
                </MealContainer>
            </RecordContainer>
        </Container>
    );
}
