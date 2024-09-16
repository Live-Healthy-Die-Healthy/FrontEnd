import React, { useState, useEffect } from "react";
import "./login.css";
import styled, { keyframes } from "styled-components";
import kakaoLoginLogo from "../../image/kakao_login.png";
import LOGO from "../../image/LOGO.png";
import { useNavigate } from "react-router-dom";

// 버튼 스타일링 추가
const ExploreButton = styled.button`
    background-color: #ffe396;
    color: #fa803d;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #ffd966;
        transform: scale(1.05);
    }

    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
    display: inline-block;
    opacity: ${(props) => (props.show ? 1 : 0)};
    transform: ${(props) =>
        props.show ? "translateY(0)" : "translateY(-20px)"};
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
    background-color: #fa803d;
    color: #ffe396;

    &.show-login-button {
        button {
            animation: ${slideDown} 0.5s forwards;
        }
    }
`;

const LogoImage = styled.img`
    width: 300px;
    height: auto;
    margin-bottom: 20px;
`;

export default function LoginPage() {
    const [showLoginButton, setShowLoginButton] = useState(false);
    const navigate = useNavigate();

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
            {/* "로그인없이 살펴보기" 버튼에 스타일과 navigate 함수 적용 */}
            <ExploreButton onClick={() => navigate("/home")}>
                로그인없이 살펴보기
            </ExploreButton>
            <LogoImage src={LOGO} alt='카카오 로그인' />
            <h1>치팅데이</h1>
            <Button
                className='loginButton'
                show={showLoginButton}
                onClick={kakao}
            >
                <img src={kakaoLoginLogo} alt='카카오 로그인' />
            </Button>
        </Container>
    );
}
