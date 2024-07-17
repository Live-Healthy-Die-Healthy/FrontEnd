import React, { useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";

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

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
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

const getWeekOptions = (year, month) => {
  const startOfMonthDate = startOfMonth(new Date(year, month));
  const endOfMonthDate = endOfMonth(new Date(year, month));
  const weeksInMonth = eachWeekOfInterval({ start: startOfMonthDate, end: endOfMonthDate }, { weekStartsOn: 0 });

  return weeksInMonth.map((startOfWeekDate, index) => {
    const endOfWeekDate = endOfWeek(startOfWeekDate, { weekStartsOn: 0 });
    return {
      value: index + 1,
      label: `${index + 1}주차 레포트`,
      start: startOfWeekDate,
      end: endOfWeekDate,
      content: ``,
    };
  });
};

const WeeklyReportPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const handleYearChange = (option) => {
    setSelectedYear(option);
    setSelectedMonth(null);
    setSelectedWeek(null);
  };

  const handleMonthChange = (option) => {
    setSelectedMonth(option);
    setSelectedWeek(null);
  };

  const handleWeekChange = (option) => {
    setSelectedWeek(option);
  };

  const yearOptions = getYearOptions();
  const monthOptions = selectedYear ? getMonthOptions() : [];
  const weekOptions = selectedYear && selectedMonth ? getWeekOptions(selectedYear.value, selectedMonth.value) : [];

  return (
    <Container>
      <h3>주간 레포트 리스트 페이지</h3>
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
        />
      </SelectWrapper>
      {selectedWeek && (
        <ReportList>
          { selectedWeek.content ? (
          <ReportItem>{selectedWeek.content}</ReportItem>
          ):
          (
            <ReportItem> {selectedWeek.label}가 존재하지 않습니다.</ReportItem>
          )
          }
        </ReportList>
      )}
    </Container>
  );
};

export default WeeklyReportPage;
