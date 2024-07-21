import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import ImageUploadModal from "../../components/ImageUploadModal"; // 새로운 컴포넌트

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 80%;
    max-width: 600px;
    margin-bottom: 20px;
`;

const RecordContainer = styled.div`
    width: 80%;
    max-width: 600px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const DietItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
`;

const DietText = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;

const Quantity = styled.span`
    font-size: 16px;
    color: gray;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button`
    background-color: #a3d2ca;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
`;

const RemoveButton = styled.button`
    background: #ff6b6b;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    color: white;
    border-radius: 5px;
`;

const AddButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #45a049;
    }
`;

const PhotoButton = styled(Button)`
    background-color: #3498db;
    &:hover {
        background-color: #2980b9;
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
                `http://localhost:4000/dietDetail/${dietType}`,
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

    useEffect(() => {
        fetchDietData();
    }, [date, userId, dietType, accessToken]);

    const getMealTypeText = (mealType) => {
        switch (mealType) {
            case "breakfast":
                return "아침 식단 기록";
            case "lunch":
                return "점심 식단 기록";
            case "dinner":
                return "저녁 식단 기록";
            case "snack":
                return "간식 식단 기록";
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
                `http://localhost:4000/dietDetail/${dietDetailLogId}`,
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

    console.log("dietData : ", dietData);

    return (
        <Container>
            <HeaderContainer>
                <h3>
                    {formattedDate} {getMealTypeText(dietType)}
                </h3>
                <AddButton onClick={handleAddClick}>메뉴 추가하기</AddButton>
            </HeaderContainer>
            {dietData.dietImage && (
                <img src={dietData.dietImage} alt='식단 사진' />
            )}
            <RecordContainer>
                {dietData.length > 0 ? (
                    dietData.map((item) => (
                        <DietItem key={item.dietLogDetailId}>
                            <DietText>
                                <span>{item.menuName}</span>
                                <Quantity>{item.quantity}g</Quantity>
                            </DietText>
                            <span>{item.calories} kcal</span>
                            <ButtonContainer>
                                <Button onClick={() => handleEditClick(item)}>
                                    수정
                                </Button>
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
                        <h3>기록된 식단이 없습니다</h3>
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
