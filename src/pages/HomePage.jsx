import React, { useState, useEffect, useContext, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { animated, useSpring, config } from "react-spring";
import axios from "axios";
import { useCalorie } from "../context/CalorieContext";
import CheatDayModal from "../components/CheatDayModal";
import { UserContext } from "../context/LoginContext";
import Footer from "../components/Footer";

import slimCat from '../image/SlimCat.png';
import chubbyCat from '../image/ChubbyCat.png';

const colors = {
  primary: "#FF9800",
  secondary: "#FF5722",
  background: "#FFF3E0",
  text: "#5D4037",
  white: "#FFFFFF",
  gray: "#BDBDBD",
  lightGray: "#F5F5F5",
  calorieBarBackground: "#FFE082",
  calorieBarFill: "#FF6F00",
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: ${colors.background};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: ${colors.background};
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;

const CheatingDayText = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: ${colors.primary};
  text-align: center;
  white-space: pre-line;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const DateInfoText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.text};
  text-align: center;
  margin-bottom: 15px;
`;

const CalorieContainer = styled.div`
  width: 100%;
  max-width: 350px;
  margin-bottom: 25px;
`;

const CalorieTitle = styled.h2`
  font-size: 24px;
  color: ${colors.text};
  margin-bottom: 15px;
  text-align: center;
`;

const CalorieGraph = styled(animated.div)`
  width: 100%;
  height: 30px;
  background-color: ${colors.calorieBarBackground};
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const CalorieFill = styled(animated.div)`
  height: 100%;
  background-color: ${colors.calorieBarFill};
  border-radius: 15px;
  transition: width 0.5s ease;
`;

const CalorieText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: ${colors.white};
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const ContentWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;

const CharacterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const CharacterImage = styled.img`
  width: 160px;
  height: auto;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
`;

const MessageBubble = styled(animated.div)`
  position: relative;
  margin-top: 5px;
  background-color: ${colors.white};
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 16px;
  color: ${colors.text};
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  max-width: 280px;
  text-align: center;
  white-space: pre-line;
  margin-bottom: 120px;
`;

const AddButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: 32px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease, transform 0.1s ease; /* transform 애니메이션 제거 */

  &:hover {
    background-color: ${colors.secondary};
  }

  &:active {
    transform: scale(0.95); /* 크기만 줄이기 */
  }
`;

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  z-index: 998;
`;

const MenuContainer = styled(animated.div)`
  position: fixed;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${colors.white};
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  background-color: ${colors.lightGray};
  color: ${colors.text};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: ${colors.gray};
  }
`;

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cheatDayInfo, setCheatDayInfo] = useState(null);
  const [showCheatDayModal, setShowCheatDayModal] = useState(false);
  const [selectedCheatDay, setSelectedCheatDay] = useState(null);
  const [DDay, setDDay] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const { userId } = useContext(UserContext);
  const { totalCalories } = useCalorie();

  const modalAnimation = useSpring({
    transform: showCheatDayModal ? `translate(-50%, -50%)` : `translate(-50%, 100%)`,
    opacity: showCheatDayModal ? 1 : 0,
    config: config.gentle,
  });

  const menuAnimation = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? "translateY(0)" : "translateY(100px)",
    config: config.gentle,
  });

  useEffect(() => {
    fetchCheatDayInfo();
  }, []);

  const fetchCheatDayInfo = useCallback(async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_PORT}/getCheatDay`, { userId });
      setCheatDayInfo(response.data);
      calculateDDay(response.data);
    } catch (error) {
      console.error("Error fetching cheat day info:", error);
    }
  }, [userId]);

  const calculateDDay = (cheatDayInfo) => {
    if (!cheatDayInfo || !cheatDayInfo.cheatDay) return;
    const diff = Math.ceil((new Date(cheatDayInfo.cheatDay) - new Date()) / (1000 * 60 * 60 * 24));
    setDDay(diff);
  };

  const formatCheatDayDate = (cheatDay) => {
    const date = new Date(cheatDay);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("ko-KR", options);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <CheatingDayText>
            치팅데이까지{`\n`}
            {DDay}일{`\n`}
            남았어요!
          </CheatingDayText>
          <DateInfoText>
            치팅데이 날짜 : {cheatDayInfo ? formatCheatDayDate(cheatDayInfo.cheatDay) : "N/A"}
          </DateInfoText>
        </Header>

        <CalorieContainer>
          <CalorieTitle>오늘의 총 섭취 칼로리</CalorieTitle>
          <CalorieGraph>
            <CalorieFill style={{ width: `${(totalCalories / cheatDayInfo?.totalRecommendedCalories) * 100}%` }} />
            <CalorieText>
              {Math.round(totalCalories)} / {cheatDayInfo ? Math.round(cheatDayInfo.totalRecommendedCalories) : 0} kcal
            </CalorieText>
          </CalorieGraph>
        </CalorieContainer>

        <ContentWrapper>
          <CharacterContainer>
            <img src={slimCat} alt="고양이 캐릭터" />
          </CharacterContainer>
          <MessageBubble>
            잘하고 있어요!{`\n`}이대로 쭉 고고!
          </MessageBubble>
        </ContentWrapper>

        <AddButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "×" : "+"}
        </AddButton>

        {isMenuOpen && (
          <>
            <BlurOverlay onClick={() => setIsMenuOpen(false)} />
            <MenuContainer style={menuAnimation}>
              <MenuButton onClick={() => {
                navigate(`/traindaily/${today}`);
                setIsMenuOpen(false);
              }}>
                운동 기록하기
              </MenuButton>
              <MenuButton onClick={() => {
                navigate(`/dietdaily/${today}`);
                setIsMenuOpen(false);
              }}>
                식단 기록하기
              </MenuButton>
              <MenuButton onClick={() => {
                navigate(`/timer`);
                setIsMenuOpen(false);
              }}>
                타이머 시작하기
              </MenuButton>
            </MenuContainer>
          </>
        )}

        <Footer />
      </Container>
    </>
  );
}