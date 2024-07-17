import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from 'axios';
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
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  flex-direction: column;
  align-items: flex-start;
`;

const MealDetailItem = styled.span`
  font-size: 14px;
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
    snack: []
  });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.post('http://localhost:4000/dailyDiet', {
          date: formattedDate,
          userId: userId
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setMeals(response.data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, [formattedDate, userId, accessToken]);

  const handleMealClick = (mealType) => {
    navigate(`/dietdetail/${mealType}`, { state: { date, userId } });
  };

  return (
    <Container>
      <h3>{formattedDate} 일간 식단 기록</h3>
      <RecordContainer>
        <MealContainer>
          <MealBox onClick={() => handleMealClick('breakfast')}>
            <MealText>아침</MealText>
            <MealDetails>
              {meals.breakfast.map((item, index) => (
                <MealDetailItem key={index}>{item}</MealDetailItem>
              ))}
            </MealDetails>
          </MealBox>
          <MealBox onClick={() => handleMealClick('lunch')}>
            <MealText>점심</MealText>
            <MealDetails>
              {meals.lunch.map((item, index) => (
                <MealDetailItem key={index}>{item}</MealDetailItem>
              ))}
            </MealDetails>
          </MealBox>
          <MealBox onClick={() => handleMealClick('dinner')}>
            <MealText>저녁</MealText>
            <MealDetails>
              {meals.dinner.map((item, index) => (
                <MealDetailItem key={index}>{item}</MealDetailItem>
              ))}
            </MealDetails>
          </MealBox>
          <MealBox onClick={() => handleMealClick('snack')}>
            <MealText>간식</MealText>
            <MealDetails>
              {meals.snack.map((item, index) => (
                <MealDetailItem key={index}>{item}</MealDetailItem>
              ))}
            </MealDetails>
          </MealBox>
        </MealContainer>
      </RecordContainer>
    </Container>
  );
}
