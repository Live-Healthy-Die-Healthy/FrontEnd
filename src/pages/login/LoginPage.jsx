import React, { useState, useEffect } from "react";
import "./login.css"
import styled, { keyframes } from "styled-components";
import kakaoLoginLogo from "../../image/kakao_login.png";

const Button = styled.button`
  display: inline-block;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(-20px)")};
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;

  &.show-login-button {
    button {
      animation: ${slideDown} 0.5s forwards;
    }
  }
`;

export default function LoginPage() {
  const [showLoginButton, setShowLoginButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginButton(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const kakao = () => {
    window.open(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=https://live-healthy-die-healthy.github.io/FrontEnd/auth/callback/kakao&response_type=code`,
      "_self"
    );
  };

  return (
    <Container className={showLoginButton ? "show-login-button" : ""}>
      <h1>로고</h1>
      <Button className="loginButton" show={showLoginButton} onClick={kakao}>
        <img src={kakaoLoginLogo} alt="카카오 로그인" />
      </Button>
    </Container>
  );
}
