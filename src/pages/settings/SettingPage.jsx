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

const Button = styled.button`
  background: rgb(196, 196, 196);
  width: 20%;
  max-width: 200px;
  height: 20vh;
  border: none;
  font-size: 25px;
  cursor: pointer;
  padding: 0 20px; 
  margin: 10px;
`;

export default function SettingPage() {
  const navigate = useNavigate(); 

  return (
    <Container>
        <Button onClick={() => navigate("/profile")}>프로필</Button>
        <Button onClick={() => navigate("/friends")}>친구 리스트</Button>
    </Container>
  );
}
