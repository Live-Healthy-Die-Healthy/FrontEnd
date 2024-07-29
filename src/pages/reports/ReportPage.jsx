import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SecondContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const Button = styled.button`
  background: rgb(196, 196, 196);
  height: 13vh;
  border: none;
  font-size: 25px;
  cursor: pointer;
  padding: 0 20px; /* 버튼 사이의 간격을 위해 좌우 패딩 설정 */
  margin: 10px;
`;

export default function ReportPage() {
  const navigate = useNavigate(); 

  return (
    <Container>
        <SecondContainer>
        <Button onClick={() => navigate("/dailyreport")}>일간 레포트</Button>
        <Button onClick={() => navigate("/monthlyreport")}>월간 레포트</Button>
        </SecondContainer>
        
        <SecondContainer>
        <Button onClick={() => navigate("/weeklyreport")}>주간 레포트</Button>
        <Button onClick={() => navigate("/yearlyreport")}>연간 레포트</Button>
        </SecondContainer>
    </Container>
  );
}
