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

const DietName = styled.div`
    font-size: 30px;
`;

const DeleteButton = styled(Button)`
    background: #98e3bf;
    color: #b53a14;
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

    const handleDeleteClick = async (dietDetailLogId) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_PORT}/dietDetail/${dietDetailLogId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            alert("삭제되었습니다.");
            onSave();
            onClose();
        } catch (error) {
            console.error("Error deleting diet data:", error);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <FormContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <DietName>{dietData.menuName}</DietName>
                <Input
                    type='number'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                g<Button onClick={handleSave}>저장하기</Button>
                <DeleteButton
                    onClick={() => handleDeleteClick(dietData.dietDetailLogId)}
                >
                    삭제하기
                </DeleteButton>
            </FormContainer>
        </Overlay>
    );
};

export default EditDietOverlay;
