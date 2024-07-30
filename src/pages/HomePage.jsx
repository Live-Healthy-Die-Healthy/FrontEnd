import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ThreeModel from "../components/ThreeModel";

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
    background-color: #5ddebe;
    transition: height 0.3s ease-in-out;
    border-top-left-radius: 50% 20%;
    border-top-right-radius: 50% 20%;
    padding-bottom: 30px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    height: ${(props) => (props.isOpen ? "30vh" : "10vh")}; // 높이 조정
    position: fixed; // absolute에서 fixed로 변경
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
    top: -45px; // Adjust the position to make it float above the container
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
`;

const PCon = styled.p`
    color: #b53a14;
`;

const Header = styled.div`
    width: 100%;
    padding: 20px;
    text-align: left;
`;

const DayInfo = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

const CalorieInfo = styled.div`
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px 20px;
    border-radius: 20px;
    margin-top: 10px;
    display: inline-block;
`;

const Overlay = styled.div`
    display: ${(props) => (props.isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

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
        </Container>
    );
}
