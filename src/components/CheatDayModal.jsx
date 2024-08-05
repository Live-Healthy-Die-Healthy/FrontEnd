import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CheatDayModalContainer = styled(animated.div)`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 90%;
    max-width: 300px;
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 22px;
`;

const ConfirmButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #5ddebe;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
`;

const ReSelectButton = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
`;

const CheatDayModal = ({
    isConfirming,
    selectedCheatDay,
    handleDateSelection,
    handleConfirmCheatDay,
    handleReSelectDate,
    formatDate,
    modalAnimation,
}) => (
    <CheatDayModalContainer
        style={{
            ...modalAnimation,
            transform: modalAnimation.transform.interpolate((t) => `${t}`),
        }}
    >
        <ModalTitle>
            {isConfirming
                ? `${formatDate(selectedCheatDay)}에 치팅하시나요?`
                : "치팅데이를 설정해주세요!"}
        </ModalTitle>
        {!isConfirming && (
            <DatePicker
                selected={selectedCheatDay}
                onChange={handleDateSelection}
                minDate={new Date()}
                maxDate={
                    new Date(new Date().setDate(new Date().getDate() + 28))
                }
                inline
            />
        )}
        {isConfirming && (
            <>
                <ConfirmButton onClick={handleConfirmCheatDay}>
                    확인
                </ConfirmButton>
                <ReSelectButton onClick={handleReSelectDate}>
                    다시 선택하기
                </ReSelectButton>
            </>
        )}
    </CheatDayModalContainer>
);

export default CheatDayModal;
