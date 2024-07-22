import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

const FormContainer = styled.div`
    width: 80%;
    max-width: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const InputLabel = styled.label`
    margin-right: 10px;
    font-size: 16px;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Button = styled.button`
    background-color: #a3d2ca;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #86c1b9;
    }
`;

const EditDiet = () => {
    const location = useLocation();
    const { dietData } = location.state || {};
    const { accessToken } = useContext(UserContext);
    const [quantity, setQuantity] = useState(dietData.quantity);

    const navigate = useNavigate();

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
            navigate(-1);
        } catch (error) {
            console.error("Error saving diet detail:", error);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <Container>
            <h3>{dietData.menuName} 기록 수정</h3>
            <FormContainer>
                <InputContainer>
                    <InputLabel>그람(g):</InputLabel>
                    <Input
                        type='number'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </InputContainer>
                <Button onClick={handleSave}>저장</Button>
            </FormContainer>
        </Container>
    );
};

export default EditDiet;
