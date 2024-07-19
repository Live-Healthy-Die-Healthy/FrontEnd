import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

const DietImage = styled.img`
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 8px;
`;

const DietItem = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
`;

const Input = styled.input`
    width: 60px;
`;

const Button = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const RetakeButton = styled(Button)`
    background-color: #f44336;
    &:hover {
        background-color: #da190b;
    }
`;

const ConfirmDietPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dietInfo, setDietInfo] = useState(location.state.dietInfo);
    const [dietImage, setDietImage] = useState(location.state.dietImage);
    const { formattedDate, dietType } = useParams();

    const handleQuantityChange = (index, newQuantity) => {
        const updatedDietInfo = [...dietInfo];
        updatedDietInfo[index].quantity = newQuantity;
        setDietInfo(updatedDietInfo);
    };

    const handleConfirm = async () => {
        try {
            await axios.post("http://localhost:4000/confirmDiet", { dietInfo });
            navigate(`/dietDetail/${formattedDate}/${dietType}`); // 식단 상세 페이지로 이동
        } catch (error) {
            console.error("Error confirming diet:", error);
            alert("식단 확인에 실패했습니다.");
        }
    };

    const handleRetakePhoto = () => {
        // 사진 다시 찍기 페이지로 이동
        navigate("/takePhoto");
    };

    return (
        <Container>
            <h2>분석된 식단 정보</h2>
            {dietImage && <DietImage src={dietImage} alt='식단 사진' />}
            <RetakeButton onClick={handleRetakePhoto}>
                사진 다시 찍기
            </RetakeButton>
            {dietInfo.map((item, index) => (
                <DietItem key={index}>
                    <span>{item.menuName}</span>
                    <Input
                        type='number'
                        value={item.quantity}
                        onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                        }
                    />{" "}
                    g
                </DietItem>
            ))}
            <Button onClick={handleConfirm}>확인</Button>
        </Container>
    );
};

export default ConfirmDietPage;
