import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
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
    z-index: 1000;
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

    &:hover {
        background-color: #e67300;
    }
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
    font-size: 20px;
`;

const EditDietOverlay = ({ dietData, onClose, onSave }) => {
    const { accessToken } = useContext(UserContext);
    const [quantity, setQuantity] = useState(dietData.quantity);

    const handleSave = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_PORT}/dietDetail/${dietData.dietDetailLogId}`,
                {
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            alert("수정되었습니다.");
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving diet detail:", error);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <Overlay onClick={onClose}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <h4>{dietData.menuName}</h4>
                <Input
                    type='number'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Button onClick={handleSave}>저장</Button>
            </FormContainer>
        </Overlay>
    );
};

export default EditDietOverlay;
