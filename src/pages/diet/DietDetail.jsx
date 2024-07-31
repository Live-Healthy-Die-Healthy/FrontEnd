import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import ImageUploadModal from "../../components/ImageUploadModal";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    text-align: center;
    padding-top: 10vh;
    padding-bottom: 8vh;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin: 0;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    padding: 5px;
`;

const AddButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;

const RecordContainer = styled.div`
    width: 80%;
    max-width: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const DietItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
`;

const DietText = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;

const MenuName = styled.span`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

const Quantity = styled.span`
    font-size: 14px;
    color: #666;
`;

const Calories = styled.span`
    font-size: 16px;
    color: #ff6b6b;
    font-weight: bold;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionButton = styled.button`
    background-color: #3498db;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;

const RemoveButton = styled(ActionButton)`
    background-color: #e74c3c;

    &:hover {
        background-color: #c0392b;
    }
`;

const ChartContainer = styled.div`
    width: 300px;
    height: 300px;
    margin: 20px auto;
`;

const TotalCalories = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 20px 0;
`;

const NoRecordMessage = styled.h3`
    color: #666;
    text-align: center;
`;

const PhotoButton = styled(AddButton)`
    background-color: #ffcb5b;
    margin-top: 15px;
    color: black;

    &:hover {
        background-color: #beab32;
    }
`;

export default function DietDetail() {
    const location = useLocation();
    const { date } = location.state || {};
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    const { dietType } = useParams();
    const { accessToken, userId } = useContext(UserContext);
    const navigate = useNavigate();
    const [dietData, setDietData] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);

    const fetchDietData = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/dietDetail/${dietType}`,
                {
                    userId,
                    date: formattedDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setDietData(response.data);
        } catch (error) {
            console.error("Error fetching diet data:", error);
        }
    };

    const nutritionInfo = useMemo(() => {
        return dietData.reduce(
            (acc, item) => {
                acc.carbo += item.carbo;
                acc.protein += item.protein;
                acc.fat += item.fat;
                acc.calories += item.calories;
                return acc;
            },
            { carbo: 0, protein: 0, fat: 0, calories: 0 }
        );
    }, [dietData]);

    const chartData = {
        labels: ["탄수화물", "단백질", "지방"],
        datasets: [
            {
                data: [
                    nutritionInfo.carbo,
                    nutritionInfo.protein,
                    nutritionInfo.fat,
                ],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        return `${label}: ${value.toFixed(2)}g`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    useEffect(() => {
        fetchDietData();
    }, [date, userId, dietType, accessToken]);

    const getMealTypeText = (mealType) => {
        switch (mealType) {
            case "breakfast":
                return "아침";
            case "lunch":
                return "점심";
            case "dinner":
                return "저녁";
            case "snack":
                return "간식";
            default:
                return "식단 기록";
        }
    };

    const handleEditClick = (dietData) => {
        navigate(
            `/editdiet/${formattedDate}/${dietType}/${dietData.dietLogDetailId}`,
            { state: { dietData } }
        );
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
            setDietData(
                dietData.filter(
                    (item) => item.dietDetailLogId !== dietDetailLogId
                )
            );
        } catch (error) {
            console.error("Error deleting diet data:", error);
        }
    };

    const handleAddClick = () => {
        navigate(`/selectmenu/${formattedDate}/${dietType}`, {
            state: { date, userId, dietType },
        });
    };

    const handlePhotoAdd = () => {
        setShowImageModal(true);
    };

    const handleImageUpload = (imageFile) => {
        console.log("Uploaded image:", imageFile);
        setShowImageModal(false);
    };

    const hasRecords = dietData.length > 0;

    return (
        <Container>
            <HeaderContainer>
                <TitleContainer>
                    <BackButton onClick={() => navigate(-1)}>{"<"}</BackButton>
                    <Title>
                        {formattedDate} {getMealTypeText(dietType)}
                    </Title>
                </TitleContainer>
                <AddButton onClick={handleAddClick}>메뉴 추가하기</AddButton>
            </HeaderContainer>

            {hasRecords && (
                <>
                    <TotalCalories>
                        총 칼로리: {nutritionInfo.calories.toFixed(2)} kcal
                    </TotalCalories>

                    <ChartContainer>
                        <Pie data={chartData} options={chartOptions} />
                    </ChartContainer>
                </>
            )}

            {dietData.dietImage && (
                <img
                    src={`data:image/jpeg;base64,${dietData.dietImage}`}
                    alt='식단 사진'
                    style={{
                        maxWidth: "100%",
                        borderRadius: "10px",
                        marginBottom: "20px",
                    }}
                />
            )}

            <RecordContainer>
                {hasRecords ? (
                    dietData.map((item) => (
                        <DietItem key={item.dietLogDetailId}>
                            <DietText>
                                <MenuName>{item.menuName}</MenuName>
                                <Quantity>{item.quantity}g</Quantity>
                            </DietText>
                            <Calories>{item.calories} kcal</Calories>
                            <ButtonContainer>
                                <ActionButton
                                    onClick={() => handleEditClick(item)}
                                >
                                    수정
                                </ActionButton>
                                <RemoveButton
                                    onClick={() =>
                                        handleDeleteClick(item.dietDetailLogId)
                                    }
                                >
                                    삭제
                                </RemoveButton>
                            </ButtonContainer>
                        </DietItem>
                    ))
                ) : (
                    <>
                        <NoRecordMessage>
                            기록된 식단이 없습니다
                        </NoRecordMessage>
                        {!dietData.dietImage && (
                            <PhotoButton onClick={handlePhotoAdd}>
                                사진으로 식단 추가하기
                            </PhotoButton>
                        )}
                    </>
                )}
            </RecordContainer>
            {showImageModal && (
                <ImageUploadModal
                    onClose={() => setShowImageModal(false)}
                    onUpload={handleImageUpload}
                />
            )}
        </Container>
    );
}
