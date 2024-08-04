import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import default_image from "../../image/default-profile.png";
import { HiOutlineLogout } from "react-icons/hi";

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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    max-width: 500px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
`;

const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
`;

const InfoSection = styled.div`
    background-color: #ffeeae;
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const InfoTitle = styled.h3`
    margin: 0 0 10px 0;
    color: #49406f;
    font-size: 28px;
    text-align: left;
`;

const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 20px;
    color: #333;
`;

const InfoLabel = styled.span`
    font-weight: bold;
`;

const InfoValue = styled.span`
    color: #555;
`;

const EditButton = styled.button`
    background: #ff8000;
    color: white;
    border: none;
    padding: 8px 20px;
    margin-top: 20px;
    cursor: pointer;
    font-size: 24px;
    border-radius: 20px;
`;

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    font-size: 40px;
    max-width: 1000px;
`;

const CloseButton = styled.button`
    background-color: #96ceb3;
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
    margin-right: 10px;
`;

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    margin-top: 20px;
    background-color: #ffffff;
    color: #49406f;
    border: none;
    padding: 6px 9px;
    cursor: pointer;
    font-size: 24px;
    border-radius: 20px;
`;

const LogoutConfirmModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LogoutConfirmContent = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
`;

const LogoutConfirmButton = styled.button`
    background-color: #ff8000;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
`;

const LogoutCancelButton = styled.button`
    background-color: #5ddebe;
    color: #49406f;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
`;

const IDLabel = styled.span`
    font-size: 20px;
    font-weight: bold;
`;

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {
        userId,
        accessToken,
        setAccessToken,
        setRefreshToken,
        setUserId,
        setLoginType,
    } = useContext(UserContext);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };
    const handleLogoutConfirm = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setLoginType("");
        setUserId("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("loginType");
        localStorage.removeItem("userId");
        navigate("/");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/profile`,
                    { userId },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
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
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) {
        return <Container>Loading...</Container>;
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
                    <ProfileImage src={profileImageSrc} alt='프로필 이미지' />
                    <InfoItem>
                        <IDLabel>아이디 : {profile.userId}</IDLabel>
                    </InfoItem>
                    <ProfileContainer>
                        <InfoSection>
                            <InfoTitle>기본 정보</InfoTitle>
                            <InfoItem>
                                <InfoLabel>이메일</InfoLabel>
                                <InfoValue>{profile.userEmail}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>닉네임</InfoLabel>
                                <InfoValue>{profile.userNickname}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>생년월일</InfoLabel>
                                <InfoValue>{date}</InfoValue>
                            </InfoItem>
                        </InfoSection>
                        <InfoSection>
                            <InfoTitle>신체 정보</InfoTitle>
                            <InfoItem>
                                <InfoLabel>성별</InfoLabel>
                                <InfoValue>{profile.userGender}</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>키</InfoLabel>
                                <InfoValue>{profile.userHeight} cm</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                <InfoLabel>몸무게</InfoLabel>
                                <InfoValue>{profile.userWeight} kg</InfoValue>
                            </InfoItem>
                            <InfoItem>
                                {profile.userBmi ? (
                                    <>
                                        <InfoLabel>BMI: </InfoLabel>
                                        <InfoValue>
                                            {profile.userBmi} kg/m²
                                        </InfoValue>
                                    </>
                                ) : (
                                    <>
                                        <InfoLabel>BMI: </InfoLabel>
                                        <InfoValue>정보 없음</InfoValue>
                                    </>
                                )}
                            </InfoItem>
                            <InfoItem>
                                {profile.userMuscleMass ? (
                                    <>
                                        <InfoLabel>골격근량:</InfoLabel>

                                        <InfoValue>
                                            {profile.userMuscleMass} kg
                                        </InfoValue>
                                    </>
                                ) : (
                                    <>
                                        <InfoLabel>골격근량:</InfoLabel>

                                        <InfoValue>정보 없음</InfoValue>
                                    </>
                                )}
                            </InfoItem>
                            <InfoItem>
                                {profile.userBodyFatPercentage ? (
                                    <>
                                        <InfoLabel>체지방률:</InfoLabel>

                                        <InfoValue>
                                            {profile.userBodyFatPercentage} %
                                        </InfoValue>
                                    </>
                                ) : (
                                    <>
                                        <InfoLabel>체지방률:</InfoLabel>

                                        <InfoValue>정보 없음</InfoValue>
                                    </>
                                )}
                            </InfoItem>
                            <InfoItem>
                                {profile.userBmr ? (
                                    <>
                                        <InfoLabel>기초대사량:</InfoLabel>

                                        <InfoValue>
                                            {profile.userBmr} kcal
                                        </InfoValue>
                                    </>
                                ) : (
                                    <>
                                        <InfoLabel>기초대사량: </InfoLabel>

                                        <InfoValue>정보 없음</InfoValue>
                                    </>
                                )}
                            </InfoItem>
                        </InfoSection>
                    </ProfileContainer>
                    <EditButton
                        onClick={() =>
                            navigate("/editprofile", { state: { profile } })
                        }
                    >
                        프로필 수정하기
                    </EditButton>
                    <LogoutButton onClick={handleLogoutClick}>
                        <HiOutlineLogout color='#ff6363' />
                        로그아웃
                    </LogoutButton>
                </>
            ) : (
                <p>프로필 정보를 불러오지 못했습니다.</p>
            )}

            {showLogoutConfirm && (
                <LogoutConfirmModal>
                    <LogoutConfirmContent>
                        <p>로그아웃 하시겠습니까?</p>
                        <LogoutConfirmButton onClick={handleLogoutConfirm}>
                            확인
                        </LogoutConfirmButton>
                        <LogoutCancelButton
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            취소
                        </LogoutCancelButton>
                    </LogoutConfirmContent>
                </LogoutConfirmModal>
            )}
        </Container>
    );
};

export default ProfilePage;
