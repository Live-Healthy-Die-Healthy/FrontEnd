import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import axios from "axios";
import { useCalorie } from "../context/CalorieContext";  // HomePage.jsx
import CheatDayModal from "../components/CheatDayModal";

import { UserContext } from "../context/LoginContext";

// 이미지 import
import slimCat from '../image/SlimCat.png';
import chubbyCat from '../image/ChubbyCat.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: #ffeeae;
    position: relative;
    overflow: hidden;
    height: 98vh;
    width: 100%;
    padding-top: 20px;
`;

const ImageContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: filter 0.3s ease-in-out;
    filter: ${(props) => (props.isBlurred ? "blur(5px)" : "none")};
`;

const CharacterImage = styled.img`
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
`;

const SlideUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #ff9b26;
    transition: height 0.3s ease-in-out;
    border-top-left-radius: 50% 20%;
    border-top-right-radius: 50% 20%;
    padding-bottom: 30px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    height: ${(props) => (props.isOpen ? "40vh" : "12vh")};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
`;

const MenuButton = styled.button`
    width: 50%;
    padding: 15px;
    margin-top: 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 10px;
    font-size: 30px;
    cursor: pointer;
`;

const AddButton = styled.button`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ffcb5b;
    color: #fc6a03;
    font-size: 50px;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
`;

const PCon = styled.p`
    color: #30012f;
    font-size: 30px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
`;

const DDayInfo = styled.div`
    font-size: 28px;
    color: #fc6a03;
`;

const DateInfo = styled.div`
    font-size: 20px;
    color: #fc6a03;
    margin-top: 5px;
`;

const CalorieContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
`;

const CalorieButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 300px;
    margin-bottom: 10px;
`;

const CalorieButton = styled.button`
    padding: 10px 15px;
    font-size: 18px;
    background-color: #fc6a03;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const CalorieGraph = styled(animated.div)`
    width: 300px;
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

const MessageContainer = styled.div`
    position: absolute;
    font-size: 20px;
    bottom: 190px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 20px;
    text-align: center;
`;

const CalorieDisplay = styled.div`
    font-size: 24px;
    color: #fc6a03;
    margin-top: 20px;
    font-weight: bold;
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
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const { userId } = useContext(UserContext);
    const [isConfirming, setIsConfirming] = useState(false);
    const [characterImage, setCharacterImage] = useState(slimCat);
    const { totalCalories, setTotalCalories } = useCalorie();

    const modalAnimation = useSpring({
        transform: showCheatDayModal
            ? `translate(-50%, -50%)`
            : `translate(-50%, 100%)`,
        opacity: showCheatDayModal ? 1 : 0,
        config: { tension: 220, friction: 20 },
    });

    const handleDateSelection = (date) => {
        setSelectedCheatDay(date);
        setIsConfirming(true);
    };

    const handleConfirmCheatDay = () => {
        handleSetCheatDay();
        setIsConfirming(false);
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
            console.log("response.data : ", response.data);
            setCheatDayInfo(response.data);
            if (response.data.needsCheatDaySetup) {
                setShowCheatDayModal(true);
            }
            calculateDDay(response.data);
        } catch (error) {
            console.error("Error fetching cheat day info:", error);
        }
    };

    const handleSetCheatDay = async () => {
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

    const calculateDDay = (cheatDayInfo) => {
        if (!cheatDayInfo || !cheatDayInfo.cheatDay) return "";
        const diff = Math.ceil(
            (new Date(cheatDayInfo.cheatDay) - new Date()) /
                (1000 * 60 * 60 * 24)
        );
        setDDay(diff);
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
            <CalorieContainer>
                <CalorieDisplay>오늘의 총 섭취 칼로리: {totalCalories} kcal</CalorieDisplay>
            </CalorieContainer>

            <Header>
                <DDayInfo>D-{DDay}</DDayInfo>
                <DateInfo>{new Date().toLocaleDateString()}</DateInfo>
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

            <ImageContainer isBlurred={isMenuOpen}>
                <CharacterImage src={characterImage} alt="Character" />
                <br/>
            </ImageContainer>
            
            <br/>

            {cheatDayInfo && (
                
                <MessageContainer isBlurred={isMenuOpen}>
                    {cheatDayInfo.message}
                </MessageContainer>
            )}
            
            <br/>

            <SlideUpContainer isOpen={isMenuOpen}>
                <AddButton onClick={toggleMenu}>
                    {isMenuOpen ? "-" : "+"}
                </AddButton>
                {!isMenuOpen ? (
                    <PCon>오늘 하루도 기록해보세요!</PCon>
                ) : (
                    <PCon>무엇을 기록할까요?</PCon>
                )}
                {isMenuOpen && (
                    <>
                        <MenuButton
                            onClick={() =>
                                handleMenuClick(`/traindaily/${today}`)
                            }
                        >
                            운동
                        </MenuButton>
                        <MenuButton
                            onClick={() =>
                                handleMenuClick(`/dietdaily/${today}`)
                            }
                        >
                            식단
                        </MenuButton>
                    </>
                )}
            </SlideUpContainer>

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