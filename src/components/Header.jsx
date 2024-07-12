import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // React Router를 사용하여 페이지 이동을 처리합니다.

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 로고와 알림 아이콘이 양 끝에 위치하게 합니다. */
  align-items: center;
  width: 95%;
  padding: 10px 20px;
  background-color: #f8f8f8; /* 헤더 배경색 설정 */
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;

const NotificationIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
`;

export default function Header() {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/home")}>대충 로고</Logo>
      <NotificationIcon onClick={() => navigate("/notifications")}>
        알림
      </NotificationIcon>
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          navigate("/");
        }}
      >로그아웃</button>
    </HeaderContainer>
  );
}
