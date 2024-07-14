import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { format } from "date-fns";
import dummyTrain from "../../mocks/dummyTrain.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
`;

const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const StyledCalendar = styled(Calendar)`
  width: 80%;
  height: 80vh;

  border: none;

  .react-calendar__tile {
    height: 110px;
    max-width: none; /* 타일 너비의 기본 최대값 제거 */
  }

  .react-calendar__tile--now {
    background: #fffae6;
  }
  
  .react-calendar__tile--active {
    background: #a3d2ca;
  }
  
  /* .react-calendar__month-view__days__day--saturday {
    color: #1890ff;
  }  */
  
  /* .react-calendar__month-view__days__day--sunday {
    color: red;
  } */

  @media (max-width: 768px) {
    .react-calendar__tile {
      height: calc(80vh / 6);
    }
  }
`;

export default function MonthlyDiet() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState({});
  const navigate = useNavigate();

  const fetchRecords = async (month) => {
    try {
      // 실제 서버 요청 대신 더미 데이터를 사용합니다.
      const response = await axios.post(`http://localhost:4000/exerciseCalender`, { month });
      console.log("response : ", response);
      const data = response.data.reduce((acc, record) => {
      // const data = dummyTrain.reduce((acc, record) => {
        const formattedDate = record.exerciseDate.split('T')[0];
        if (!acc[formattedDate]) acc[formattedDate] = [];
        const exerciseDetail = record.exerciseType === "AerobicExercise" 
          ? `${record.exerciseName} - ${record.exerciseTime}분`
          : `${record.exerciseName} - ${record.set}세트`;
        acc[formattedDate].push(exerciseDetail);
        return acc;
      }, {});
      setRecords(data);
      console.log("records : ",records);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    const month = date.getMonth() + 1;
    fetchRecords(month);
  }, [date]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    navigate(`/dietdaily/${format(selectedDate, "yyyy-MM-dd")}`, { state: { date: selectedDate } });
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    if (records[formattedDate]) {
      return (
        <div style={{ marginTop: "1px", fontSize: "12px", color: "#1179db" }}>
          {records[formattedDate].map((exercise, index) => (
            <div key={index}>{exercise}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
        <h1>월간 식단</h1>
      <StyledCalendarWrapper>
        <StyledCalendar
          value={date}
          onChange={handleDateChange}
          calendarType="gregory"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          minDetail="year"
          tileContent={tileContent}
          onClickDay={handleDateChange}
        />
      </StyledCalendarWrapper>
    </Container>
  );
}
