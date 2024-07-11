import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

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
  width: 50%;
  height: 80vh;

  border: none;

  .react-calendar__tile {
    height: 100px;
    max-width: none; /* 타일 너비의 기본 최대값 제거 */
  }

  .react-calendar__tile--now {
    background: #fffae6;
  }
  
  .react-calendar__tile--active {
    background: #a3d2ca;
  }
  
  .react-calendar__month-view__days__day--saturday {
    color: #1890ff;
  }
  
  .react-calendar__month-view__days__day--sunday {
    color: red;
  }

  @media (max-width: 768px) {
    .react-calendar__tile {
      height: 60px;
    }
  }
`;

const RecordContainer = styled.div`
  width: 80%;
  max-width: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const ExerciseRecord = ({ date }) => {
  const records = {
    "2024-07-10": ["런닝 5km", "팔굽혀펴기 20회", "윗몸일으키기 30회"],
    "2024-07-11": ["사이클링 10km", "스쿼트 50회"]
  };

  const formattedDate = date.toISOString().split('T')[0];
  const exercises = records[formattedDate] || ["운동 기록이 없습니다."];

  return (
    <RecordContainer>
      <h3>{formattedDate} 운동 기록</h3>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>{exercise}</li>
        ))}
      </ul>
    </RecordContainer>
  );
};

export default function MonthlyTraining() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const navigate = useNavigate();

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTileDoubleClick = (selectedDate) => {
    navigate("/dailytrain", { state: { date: selectedDate } });
  };

  const tileContent = ({ date, view }) => {
    const records = {
      "2024-07-10": ["런닝 5km", "팔굽혀펴기 20회", "윗몸일으키기 30회"],
      "2024-07-11": ["사이클링 10km", "스쿼트 50회"]
    };

    const formattedDate = date.toISOString().split('T')[0];
    if (records[formattedDate]) {
      return (
        <div style={{ marginTop: "5px", fontSize: "10px", color: "#1890ff" }}>
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
          onDoubleClickDay={handleTileDoubleClick} // 타일 더블클릭 이벤트 추가
        />
      </StyledCalendarWrapper>
    </Container>
  );
}
