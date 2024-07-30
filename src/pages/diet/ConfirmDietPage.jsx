import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffcb5b;
    border-top-left-radius: 300px;
    border-top-right-radius: 300px;
    position: relative;
    margin-top: 8vh;
`;

const InfoContainer = styled.div`
    margin-bottom: 15vh;
`;

const ImageContainer = styled.div`
    background-color: #ffffff;
    margin-bottom: 20px;
    margin-top: 8vh;
`;

const DietImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: contain;
    border-radius: 10px;
`;

const TotalCalories = styled.div`
    background-color: #fc6a03;
    color: #30012f;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    position: absolute;
    top: -30px; // TotalCalories의 위치를 Container의 중앙에 맞추기 위해 조정
    left: 50%;
    transform: translateX(-50%);
    width: 200px; // TotalCalories의 넓이를 지정
`;

const NutritionRatio = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const NutritionItem = styled.div`
    background-color: #ffeeae;
    color: #30012f;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    flex: 1;
    margin: 0 5px;
`;

const FoodList = styled.div`
    background-color: #ffeeae;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
`;

const FoodItem = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
    align-items: center;
    padding: 10px 0;
    background-color: #673ab7;
    color: white;
    margin-bottom: 5px;
    border-radius: 5px;
`;

const FoodListHeader = styled(FoodItem)`
    background-color: #4caf50;
    font-weight: bold;
    margin-bottom: 10px;
`;

const FoodListContainer = styled.div``;

const FoodName = styled.span`
    font-weight: bold;
    padding-left: 10px;
`;

const FoodInput = styled.input`
    width: 50px;
    text-align: center;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    color: white;
`;

const FoodValue = styled.span`
    text-align: center;
    font-size: 0.9em;
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8em;
`;

const Section = styled.div`
    background-color: #ffeeae;
    color: #30012f;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
    margin-top: 0;
    color: #30012f;
`;

const Button = styled.button`
    background-color: #ff9800;
    color: #30012f;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
`;

const ConfirmDietPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dietInfo, setDietInfo] = useState(location.state?.dietInfo || {});
    const [dietImage, setDietImage] = useState(location.state?.dietImage || "");
    const [dietDetailLogIds, setDietDetailLogIds] = useState(
        location.state?.dietDetailLogIds || []
    );
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

    if (!dietInfo.음식상세) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ImageContainer>
                <DietImage src={dietImage} alt='식단 사진' />
            </ImageContainer>
            <Container>
                <InfoContainer>
                    <TotalCalories>
                        총 칼로리: {dietInfo.총칼로리}kcal
                    </TotalCalories>
                    <NutritionRatio>
                        <NutritionItem>
                            탄수화물
                            <br />
                            {dietInfo.영양소비율.탄수화물}%
                        </NutritionItem>
                        <NutritionItem>
                            단백질
                            <br />
                            {dietInfo.영양소비율.단백질}%
                        </NutritionItem>
                        <NutritionItem>
                            지방
                            <br />
                            {dietInfo.영양소비율.지방}%
                        </NutritionItem>
                    </NutritionRatio>

                    <FoodList>
                        <SectionTitle>음식 상세</SectionTitle>
                        <FoodListHeader>
                            <FoodName>음식명</FoodName>
                            <FoodValue>예상양(g)</FoodValue>
                            <FoodValue>탄수화물</FoodValue>
                            <FoodValue>단백질</FoodValue>
                            <FoodValue>지방</FoodValue>
                            <FoodValue>GI지수</FoodValue>
                            <FoodValue>칼로리</FoodValue>
                            <FoodValue></FoodValue>
                        </FoodListHeader>
                        {dietInfo.음식상세.map((item, index) => (
                            <FoodItem key={index}>
                                <FoodName>{item.음식명}</FoodName>
                                <FoodInput
                                    type='number'
                                    value={item.예상양}
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                                <FoodValue>{item.영양정보.탄수화물}g</FoodValue>
                                <FoodValue>{item.영양정보.단백질}g</FoodValue>
                                <FoodValue>{item.영양정보.지방}g</FoodValue>
                                <FoodValue>{item.영양정보.GI지수}</FoodValue>
                                <FoodValue>{item.칼로리}kcal</FoodValue>
                                <DeleteButton
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    삭제
                                </DeleteButton>
                            </FoodItem>
                        ))}
                    </FoodList>

                    <Section>
                        <SectionTitle>영양 분석</SectionTitle>
                        <p>장점: {dietInfo.영양분석.장점.join(", ")}</p>
                        <p>개선점: {dietInfo.영양분석.개선점.join(", ")}</p>
                    </Section>

                    <Section>
                        <SectionTitle>권장사항</SectionTitle>
                        <ul>
                            {dietInfo.권장사항.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </Section>

                    <Section>
                        <SectionTitle>식사 시간</SectionTitle>
                        <p>적합한 시간: {dietInfo.식사시간.적합한시간}</p>
                        <p>조언: {dietInfo.식사시간.조언}</p>
                    </Section>

                    <Section>
                        <SectionTitle>주의사항</SectionTitle>
                        <p>{dietInfo.주의사항}</p>
                    </Section>

                    <Button onClick={handleConfirm}>확인</Button>
                </InfoContainer>
            </Container>
        </>
    );
};

export default ConfirmDietPage;
