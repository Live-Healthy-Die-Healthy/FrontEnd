import React, { useContext, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, isBefore, startOfToday } from "date-fns";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";

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
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const SelectWrapper = styled.div`
  width: 200px;
  margin-bottom: 20px;
`;

const AlertMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 7; i <= currentYear; i++) {
    yearOptions.push({ value: i, label: `${i}년` });
  }
  return yearOptions;
};

const getMonthOptions = () => {
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    monthOptions.push({ value: i, label: `${i + 1}월` });
  }
  return monthOptions;
};

const WeeklyReportPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [startOfWeek, setStartOfWeek] = useState(null);
  const { userId, accessToken } = useContext(UserContext);
  const [weeklyReport, setWeeklyReport] = useState(null); 

  const [alertMessage, setAlertMessage] = useState("");

  const getWeekOptions = (year, month) => {
    const startOfMonthDate = startOfMonth(new Date(year, month));
    const endOfMonthDate = endOfMonth(new Date(year, month));
    const weeksInMonth = eachWeekOfInterval({ start: startOfMonthDate, end: endOfMonthDate }, { weekStartsOn: 1 });
    const today = startOfToday();
  
    return weeksInMonth.map((startOfWeekDate, index) => {
      const endOfWeekDate = endOfWeek(startOfWeekDate, { weekStartsOn: 1 });
      return {
        value: index + 1,
        label: `${index + 1}주차 레포트`,
        start: startOfWeekDate,
        end: endOfWeekDate,
        content: ``,
        isDisabled: !isBefore(endOfWeekDate, today)
      };
    });
  };

  const handleYearChange = (option) => {
    setSelectedYear(option);
    setSelectedMonth(null);
    setSelectedWeek(null);
    setAlertMessage("");
  };

  const handleMonthChange = (option) => {
    setSelectedMonth(option);
    setSelectedWeek(null);
    setAlertMessage("");
  };

  const handleWeekChange = async (option) => {
    if (option.isDisabled) {
      setAlertMessage("미래의 주차는 선택할 수 없습니다.");
      return;
    }

    setSelectedWeek(option);
    setStartOfWeek(format(option.start, "yyyy-MM-dd"));
    setAlertMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_PORT}/report/weekly`,
        {
          userId: userId,
          date: format(option.start, "yyyy-MM-dd"),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setWeeklyReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const yearOptions = getYearOptions();
  const monthOptions = selectedYear ? getMonthOptions() : [];
  const weekOptions = selectedYear && selectedMonth ? getWeekOptions(selectedYear.value, selectedMonth.value) : [];

  return (
    <Container>
      <h3>주간 레포트 리스트 페이지</h3>
      {alertMessage && <AlertMessage>{alertMessage}</AlertMessage>}
      <SelectWrapper>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          options={yearOptions}
          placeholder="년 선택"
        />
      </SelectWrapper>
      <SelectWrapper>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          options={monthOptions}
          placeholder="월 선택"
          isDisabled={!selectedYear}
        />
      </SelectWrapper>
      <SelectWrapper>
        <Select
          value={selectedWeek}
          onChange={handleWeekChange}
          options={weekOptions}
          placeholder="주차 선택"
          isDisabled={!selectedMonth}
          isOptionDisabled={(option) => option.isDisabled}
        />
      </SelectWrapper>
      {selectedWeek && (
        <ReportList>
          {weeklyReport ? (
            <>
            <ReportItem>
              meanCalories : {weeklyReport.meanCalories}
              </ReportItem>
              <ReportItem>
              meanExercise : {weeklyReport.meanExercise}
              </ReportItem>
              <ReportItem>
              dietFeedback : {weeklyReport.dietFeedback}
              </ReportItem>
              <ReportItem>
              execiseFeedback : {weeklyReport.exerciseFeedback}
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
};

export default WeeklyReportPage;
