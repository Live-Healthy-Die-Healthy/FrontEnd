import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import axios from "axios";
import ThreeModel from "../components/ThreeModel";
import { UserContext } from "../context/LoginContext";
import CheatDayModal from "../components/CheatDayModal";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffeeae;
    position: relative;
    overflow: hidden;
    height: 98vh;
    width: 100%;
`;

const ModelContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: filter 0.3s ease-in-out;
    filter: ${(props) => (props.isBlurred ? "blur(5px)" : "none")};
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
    height: ${(props) => (props.isOpen ? "30vh" : "10vh")};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
`;

const MenuButton = styled.button`
    width: 80%;
    padding: 15px;
    margin-top: 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 10px;
    font-size: 16px;
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
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; // 중앙 정렬을 위해 변경
    position: absolute;
    top: 20px;
    left: 0;
    right: 0; // 전체 너비를 사용하기 위해 추가
    text-align: center; // 텍스트 중앙 정렬
    margin-top: 8vh;
    transition: filter 0.3s ease-in-out;
    filter: ${(props) => (props.isBlurred ? "blur(5px)" : "none")};
`;

const DDayInfo = styled.div`
    font-size: 24px;
    color: #fc6a03;
`;

const DateInfo = styled.div`
    font-size: 16px;
    color: #fc6a03;
    margin-top: 5px;
`;

const CalorieContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
`;

const MessageContainer = styled.div`
    position: absolute;
    bottom: 150px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 20px;
    text-align: center;
    transition: filter 0.3s ease-in-out;
    filter: ${(props) => (props.isBlurred ? "blur(5px)" : "none")};
`;

const CalorieGraph = styled(animated.div)`
    width: 400px; // 최대 너비 설정
    height: 30px;
    background-color: #49406f;
    border-radius: 15px;
    overflow: hidden;
    margin-top: 10px;
    transition: filter 0.3s ease-in-out;
    filter: ${(props) => (props.isBlurred ? "blur(5px)" : "none")};
`;

const CalorieFill = styled(animated.div)`
    height: 100%;
    background-color: #fc6a03;
`;

const CalorieText = styled.div`
    position: absolute;
    top: 80%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-weight: bold;
    z-index: 1;
`;

const DateContainer = styled.div`
    display: flex;
    justify-content: center; // 중앙 정렬
    width: 100%; // 전체 너비 사용
`;

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
            ? (cheatDayInfo.currentCalories /
                  cheatDayInfo.totalRecommendedCalories) *
              400
            : 0,
        from: { width: 0 },
    });
    console.log(calorieProps);

    useEffect(() => {
        fetchCheatDayInfo();
    }, []);

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
            <ModelContainer isBlurred={isMenuOpen}>
                <ThreeModel />
            </ModelContainer>

            <Header isBlurred={isMenuOpen}>
                <DateContainer>
                    <DDayInfo>D-{DDay} &nbsp;</DDayInfo>
                    <DateInfo>{new Date().toLocaleDateString()}</DateInfo>
                </DateContainer>
                {cheatDayInfo && (
                    <CalorieContainer>
                        <CalorieGraph isBlurred={isMenuOpen}>
                            <CalorieFill style={calorieProps} />
                            <CalorieText>
                                {Math.round(cheatDayInfo.currentCalories)} /{" "}
                                {Math.round(
                                    cheatDayInfo.totalRecommendedCalories
                                )}{" "}
                                kcal
                            </CalorieText>
                        </CalorieGraph>
                    </CalorieContainer>
                )}
            </Header>
            {cheatDayInfo && (
                <MessageContainer isBlurred={isMenuOpen}>
                    {cheatDayInfo.message}
                </MessageContainer>
            )}

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
