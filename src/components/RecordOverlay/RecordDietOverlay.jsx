// RecordDietOverlay.js
import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { format } from "date-fns";
import { UserContext } from "../../context/LoginContext";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormContainer = styled.div`
    position: relative;
    width: 80%;
    max-width: 400px;
    background-color: #ffcb5b;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const Input = styled.input`
    padding: 10px;
    margin: 10px;
    width: 80%;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    background: #ff8000;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    left: 10px;
    background: #96ceb3;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
`;

export default function RecordDietOverlay({
    date,
    dietType,
    menuId,
    menuName,
    onClose,
}) {
    const [quantity, setQuantity] = useState("");
    const { accessToken, userId } = useContext(UserContext);
    const formattedDate = format(new Date(date), "yyyy-MM-dd");

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleSave = async () => {
        if (!quantity) {
            alert("섭취량을 입력해주세요.");
            return;
        }

        const dietData = {
            userId,
            dietDate: formattedDate,
            dietType,
            menuId,
            quantity: Number(quantity),
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/addDiet`,
                dietData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                onClose();
            } else {
                alert("식사 기록 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error saving diet log:", error);
            alert("식사 기록 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <Overlay onClick={onClose}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <h4>{menuName}</h4>
                <Input
                    type='number'
                    placeholder='섭취량(g)을 적어주세요'
                    value={quantity}
                    onChange={handleQuantityChange}
                />
                <Button onClick={handleSave}>저장하기</Button>
            </FormContainer>
        </Overlay>
    );
}
