import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SlideUpHeader = styled.div`
    width: 100%;
    height: 20%;
    background-color: #fff;
    border-top-left-radius: 50% 20%;
    border-top-right-radius: 50% 20%;
    position: fixed;
    bottom: ${(props) => (props.isOpen ? "80%" : "0")};
    left: 50%;
    transform: translateX(-50%);
    transition: bottom 0.3s ease-in-out;
    max-width: 480px;
`;

const SlideUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: ${(props) => (props.isOpen ? "0" : "-20%")};
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 20%;
    background-color: #fff;
    transition: bottom 0.3s ease-in-out;
    border-top-left-radius: 50% 20%;
    border-top-right-radius: 50% 20%;
    padding: 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    max-width: 440px;
`;

const MenuButton = styled.button`
    width: 80%;
    padding: 15px;
    margin-bottom: 10px;
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
    background-color: #4caf50;
    color: white;
    font-size: 30px;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const SlideUpMenu = ({ isOpen, onClose, onToggle }) => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

    const handleMenuClick = (route) => {
        navigate(route, {
            state: { date: today },
        });
        onClose();
    };

    return (
        <SlideUpContainer isOpen={isOpen}>
            <AddButton onClick={onToggle}>{isOpen ? "-" : "+"}</AddButton>
            {!isOpen && <p>오늘 하루도 기록해보세요!</p>}
            {isOpen && (
                <>
                    <MenuButton
                        onClick={() => handleMenuClick(`/traindaily/${today}`)}
                    >
                        운동
                    </MenuButton>
                    <MenuButton
                        onClick={() => handleMenuClick(`/dietdaily/${today}`)}
                    >
                        식단
                    </MenuButton>
                </>
            )}
        </SlideUpContainer>
    );
};

export default SlideUpMenu;
