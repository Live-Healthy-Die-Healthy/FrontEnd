import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const Button = styled.button`
  background: rgb(196, 196, 196);
  width: 20%;
  max-width: 200px;
  height: 20vh;
  border: none;
  font-size: 25px;
  cursor: pointer;
  padding: 0 20px; /* 버튼 사이의 간격을 위해 좌우 패딩 설정 */
  margin: 10px;
`;

export default function ProfilePage() {
  const navigate = useNavigate(); 
  // editProfile -> useLocation?

  return (
    <Container>
        <h1>프로필 api처리 (get /profile)</h1>
        <h1>해서 정보 띄우기</h1>
    </Container>
  );
}
