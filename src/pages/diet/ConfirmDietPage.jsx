import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffcb5b;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    margin-bottom: 6vh;
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
`;

const NutritionRatio = styled.div`
    background-color: #ffeeae;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 20px;
`;

const NutritionItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 50px;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 5px;
`;

const FoodList = styled.div`
    margin-bottom: 20px;
    background-color: #ffcb5b;
    border-radius: 15px;
    padding: 0px 10px;
`;

const FoodItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #ffffff33;
    position: relative;
    background-color: #5c4f82;
    border-radius: 10px;
    margin-bottom: 15px;
`;

const FoodHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

const FoodName = styled.span`
    margin-top: 10px;
    font-weight: bold;
    color: #ffffff;
`;

const FoodQuantity = styled.input`
    width: 50px;
    background-color: #ffffff22;
    border: none;
    border-radius: 3px;
    color: #ffeaea;
    text-align: center;
    padding: 2px;
`;

const FoodCalories = styled.span`
    color: #ffeaea;
    font-size: 0.9em;
`;

const GramCalorie = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffffff;
    font-size: 0.8em;
    margin-left: 10px;
`;

const NutritionInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffffff;
    font-size: 0.8em;
    margin-left: 20px;
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: #ffffff;
    color: #01931e;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    cursor: pointer;
    margin-bottom: 30px;
`;

const Section = styled.div`
    background-color: #ffeeae;
    color: #30012f;
    border-radius: 15px;
    padding: 15px;
    margin-bottom: 20px;
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

const ImageContainer = styled.div`
    background-color: #ffffff;
    margin-bottom: 20px;
    margin-top: 12vh;
`;

const DietImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: contain;
    border-radius: 10px;
`;

const Description = styled.div`
    font-size: 25px;
    font-weight: 800;
    color: #787878;
    margin-bottom: 5px;
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
                <TotalCalories>
                    총 칼로리: {dietInfo.총칼로리}kcal
                </TotalCalories>

                <NutritionRatio>
                    <NutritionItem>
                        <span>탄수화물</span>
                        <span>{dietInfo.영양소비율.탄수화물}%</span>
                    </NutritionItem>
                    <NutritionItem>
                        <span>단백질</span>
                        <span>{dietInfo.영양소비율.단백질}%</span>
                    </NutritionItem>
                    <NutritionItem>
                        <span>지방</span>
                        <span>{dietInfo.영양소비율.지방}%</span>
                    </NutritionItem>
                </NutritionRatio>
                <Description>음식상세</Description>
                <FoodList>
                    {dietInfo.음식상세.map((item, index) => (
                        <FoodItem key={index}>
                            <DeleteButton
                                onClick={() => handleRemoveItem(index)}
                            >
                                -
                            </DeleteButton>
                            <FoodHeader>
                                <FoodName>{item.음식명}</FoodName>
                                <GramCalorie>
                                    <div>
                                        <FoodQuantity
                                            type='number'
                                            value={item.예상양}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        g
                                    </div>
                                    <FoodCalories>
                                        {item.칼로리}kcal
                                    </FoodCalories>
                                </GramCalorie>
                                <NutritionInfo>
                                    <span>
                                        탄수화물: {item.영양정보.탄수화물}g
                                    </span>
                                    <span>단백질: {item.영양정보.단백질}g</span>
                                    <span>지방: {item.영양정보.지방}g</span>
                                </NutritionInfo>
                            </FoodHeader>
                        </FoodItem>
                    ))}
                </FoodList>
                <Description>영양 분석</Description>
                <Section>
                    <p>장점: {dietInfo.영양분석.장점.join(", ")}</p>
                    <p>개선점: {dietInfo.영양분석.개선점.join(", ")}</p>
                </Section>

                <Description>권장사항</Description>
                <Section>
                    <ul>
                        {dietInfo.권장사항.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </Section>

                <Description>주의사항</Description>
                <Section>
                    <p>{dietInfo.주의사항}</p>
                </Section>

                <Button onClick={handleConfirm}>확인</Button>
            </Container>
        </>
    );
};

export default ConfirmDietPage;
