import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { format, isAfter, startOfDay } from "date-fns"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
`;

const ReportItem = styled.div`
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

const AlertMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

export default function DailyReportPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태 추가
  const { accessToken, userId } = useContext(UserContext);

  const handleDateChange = async (date) => {
    const today = startOfDay(new Date()); // 오늘 날짜의 시작
    if (isAfter(date, today)) {
      setAlertMessage("오늘 이후의 날짜는 선택할 수 없습니다. 다시 선택해주세요.");
      return; // 함수 실행 중단
    }

    setSelectedDate(date);
    setShowDatePicker(false);
    setAlertMessage(""); // 알림 메시지 초기화

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_PORT}/report/daily`,
        {
          userId: userId,
          date: format(date, "yyyy-MM-dd"),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setDailyReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <Container>
      <h3>일간 레포트 리스트 페이지</h3>
      <Button onClick={() => setShowDatePicker(true)}>
        날짜 선택
      </Button>
      {alertMessage && <AlertMessage>{alertMessage}</AlertMessage>}
      {showDatePicker && (
        <Overlay>
          <DatePickerContainer>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              maxDate={new Date()} // 오늘 날짜까지만 선택 가능
              inline
            />
          </DatePickerContainer>
        </Overlay>
      )}
      {selectedDate && (
        <ReportList>
          {dailyReport ? (
            <>
              <ReportItem>
                totalCalories : {dailyReport.totalCalories}
              </ReportItem>
              <ReportItem>
                totalTraning : {dailyReport.totalTraining}
              </ReportItem>
              <ReportItem>
                dietFeedback : {dailyReport.dietFeedback}
              </ReportItem>
              <ReportItem>
                execiseFeedback : {dailyReport.exerciseFeedback}
              </ReportItem>
            </>
          ) : (
            <ReportItem>
              <div>레포트가 존재하지 않습니다.</div>
            </ReportItem>
          )}
        </ReportList>
      )}
    </Container>
  );
}