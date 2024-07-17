import React, { useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { format, startOfYear, endOfYear, eachYearOfInterval } from "date-fns";

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
    yearOptions.push({ value: i, label: `${i}년 레포트`, content: "" });
  }
  return yearOptions;
};

const YearlyReportPage = () => {
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (option) => {
    setSelectedYear(option);
  };

  const yearOptions = getYearOptions();

  return (
    <Container>
      <h3>연간 레포트 리스트 페이지</h3>
      <SelectWrapper>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          options={yearOptions}
          placeholder="년 선택"
        />
      </SelectWrapper>
      {selectedYear && (
        <ReportList>
          { selectedYear.content ? (
          <ReportItem>{selectedYear.content}</ReportItem>
          ):
          (
            <ReportItem> {selectedYear.label}가 존재하지 않습니다.</ReportItem>
          )
          }
        </ReportList>
      )}
    </Container>
  );
};

export default YearlyReportPage;
