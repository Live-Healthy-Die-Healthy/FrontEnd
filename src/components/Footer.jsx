import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // React Router를 사용하여 페이지 이동을 처리합니다.

const Container = styled.div`
  display: flex;
  justify-content: space-around; /* 버튼들이 가로로 배치되도록 설정합니다. */
  width: 97%; /* 푸터가 화면의 전체 너비를 차지하게 합니다. */
  position: fixed; /* 푸터가 항상 화면 하단에 고정되게 합니다. */
  bottom: 0;
  background-color: #f8f8f8; /* 푸터 배경색 설정 */
  padding: 10px 0; /* 패딩 설정 */
`;

const Button = styled.button`
  background: rgb(196, 196, 196);
  border: none;
  font-size: 25px;
  cursor: pointer;
  padding: 0 20px; /* 버튼 사이의 간격을 위해 좌우 패딩 설정 */
`;

export default function Footer() {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  return (
    <Container>
      <Button onClick={() => navigate("/trainmonth")}>운동</Button>
      <Button onClick={() => navigate("/diet")}>식단</Button>
      <Button onClick={() => navigate("/report")}>레포트</Button>
      <Button onClick={() => navigate("/settings")}>설정</Button>
    </Container>
  );
}
