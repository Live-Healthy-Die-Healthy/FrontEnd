import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";
import { format, startOfToday } from "date-fns";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90vh;
    margin-top: 2vh;
`;

const ComparisonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 20px;
`;

const UserInfoContainer = styled.div`
    background-color: ${(props) => (props.isUser ? "#FFEEAE" : "#DDEFFF")};
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
`;

const UserImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
`;

const Username = styled.p`
    margin-top: 10px;
    font-weight: bold;
`;

const InfoContainer = styled.div`
    margin-top: 20px;
    text-align: center;
`;

const InfoItem = styled.p`
    margin: 5px 0;
`;

const ShareButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #3897f0;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const ReportHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
`;

const VsContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function CompareFriendPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { friend } = location.state || {};
    const { userId, accessToken } = useContext(UserContext);
    const [comparisonData, setComparisonData] = useState(null);
    const captureRef = useRef();

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                const today = format(startOfToday(), "yyyy-MM-dd");
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/compareFriend`,
                    { userId, friend_id: friend.userId, date: today },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                console.log("response : ", response);
                setComparisonData(response.data);
            } catch (error) {
                console.error("Error fetching comparison data:", error);
                // Error handling (e.g., display error message)
            }
        };

        fetchComparisonData();
    }, [userId, friend.userId, accessToken]);

    const handleShareClick = () => {
        if (captureRef.current === null) {
            return;
        }

        toPng(captureRef.current, { cacheBust: true })
            .then((dataUrl) => {
                saveAs(dataUrl, "comparison.png");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (!comparisonData) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <ReportHeader>
                <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
                <h2>{comparisonData.friend.username}님과 비교한 당신은...</h2>
            </ReportHeader>
            <ComparisonContainer ref={captureRef}>
                <UserInfoContainer isUser={true}>
                    <UserImage
                        src={
                            comparisonData.user.userImage
                                ? `data:image/jpeg;base64,${comparisonData.user.userImage}`
                                : "default_user_image_url"
                        }
                        alt='Your Image'
                    />
                    <Username>{comparisonData.user.username}</Username>
                    <InfoContainer>
                        <InfoItem>BMI: {comparisonData.user.userBmi}</InfoItem>
                        <InfoItem>
                            BMI 변화율: {comparisonData.user.bmiChangeRate}
                        </InfoItem>
                        <InfoItem>
                            체지방 변화율:{" "}
                            {comparisonData.user.bodyFatChangeRate}%
                        </InfoItem>
                        <InfoItem>
                            근육량 변화율:{" "}
                            {comparisonData.user.muscleMassChangeRate}%
                        </InfoItem>
                        <InfoItem>
                            권장 칼로리:{" "}
                            {comparisonData.user.userRecommendedCal}kcal
                        </InfoItem>
                        <InfoItem>
                            주간 운동 시간:{" "}
                            {comparisonData.user.weeklyExerciseTime}시간
                        </InfoItem>
                        <InfoItem>
                            체중 변화율: {comparisonData.user.weightChangeRate}
                            kg
                        </InfoItem>
                    </InfoContainer>
                </UserInfoContainer>
                <VsContainer>VS</VsContainer>
                <UserInfoContainer isUser={false}>
                    <UserImage
                        src={
                            comparisonData.friend.userImage
                                ? `data:image/jpeg;base64,${comparisonData.friend.userImage}`
                                : "default_friend_image_url"
                        }
                        alt="Friend's Image"
                    />
                    <Username>{comparisonData.friend.username}</Username>
                    <InfoContainer>
                        <InfoItem>
                            BMI: {comparisonData.friend.userBmi || "정보 없음"}
                        </InfoItem>
                        <InfoItem>
                            BMI 변화율: {comparisonData.friend.bmiChangeRate}
                        </InfoItem>
                        <InfoItem>
                            체지방 변화율:{" "}
                            {comparisonData.friend.bodyFatChangeRate}%
                        </InfoItem>
                        <InfoItem>
                            근육량 변화율:{" "}
                            {comparisonData.friend.muscleMassChangeRate}%
                        </InfoItem>
                        <InfoItem>
                            권장 칼로리:{" "}
                            {comparisonData.friend.userRecommendedCal}kcal
                        </InfoItem>
                        <InfoItem>
                            주간 운동 시간:{" "}
                            {comparisonData.friend.weeklyExerciseTime}시간
                        </InfoItem>
                        <InfoItem>
                            체중 변화율:{" "}
                            {comparisonData.friend.weightChangeRate}kg
                        </InfoItem>
                    </InfoContainer>
                </UserInfoContainer>
            </ComparisonContainer>
            <ShareButton onClick={handleShareClick}>
                Instagram으로 자랑하기
            </ShareButton>
        </Container>
    );
}
