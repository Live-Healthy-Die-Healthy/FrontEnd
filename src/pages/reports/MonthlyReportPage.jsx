import React, { useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";

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

const getMonthOptions = (year) => {
  const startOfYearDate = startOfYear(new Date(year, 0));
  const endOfYearDate = endOfYear(new Date(year, 11));
  const monthsInYear = eachMonthOfInterval({ start: startOfYearDate, end: endOfYearDate });

  return monthsInYear.map((monthDate) => {
    const startOfMonthDate = startOfMonth(monthDate);
    const endOfMonthDate = endOfMonth(monthDate);

    //API로 레포트 받아오기


    return {
      value: monthDate.getMonth(),
      label: `${format(monthDate, "yyyy년 M월")} 레포트`,
      start: startOfMonthDate,
      end: endOfMonthDate,
      content: ``,
    };
  });
};

const MonthlyReportPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleYearChange = (option) => {
    setSelectedYear(option);
    setSelectedMonth(null);
  };

  const handleMonthChange = (option) => {
    setSelectedMonth(option);
  };

  const yearOptions = getYearOptions();
  const monthOptions = selectedYear ? getMonthOptions(selectedYear.value) : [];

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
      {selectedMonth && (
        <ReportList>
          { selectedMonth.content ? (
          <ReportItem>{selectedMonth.content}</ReportItem>
          ):
          (
            <ReportItem> {selectedMonth.label}가 존재하지 않습니다.</ReportItem>
          )
          }
        </ReportList>
      )}
    </Container>
  );
};

export default MonthlyReportPage ;
