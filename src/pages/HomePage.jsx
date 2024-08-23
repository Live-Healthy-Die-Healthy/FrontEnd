import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import axios from "axios";
import { useCalorie } from "../context/CalorieContext";
import CheatDayModal from "../components/CheatDayModal";
import { UserContext } from "../context/LoginContext";
import Footer from "../components/Footer";

import slimCat from '../image/SlimCat.png';
import chubbyCat from '../image/ChubbyCat.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #ffeeae;
  min-height: 100vh;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  z-index: 2;
`;

const DDayInfo = styled.div`
  font-size: 28px;
  color: #fc6a03;
  font-weight: bold;
`;

const DateInfo = styled.div`
  font-size: 20px;
  color: #fc6a03;
  margin-top: 2px;
`;

const CalorieDisplay = styled.div`
  font-size: 24px;
  color: #fc6a03;
  margin-top: 5px;
  font-weight: bold;
`;

const CalorieContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
  z-index: 2;
`;

const CalorieGraph = styled(animated.div)`
  width: 100%;
  height: 30px;
  background-color: #49406f;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const CalorieFill = styled(animated.div)`
  height: 100%;
  background-color: #fc6a03;
`;

const CalorieText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-weight: bold;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  z-index: 2;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45vh;
  position: relative;
`;

const CharacterImage = styled.img`
  max-width: 85%;
  max-height: 100%;
  object-fit: contain;
`;

const MessageContainer = styled.div`
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 20px;
  text-align: center;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const BlurOverlay = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px; // Footer의 높이만큼 공간 확보
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  z-index: 3;
`;

const SlideUpContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #ff9b26;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 50px; // Footer의 높이
  left: 0;
  right: 0;
  z-index: 4;
`;

const AddButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffcb5b;
  color: #fc6a03;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PCon = styled.p`
  color: #30012f;
  font-size: 20px;
  margin: 5px 0;
  text-align: center;
`;

const MenuButton = styled.button`
  width: 80%;
  padding: 12px;
  margin-top: 8px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const getCharacterImage = (currentCalories, totalRecommendedCalories) => {
  const ratio = currentCalories / totalRecommendedCalories;
  return ratio < 0.5 ? slimCat : chubbyCat;
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cheatDayInfo, setCheatDayInfo] = useState(null);
  const [showCheatDayModal, setShowCheatDayModal] = useState(false);
  const [selectedCheatDay, setSelectedCheatDay] = useState(null);
  const [DDay, setDDay] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [characterImage, setCharacterImage] = useState(slimCat);
  
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const { userId } = useContext(UserContext);
  const { totalCalories, setTotalCalories } = useCalorie();

  const modalAnimation = useSpring({
    transform: showCheatDayModal
      ? `translate(-50%, -50%)`
      : `translate(-50%, 100%)`,
    opacity: showCheatDayModal ? 1 : 0,
    config: { tension: 220, friction: 20 },
  });

  const slideUpAnimation = useSpring({
    height: isMenuOpen ? 160 : 50,
    opacity: 1,
    config: { tension: 300, friction: 30 },
  });

  const blurAnimation = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    pointerEvents: isMenuOpen ? "auto" : "none",
  });

  const calorieProps = useSpring({
    width: cheatDayInfo
      ? (totalCalories / cheatDayInfo.totalRecommendedCalories) * 300
      : 0,
  });

  useEffect(() => {
    fetchCheatDayInfo();
  }, []);

  useEffect(() => {
    if (cheatDayInfo) {
      const image = getCharacterImage(totalCalories, cheatDayInfo.totalRecommendedCalories);
      setCharacterImage(image);
    }
  }, [totalCalories, cheatDayInfo]);

  const fetchCheatDayInfo = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_PORT}/getCheatDay`,
        { userId }
      );
      setCheatDayInfo(response.data);
      if (response.data.needsCheatDaySetup) {
        setShowCheatDayModal(true);
      }
      calculateDDay(response.data);
    } catch (error) {
      console.error("Error fetching cheat day info:", error);
    }
  };

  const calculateDDay = (cheatDayInfo) => {
    if (!cheatDayInfo || !cheatDayInfo.cheatDay) return;
    const diff = Math.ceil(
      (new Date(cheatDayInfo.cheatDay) - new Date()) / (1000 * 60 * 60 * 24)
    );
    setDDay(diff);
  };

  const handleDateSelection = (date) => {
    setSelectedCheatDay(date);
    setIsConfirming(true);
  };

  const handleConfirmCheatDay = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_PORT}/setCheatDay`, {
        userId,
        cheatDayDate: selectedCheatDay,
      });
      setShowCheatDayModal(false);
      fetchCheatDayInfo();
    } catch (error) {
      console.error("Error setting cheat day:", error);
    }
  };

  const handleReSelectDate = () => {
    setIsConfirming(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const handleMenuClick = (route) => {
    navigate(route, {
      state: { date: today },
    });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Container>
      <BlurOverlay style={blurAnimation} onClick={() => setIsMenuOpen(false)} />
      <Header>
        <DDayInfo>D-{DDay}</DDayInfo>
        <DateInfo>{new Date().toLocaleDateString()}</DateInfo>
        <CalorieDisplay>오늘의 총 섭취 칼로리: {totalCalories} kcal</CalorieDisplay>
      </Header>

      {cheatDayInfo && (
        <CalorieContainer>
          <CalorieGraph>
            <CalorieFill style={calorieProps} />
            <CalorieText>
              {Math.round(totalCalories)} / {Math.round(cheatDayInfo.totalRecommendedCalories)} kcal
            </CalorieText>
          </CalorieGraph>
        </CalorieContainer>
      )}

      <ContentWrapper>
        <ImageContainer>
          <CharacterImage src={characterImage} alt="Character" />
          {cheatDayInfo && (
            <MessageContainer>
              {cheatDayInfo.message}
            </MessageContainer>
          )}
        </ImageContainer>
      </ContentWrapper>

      <SlideUpContainer style={slideUpAnimation}>
        <AddButton onClick={toggleMenu}>
          {isMenuOpen ? "-" : "+"}
        </AddButton>
        {!isMenuOpen ? (
          <PCon>오늘 하루도 기록해보세요!</PCon>
        ) : (
          <>
            <PCon>무엇을 기록할까요?</PCon>
            <MenuButton onClick={() => handleMenuClick(`/traindaily/${today}`)}>
              운동
            </MenuButton>
            <MenuButton onClick={() => handleMenuClick(`/dietdaily/${today}`)}>
              식단
            </MenuButton>
          </>
        )}
      </SlideUpContainer>

      <Footer />

      {showCheatDayModal && (
        <CheatDayModal
          isConfirming={isConfirming}
          selectedCheatDay={selectedCheatDay}
          handleDateSelection={handleDateSelection}
          handleConfirmCheatDay={handleConfirmCheatDay}
          handleReSelectDate={handleReSelectDate}
          formatDate={formatDate}
          modalAnimation={modalAnimation}
        />
      )}
    </Container>
  );
}