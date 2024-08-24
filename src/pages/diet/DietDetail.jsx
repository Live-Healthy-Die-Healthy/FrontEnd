import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import ImageUploadModal from "../../components/ImageUploadModal";
import EditDietOverlay from "../../components/RecordOverlay/EditDietOverlay";
import annotationPlugin from "chartjs-plugin-annotation";
import NutrientChart from "../../components/NutrientChart";

import { CalorieContext } from '../../context/CalorieContext';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(annotationPlugin);

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    min-height: 100vh;
    padding-bottom: 10vh;
`;

const BackHeader = styled.div`
    display: flex;
    align-items: center;
    width: 80%;
    padding: 50px 20px;
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 40px;
    font-weight: bold;
    color: #fc6a03;
    cursor: pointer;
`;

const TitleA = styled.h1`
    font-size: 24px;
    color: #333;
    margin-left: 20px;
`;

const TotalCalories = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 20px 0;
`;

const DietList = styled.div`
    width: 100%;
    max-width: 600px;
`;

const DietItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffeeae;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const DietInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const DietName = styled.span`
    font-size: 22px;
    font-weight: bold;
    color: #333;
`;

const DietCalories = styled.span`
    font-size: 16px;
    color: #666;
`;

const ArrowIcon = styled.span`
    font-size: 35px;
    color: #ffcb5b;
    cursor: pointer;
`;

const AddButton = styled.button`
    background-color: #ffa500;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 30px;
    color: white;
    cursor: pointer;
    position: fixed;
    bottom: 80px;
    right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const PhotoButton = styled(AddButton)`
    background-color: #ffcb5b;
    bottom: 150px;
`;

const NoDiet = styled.div`
    border: 1px solid lightgrey;
    border-radius: 40px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    background-color: white;
`;

const NoFriend = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    color: grey;
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
    const [editDietData, setEditDietData] = useState(null);
    const [recommendedCal, setRecommendedCal] = useState();

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
            setDietData(response.data.dietDetails);
            setRecommendedCal(response.data.recommendedCal);
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

    const standardIntake = 50; // 임시 적정 섭취량 (g)

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

    const handleItemClick = (item) => {
        setEditDietData(item);
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

    const handleEditSave = () => {
        fetchDietData();
    };

    const hasRecords = dietData.length > 0;

    return (
        <Container>
            <BackHeader>
                <BackButton
                    onClick={() => navigate(`/dietdaily/${formattedDate}`)}
                >
                    {"<"}
                </BackButton>
                <TitleA>
                    {formattedDate} {getMealTypeText(dietType)}
                </TitleA>
            </BackHeader>

            {hasRecords ? (
                <>
                    <TotalCalories>
                        총 칼로리: {nutritionInfo.calories.toFixed(2)} kcal
                    </TotalCalories>

                    <NutrientChart nutritionInfo={nutritionInfo} recommendedCal = {(recommendedCal)} />

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

                    <DietList>
                        {dietData.map((item) => (
                            <DietItem key={item.dietDetailLogId}>
                                <DietInfo>
                                    <DietName>{item.menuName}</DietName>
                                    <DietCalories>
                                        {item.quantity} g
                                    </DietCalories>
                                </DietInfo>
                                {item.calories} kcal
                                <ArrowIcon
                                    onClick={() => handleItemClick(item)}
                                >
                                    {">"}
                                </ArrowIcon>
                            </DietItem>
                        ))}
                    </DietList>
                </>
            ) : (
                <NoDiet>
                    <NoFriend>기록된 식단이 없습니다</NoFriend>
                </NoDiet>
            )}

            <AddButton onClick={handleAddClick}>+</AddButton>
            {!dietData.dietImage && (
                <PhotoButton onClick={handlePhotoAdd}>📷</PhotoButton>
            )}

            {showImageModal && (
                <ImageUploadModal
                    onClose={() => setShowImageModal(false)}
                    onUpload={handleImageUpload}
                />
            )}
            {editDietData && (
                <EditDietOverlay
                    dietData={editDietData}
                    onClose={() => setEditDietData(null)}
                    onSave={handleEditSave}
                />
            )}
        </Container>
    );
}
