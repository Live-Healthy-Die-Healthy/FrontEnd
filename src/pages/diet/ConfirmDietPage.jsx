import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import ImageUploadModal from "../../components/ImageUploadModal";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 16px; /* 내부 여백 추가 */
    box-sizing: border-box; /* 패딩과 테두리가 총 너비에 포함되도록 설정 */
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
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    flex-wrap: wrap; /* 텍스트가 너비를 초과할 때 줄바꿈 */
`;

const Input = styled.input`
    width: 60px;
    margin-left: 10px; /* 여백 조정 */
    box-sizing: border-box; /* 패딩과 테두리가 총 너비에 포함되도록 설정 */
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

const RemoveButton = styled.button`
    background: #ff6b6b;
    border: none;
    padding: 5px 10px;
    margin-left: auto;
    cursor: pointer;
    color: white;
    border-radius: 5px;
`;

const CalorieContainer = styled.div`
    margin-left: 10px; /* 여백 조정 */
    overflow-wrap: break-word; /* 긴 텍스트 자동 줄바꿈 */
`;

const ConfirmDietPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dietInfo, setDietInfo] = useState(location.state?.dietInfo || {});
    const [dietImage, setDietImage] = useState(location.state?.dietImage || "");
    const [dietDetailLogIds, setDietDetailLogIds] = useState(
        location.state?.dietDetailLogIds || []
    );
    const [showImageModal, setShowImageModal] = useState(false);
    const { formattedDate, dietType } = useParams();
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        if (location.state?.dietInfo) {
            const updatedDietInfo = {
                ...location.state.dietInfo,
                음식상세: location.state.dietInfo.음식상세.map((item) => ({
                    ...item,
                    칼로리비율: item.칼로리 / item.예상양,
                    탄수화물비율: item.영양정보.탄수화물 / item.예상양,
                    단백질비율: item.영양정보.단백질 / item.예상양,
                    지방비율: item.영양정보.지방 / item.예상양,
                })),
            };
            setDietInfo(updatedDietInfo);
            calculateTotalCalories(updatedDietInfo.음식상세);
        }
    }, [location.state]);

    const calculateTotalCalories = useCallback((foodDetails) => {
        const total = foodDetails.reduce((sum, item) => sum + item.칼로리, 0);
        setTotalCalories(total);
    }, []);

    const handleQuantityChange = useCallback(
        (index, newQuantity) => {
            setDietInfo((prevDietInfo) => {
                const updatedDietInfo = { ...prevDietInfo };
                const updatedItem = { ...updatedDietInfo.음식상세[index] };
                updatedItem.예상양 = Number(newQuantity);
                updatedItem.칼로리 = Math.round(
                    updatedItem.칼로리비율 * updatedItem.예상양
                );
                updatedItem.영양정보 = {
                    탄수화물: Math.round(
                        updatedItem.탄수화물비율 * updatedItem.예상양
                    ),
                    단백질: Math.round(
                        updatedItem.단백질비율 * updatedItem.예상양
                    ),
                    지방: Math.round(updatedItem.지방비율 * updatedItem.예상양),
                    GI지수: updatedItem.영양정보.GI지수,
                };
                updatedDietInfo.음식상세[index] = updatedItem;

                calculateTotalCalories(updatedDietInfo.음식상세);
                return updatedDietInfo;
            });
        },
        [calculateTotalCalories]
    );

    const handleRemoveItem = (index) => {
        setDietInfo((prevDietInfo) => {
            const updatedDietInfo = { ...prevDietInfo };
            updatedDietInfo.음식상세 = updatedDietInfo.음식상세.filter(
                (_, i) => i !== index
            );
            return updatedDietInfo;
        });
        setDietDetailLogIds((prevIds) => prevIds.filter((_, i) => i !== index));
    };

    const handleConfirm = async () => {
        try {
            const updatedDetails = dietInfo.음식상세.map((item, index) => ({
                dietDetailLogId: dietDetailLogIds[index],
                quantity: item.예상양,
                menuCarbo: item.영양정보.탄수화물,
                menuProtein: item.영양정보.단백질,
                menuFat: item.영양정보.지방,
            }));
            await axios.put(
                `${process.env.REACT_APP_API_PORT}/gpt/updateDietDetail/${location.state.analysisId}`,
                {
                    updatedDetails,
                }
            );
            navigate(`/dietDetail/${formattedDate}/${dietType}`, {
                state: { date: formattedDate },
            });
        } catch (error) {
            console.error("Error confirming diet:", error);
            alert("식단 확인에 실패했습니다.");
        }
    };

    const handleRetakePhoto = () => {
        setShowImageModal(true);
    };

    const handleImageUpload = (imageFile) => {
        console.log("Uploaded image:", imageFile);
        setShowImageModal(false);
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
                    />
                    g <CalorieContainer>({item.칼로리}kcal)</CalorieContainer>
                    <CalorieContainer>
                        탄수화물: {item.영양정보.탄수화물}g
                    </CalorieContainer>
                    <CalorieContainer>
                        단백질: {item.영양정보.단백질}g
                    </CalorieContainer>
                    <CalorieContainer>
                        지방: {item.영양정보.지방}g
                    </CalorieContainer>
                    <CalorieContainer>
                        GI지수: {item.영양정보.GI지수}
                    </CalorieContainer>
                    <RemoveButton onClick={() => handleRemoveItem(index)}>
                        삭제
                    </RemoveButton>
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
            {showImageModal && (
                <ImageUploadModal
                    onClose={() => setShowImageModal(false)}
                    onUpload={handleImageUpload}
                />
            )}
        </Container>
    );
};

export default ConfirmDietPage;
