import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import default_image from "../../image/default-profile.png";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    text-align: center;
    margin-bottom: 10vh;
`;

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 80%;
    max-width: 1000px;
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 0%;
    margin-right: 20px;
`;

const InfoContainer = styled.div`
    display: flex;
    width: 80%;
    flex-direction: column;
    align-items: flex-start;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;

    & > div {
        flex: 1;
        margin-right: 10px;
    }

    & > div:last-child {
        margin-right: 0;
    }
`;

const InfoItem = styled.div`
    background-color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EditButton = styled.button`
    background: #a3d2ca;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
`;

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    font-size: 30px;
`;

const CloseButton = styled.button`
    background-color: #a1d9ff;
    border: none;
    color: white;
    font-size: 24px;
    font-weight: bold;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0px 10px;
`;

const ProfilePage = () => {
    const { userId, accessToken } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/profile`,
                    { userId }
                );
                setProfile(response.data);
                const formattedDate = format(
                    new Date(response.data.userBirth),
                    "yyyy-MM-dd"
                );
                setDate(formattedDate);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false); // 데이터를 가져온 후 로딩 상태를 false로 변경합니다.
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) {
        return <Container>Loading...</Container>; // 로딩 중일 때 표시할 텍스트
    }

    const profileImageSrc = profile?.userImage
        ? `data:image/jpeg;base64,${profile.userImage}`
        : default_image;

    return (
        <Container>
            <TabContainer>
                <CloseButton onClick={() => navigate("/home")}>X</CloseButton>
                <span>마이 페이지</span>
            </TabContainer>
            {profile ? (
                <>
                    <ProfileContainer>
                        <ProfileImage
                            src={profileImageSrc}
                            alt='프로필 이미지'
                        />
                        <InfoContainer>
                            <InfoRow>
                                <InfoItem>아이디: {profile.userId}</InfoItem>
                            </InfoRow>
                            <InfoRow>
                                <InfoItem>이메일: {profile.userEmail}</InfoItem>
                            </InfoRow>
                            <InfoRow>
                                <InfoItem>
                                    닉네임: {profile.userNickname}
                                </InfoItem>
                            </InfoRow>
                            <InfoRow>
                                <InfoItem>생년월일: {date}</InfoItem>
                            </InfoRow>
                            <InfoRow>
                                <InfoItem>성별: {profile.userGender}</InfoItem>
                            </InfoRow>

                            <InfoRow>
                                <InfoItem>키: {profile.userHeight} cm</InfoItem>
                            </InfoRow>

                            <InfoRow>
                                <InfoItem>
                                    몸무게: {profile.userWeight} kg
                                </InfoItem>
                            </InfoRow>

                            <InfoRow>
                                {profile.userBmi ? (
                                    <InfoItem>
                                        BMI: {profile.userBmi} kg/m^2
                                    </InfoItem>
                                ) : (
                                    <InfoItem>BMI: 정보 없음 </InfoItem>
                                )}
                            </InfoRow>

                            <InfoRow>
                                {profile.userBmi ? (
                                    <InfoItem>
                                        골격근량: {profile.userMuscleMass} kg
                                    </InfoItem>
                                ) : (
                                    <InfoItem>골격근량: 정보 없음 </InfoItem>
                                )}
                            </InfoRow>

                            <InfoRow>
                                {profile.userBodyFatPercentage ? (
                                    <InfoItem>
                                        체지방률:{" "}
                                        {profile.userBodyFatPercentage} %
                                    </InfoItem>
                                ) : (
                                    <InfoItem>체지방률: 정보 없음 </InfoItem>
                                )}
                            </InfoRow>

                            <InfoRow>
                                {profile.userBmr ? (
                                    <InfoItem>
                                        기초대사량: {profile.userBmr} kcal
                                    </InfoItem>
                                ) : (
                                    <InfoItem>기초대사량: 정보 없음 </InfoItem>
                                )}
                            </InfoRow>
                        </InfoContainer>
                    </ProfileContainer>
                    <EditButton
                        onClick={() =>
                            navigate("/editprofile", { state: { profile } })
                        }
                    >
                        프로필 수정하기
                    </EditButton>
                </>
            ) : (
                <p>프로필 정보를 불러오지 못했습니다.</p>
            )}
        </Container>
    );
};

export default ProfilePage;
