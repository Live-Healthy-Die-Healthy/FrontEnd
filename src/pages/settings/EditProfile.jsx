import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import default_image from "../../image/default-profile.png";
import profile1 from "../../image/profile1.png";
import profile2 from "../../image/profile2.png";
import profile3 from "../../image/profile3.png";
import profile4 from "../../image/profile4.png";
import profile5 from "../../image/profile5.png";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 10vh;
    text-align: center;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 480px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    width: 30%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 20px;
    background-color: #ffeeae;
`;

const Button = styled.button`
    background: #ff8000;
    border: none;
    padding: 10px 20px;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 20px;
    color: white;
`;

const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ProfileSelector = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 80%;
`;

const ProfileOption = styled.img`
    width: 100px;
    height: 100px;
    margin: 10px;
    cursor: pointer;
    border: ${(props) => (props.selected ? "3px solid #a3d2ca" : "none")};
    border-radius: 50%;
`;

const InfoSection = styled.div`
    background-color: #ffcb5b;
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
`;

const InfoTitle = styled.h3`
    margin: 0 0 10px 0;
    color: #49406f;
    font-size: 16px;
    text-align: left;
`;

const InfoItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
`;

const InfoLabel = styled.span`
    font-weight: bold;
`;

const InfoValue = styled.span`
    color: #555;
`;

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    font-size: 30px;
    max-width: 1000px;
`;

const CloseButton = styled.button`
    border: none;
    background-color: #ffffff;
    color: #fc6a03;
    font-size: 24px;
    font-weight: bold;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
`;

const EditProfile = () => {
    const { state } = useLocation();
    const { profile } = state;
    const { userId, accessToken } = useContext(UserContext);
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState(profile.userEmail);
    const [username, setUsername] = useState(profile.userNickname);
    const [userBirth, setUserBirth] = useState(
        format(new Date(profile.userBirth), "yyyy-MM-dd")
    );
    const [userHeight, setUserHeight] = useState(profile.userHeight);
    const [userWeight, setUserWeight] = useState(profile.userWeight);
    const [userGender, setUserGender] = useState(profile.userGender);
    const [userImage, setUserImage] = useState(
        profile.userImage || default_image
    );
    const [userMuscleMass, setUserMuscleMass] = useState(
        profile.userMuscleMass || ""
    );
    const [userBmi, setUserBmi] = useState(profile.userBmi || "");
    const [userBodyFatPercentage, setUserBodyFatPercentage] = useState(
        profile.userBodyFatPercentage || ""
    );
    const [showProfileSelector, setShowProfileSelector] = useState(false);

    const profileOptions = [profile1, profile2, profile3, profile4, profile5];

    useEffect(() => {
        if (profile.userImage) {
            const base64Image = `data:image/jpeg;base64,${profile.userImage}`;
            setUserImage(base64Image);
        }
    }, [profile.userImage]);

    const handleImageSelect = (image) => {
        fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUserImage(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        setShowProfileSelector(false);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_PORT}/profile`,
                {
                    userId,
                    userEmail,
                    username,
                    userBirth,
                    userHeight,
                    userWeight,
                    userGender,
                    userImage,
                    userMuscleMass,
                    userBmi,
                    userBodyFatPercentage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            alert("프로필이 성공적으로 업데이트되었습니다.");
            navigate("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("사용할 수 없는 이미지입니다.");
        }
    };

    return (
        <Container>
            <TabContainer>
                <CloseButton onClick={() => navigate(-1)}>&lt;</CloseButton>
                <span>프로필 수정</span>
            </TabContainer>
            <FormContainer>
                <ImageContainer>
                    <ProfileImage src={userImage} alt='프로필 이미지' />
                    <Button onClick={() => setShowProfileSelector(true)}>
                        프로필 이미지 선택하기
                    </Button>
                </ImageContainer>
                <InfoSection>
                    <InfoTitle>기본 정보</InfoTitle>
                    <InfoItem>
                        <InfoLabel>이메일</InfoLabel>
                        <InfoValue>{userEmail}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>닉네임</InfoLabel>
                        <Input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='닉네임'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>생년월일</InfoLabel>
                        <Input
                            type='date'
                            value={userBirth}
                            onChange={(e) => setUserBirth(e.target.value)}
                            placeholder='생년월일'
                        />
                    </InfoItem>
                </InfoSection>
                <InfoSection>
                    <InfoTitle>신체 정보</InfoTitle>
                    <InfoItem>
                        <InfoLabel>성별</InfoLabel>
                        <InfoValue>
                            {userGender === "Male" ? "남성" : "여성"}
                        </InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>키</InfoLabel>
                        <Input
                            type='number'
                            value={userHeight}
                            onChange={(e) => setUserHeight(e.target.value)}
                            placeholder='키 (cm)'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>몸무게</InfoLabel>
                        <Input
                            type='number'
                            value={userWeight}
                            onChange={(e) => setUserWeight(e.target.value)}
                            placeholder='몸무게 (kg)'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>BMI</InfoLabel>
                        <Input
                            type='number'
                            value={userBmi}
                            onChange={(e) => setUserBmi(e.target.value)}
                            placeholder='BMI'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>골격근량</InfoLabel>
                        <Input
                            type='number'
                            value={userMuscleMass}
                            onChange={(e) => setUserMuscleMass(e.target.value)}
                            placeholder='골격근량 (kg)'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>체지방률</InfoLabel>
                        <Input
                            type='number'
                            value={userBodyFatPercentage}
                            onChange={(e) =>
                                setUserBodyFatPercentage(e.target.value)
                            }
                            placeholder='체지방률 (%)'
                        />
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>기초대사량</InfoLabel>
                        <InfoValue>
                            {profile.userBmr || "정보 없음"} kcal
                        </InfoValue>
                    </InfoItem>
                </InfoSection>
                <Button onClick={handleSubmit}>저장</Button>
            </FormContainer>
            {showProfileSelector && (
                <Overlay onClick={() => setShowProfileSelector(false)}>
                    <ProfileSelector onClick={(e) => e.stopPropagation()}>
                        {profileOptions.map((image, index) => (
                            <ProfileOption
                                key={index}
                                src={image}
                                alt={`프로필 옵션 ${index + 1}`}
                                onClick={() => handleImageSelect(image)}
                                selected={userImage === image}
                            />
                        ))}
                    </ProfileSelector>
                </Overlay>
            )}
        </Container>
    );
};

export default EditProfile;
