import React, { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const ReportList = styled.ul`
  list-style: none;
  padding: 0;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
`;

const ReportItem = styled.li`
  padding: 10px;
  margin: 10px 0;
  background: #f0f0f0;
  border-radius: 10px;

`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DatePickerContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default function DailyReportPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <Container>
      <h3>일간 레포트 리스트 페이지</h3>
      <Button onClick={() => setShowDatePicker(true)}>
        날짜 선택
      </Button>
      {showDatePicker && (
        <Overlay>
          <DatePickerContainer>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
            />
          </DatePickerContainer>
        </Overlay>
      )}
      {selectedDate && (
        <ReportList>
          <ReportItem>
            {format(selectedDate, "yyyy년 M월 d일 EEEE 레포트")}
          </ReportItem>
        </ReportList>
      )}
    </Container>
  );
}
