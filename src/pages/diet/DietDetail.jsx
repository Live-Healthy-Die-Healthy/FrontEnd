import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
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

export default function DietDetail() {
  const location = useLocation();
  const { date, userId } = location.state || {};
  const { mealType } = useParams();
  const { accessToken } = useContext(UserContext);
  const [dietData, setDietData] = useState(null);

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/diet`, {
          date,
          userId,
          mealType
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setDietData(response.data);
      } catch (error) {
        console.error('Error fetching diet data:', error);
      }
    };

    fetchDietData();
  }, [date, userId, mealType, accessToken]);

  const getMealTypeText = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return '아침 식단 기록';
      case 'lunch':
        return '점심 식단 기록';
      case 'dinner':
        return '저녁 식단 기록';
      case 'snack':
        return '간식 식단 기록';
      default:
        return '식단 기록';
    }
  };

  return (
    <Container>
      <h3>{getMealTypeText(mealType)}</h3>
      <RecordContainer>
        {dietData ? (
          <div>
            {/* 식단 데이터를 표시할 JSX 코드 */}
            <p>{dietData}</p>
          </div>
        ) : (
          <p>식단 데이터를 불러오는 중입니다...</p>
        )}
      </RecordContainer>
    </Container>
  );
}
