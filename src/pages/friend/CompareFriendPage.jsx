import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";
import { format, startOfToday } from "date-fns";

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

const UserContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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

export default function CompareFriendPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { friend } = location.state || {};
    const { userId, accessToken } = useContext(UserContext);
    const [comparisonData, setComparisonData] = useState(null);

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                const today = format(startOfToday(), "yyyy-MM-dd");
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/compareFriend`,
                    { userId, friend_id: friend.userId, date: today },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setComparisonData(response.data);
            } catch (error) {
                console.error("Error fetching comparison data:", error);
                // 에러 처리 (예: 에러 메시지 표시)
            }
        };

        fetchComparisonData();
    }, [userId, friend.userId, accessToken]);

    if (!comparisonData) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <button
                onClick={() => {
                    navigate(-1);
                }}
            >
                뒤로
            </button>
            <h2>{friend.username}님과 비교한 당신은...</h2>
            <ComparisonContainer>
                <UserContainer>
                    <UserImage
                        src={`data:image/jpeg;base64,${comparisonData.user.userImage}`}
                        alt='Your Image'
                    />
                    <Username>{comparisonData.user.username}</Username>
                </UserContainer>
                <span>VS</span>
                <UserContainer>
                    <UserImage
                        src={`data:image/jpeg;base64,${comparisonData.friend.userImage}`}
                        alt="Friend's Image"
                    />
                    <Username>{comparisonData.friend.username}</Username>
                </UserContainer>
            </ComparisonContainer>
            {/* 추가 정보 */}
        </Container>
    );
}
