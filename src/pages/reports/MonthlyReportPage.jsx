import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

export default function MonthlyReportPage() {
  const navigate = useNavigate(); 

  return (
    <Container>
        <h1>Monthly</h1>
    </Container>
  );
}
