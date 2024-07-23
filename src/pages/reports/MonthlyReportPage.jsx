import React, { useState, useContext } from "react";
import styled from "styled-components";
import Select from "react-select";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear, isBefore, startOfToday } from "date-fns";
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
  for (let i = currentYear - 5; i <= currentYear; i++) {
    yearOptions.push({ value: i, label: `${i}년` });
  }
  return yearOptions;
};

const getMonthOptions = (year) => {
  const startOfYearDate = startOfYear(new Date(year, 0));
  const endOfYearDate = endOfYear(new Date(year, 11));
  const monthsInYear = eachMonthOfInterval({ start: startOfYearDate, end: endOfYearDate });
  const today = startOfToday();

  return monthsInYear.map((monthDate) => {
    const startOfMonthDate = startOfMonth(monthDate);
    const endOfMonthDate = endOfMonth(monthDate);

    return {
      value: monthDate.getMonth(),
      label: `${format(monthDate, "yyyy년 M월")} 레포트`,
      start: startOfMonthDate,
      end: endOfMonthDate,
      content: ``,
      isDisabled: !isBefore(endOfMonthDate, today)
    };
  });
};

const MonthlyReportPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { userId, accessToken } = useContext(UserContext);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [alertMessage, setAlertMessage] = useState(""); 

  const handleYearChange = (option) => {
    setSelectedYear(option);
    setSelectedMonth(null);
    setAlertMessage("");
  };

  const handleMonthChange = async (option) => {
    if (option.isDisabled) {
      setAlertMessage("미래의 월은 선택할 수 없습니다.");
      return;
    }

    setSelectedMonth(option);
    setAlertMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_PORT}/report/monthly`,
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

      console.log(response);

      setMonthlyReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const yearOptions = getYearOptions();
  const monthOptions = selectedYear ? getMonthOptions(selectedYear.value) : [];

  return (
    <Container>
      <h3>월간 레포트 리스트 페이지</h3>
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
          isOptionDisabled={(option) => option.isDisabled}
        />
      </SelectWrapper>
      {selectedMonth && (
        <ReportList>
          {monthlyReport ? (
            <>
              <ReportItem>
                meanCalories : {monthlyReport.meanCalories}
              </ReportItem>
              <ReportItem>
                meanTraning : {monthlyReport.meanTraining}
              </ReportItem>
              <ReportItem>
                dietFeedback : {monthlyReport.dietFeedback}
              </ReportItem>
              <ReportItem>
                execiseFeedback : {monthlyReport.exerciseFeedback}
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

export default MonthlyReportPage;