import React, { useState, useEffect, useCallback } from "react";
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
    const [dietInfo, setDietInfo] = useState(location.state?.dietInfo || {});
    const [dietImage, setDietImage] = useState(location.state?.dietImage || "");
    const { formattedDate, dietType } = useParams();

    useEffect(() => {
        if (location.state?.dietInfo) {
            setDietInfo(location.state.dietInfo);
        }
    }, [location.state]);

    const handleQuantityChange = useCallback(
        (index, newQuantity) => {
            setDietInfo((prevDietInfo) => {
                const updatedDietInfo = { ...prevDietInfo };
                updatedDietInfo.음식상세[index].예상양 = Number(newQuantity);
                return updatedDietInfo;
            });
        },
        [setDietInfo]
    );

    const handleConfirm = async () => {
        try {
            const updatedDetails = dietInfo.음식상세.map((item, index) => ({
                dietDetailLogId: location.state.dietDetailLogIds[index],
                quantity: item.예상양,
            }));
            await axios.put("http://localhost:4000/updateDietDetail", {
                updatedDetails,
            });
            navigate(`/dietDetail/${formattedDate}/${dietType}`, {
                state: { date: formattedDate },
            });
        } catch (error) {
            console.error("Error confirming diet:", error);
            alert("식단 확인에 실패했습니다.");
        }
    };

    const handleRetakePhoto = () => {
        navigate("/takePhoto");
    };

    if (!dietInfo.음식상세) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h2>분석된 식단 정보</h2>
            {dietImage && <DietImage src={dietImage} alt='식단 사진' />}
            <RetakeButton onClick={handleRetakePhoto}>
                사진 다시 찍기
            </RetakeButton>
            <h3>총 칼로리: {dietInfo.총칼로리}kcal</h3>
            <h4>영양소 비율:</h4>
            <ul>
                <li>탄수화물: {dietInfo.영양소비율.탄수화물}%</li>
                <li>단백질: {dietInfo.영양소비율.단백질}%</li>
                <li>지방: {dietInfo.영양소비율.지방}%</li>
            </ul>
            <h4>음식 상세:</h4>
            {dietInfo.음식상세.map((item, index) => (
                <DietItem key={index}>
                    <span>{item.음식명}</span>
                    <Input
                        type='number'
                        value={item.예상양}
                        onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                        }
                    />{" "}
                    g<span>({item.칼로리}kcal)</span>
                </DietItem>
            ))}
            <h4>영양 분석:</h4>
            <ul>
                <li>장점: {dietInfo.영양분석.장점.join(", ")}</li>
                <li>개선점: {dietInfo.영양분석.개선점.join(", ")}</li>
            </ul>
            <h4>권장사항:</h4>
            <ul>
                {dietInfo.권장사항.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h4>식사 시간:</h4>
            <p>적합한 시간: {dietInfo.식사시간.적합한시간}</p>
            <p>조언: {dietInfo.식사시간.조언}</p>
            <h4>주의사항:</h4>
            <p>{dietInfo.주의사항}</p>
            <Button onClick={handleConfirm}>확인</Button>
        </Container>
    );
};

export default ConfirmDietPage;
