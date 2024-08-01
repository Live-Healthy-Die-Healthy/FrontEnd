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

const MealContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
`;

const MealText = styled.h4`
    margin: 10px 5px;
    background-color: #ffeeae;
    border-radius: 20px;
    padding: 5px 20px;
    display: inline-block;
    width: fit-content;
`;

const MealBox = styled.div`
    width: 90%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: ${(props) => (props.hasMeals ? "#FFCB5B" : "white")};
    border: ${(props) => (props.hasMeals ? "none" : "2px dashed #FF8000")};
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s;
    position: relative;
    padding: 0 20px;

    &:hover {
        background: ${(props) => (props.hasMeals ? "#E0A800" : "#FFF3E0")};
    }
`;

const PlusButton = styled.div`
    width: 50px;
    height: 50px;
    background-color: #ff8000;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffcb5b;
    font-size: 50px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

const MealDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const MenuNames = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const MenuColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const MealDetailItem = styled.span`
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    margin: 3px 0px;
`;

const CaloriesInfo = styled.span`
    font-size: 14px;
    font-weight: bold;
`;

const Title = styled.div``;

const TitleContainer = styled.div`
    font-size: 30px;
    margin: 10px 10px;
    display: flex;
    align-self: flex-start;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    padding: 5px;
`;

export default function DailyDiet() {
    const navigate = useNavigate();
    const { date } = useParams();
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

    const handleDateChange = (increment) => {
        const newDate = increment
            ? addDays(new Date(date), 1)
            : subDays(new Date(date), 1);
        navigate(`/dietdaily/${format(newDate, "yyyy-MM-dd")}`);
    };

    const renderMealBox = (dietType, mealName) => {
        const mealItems = meals[dietType];
        const totalCalories = mealItems.reduce(
            (total, item) => total + item.calories,
            0
        );
        const hasMeals = totalCalories > 0;

        return (
            <React.Fragment key={dietType}>
                <MealText>{mealName}</MealText>
                <MealBox
                    hasMeals={hasMeals}
                    onClick={() => handleMealClick(dietType)}
                >
                    {hasMeals ? (
                        <MealDetails>
                            <MenuNames>
                                {mealItems[0].menuNames &&
                                Array.isArray(mealItems[0].menuNames) ? (
                                    Array(
                                        Math.ceil(
                                            mealItems[0].menuNames.length / 3
                                        )
                                    )
                                        .fill()
                                        .map((_, columnIndex) => (
                                            <MenuColumn key={columnIndex}>
                                                {mealItems[0].menuNames
                                                    .slice(
                                                        columnIndex * 3,
                                                        columnIndex * 3 + 3
                                                    )
                                                    .map((menu, index) => (
                                                        <MealDetailItem
                                                            key={index}
                                                        >
                                                            {menu}
                                                        </MealDetailItem>
                                                    ))}
                                            </MenuColumn>
                                        ))
                                ) : (
                                    <MealDetailItem>
                                        {mealItems[0].menuNames ||
                                            "메뉴 정보 없음"}
                                    </MealDetailItem>
                                )}
                            </MenuNames>
                            <CaloriesInfo>{`총 칼로리: ${totalCalories} kcal`}</CaloriesInfo>
                        </MealDetails>
                    ) : (
                        <PlusButton>+</PlusButton>
                    )}
                </MealBox>
            </React.Fragment>
        );
    };

    return (
        <Container>
            <TitleContainer>
                <BackButton onClick={() => navigate(`/dietmonth`)}>
                    {"<"}
                </BackButton>
                <Title>식단기록</Title>
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
            <MealContainer>
                {renderMealBox("breakfast", "아침")}
                {renderMealBox("lunch", "점심")}
                {renderMealBox("dinner", "저녁")}
                {renderMealBox("snack", "간식")}
            </MealContainer>
        </Container>
    );
}
