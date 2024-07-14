import React from "react";
import "./login.css"
import styled from "styled-components";

const Button = styled.button`
  display: inline-block;

`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;
`;

export default function LoginPage() {

  const kakao = () => {
    window
    .open(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=` +
      "http://localhost:3000/auth/callback/kakao&response_type=code",
      "_self"
    )
  }

  return (
    <Container>
      <h1>
        로고
      </h1>
      <Button className="loginButton" onClick={kakao}>
        <img src="https://live-healthy-die-healthy.github.io/FrontEnd/kakao_login.png" alt="카카오 로그인"/>
      </Button>
    </Container>
  );
}
