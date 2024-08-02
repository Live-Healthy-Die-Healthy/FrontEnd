import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import default_image from "../../image/default-profile.png";

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
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Button = styled.button`
    background: #a3d2ca;
    border: none;
    padding: 10px 20px;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
`;

const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 0%;
    margin-right: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HiddenInput = styled.input`
    display: none;
`;

const EditProfile = () => {
    const { state } = useLocation();
    const { profile } = state;
    const { userId } = useContext(UserContext);
    const navigate = useNavigate();

    const profileImageSrc = profile?.userImage
        ? `data:image/jpeg;base64,${profile.userImage}`
        : default_image;

    const [userEmail, setUserEmail] = useState(profile.userEmail);
    const [username, setUsername] = useState(profile.userNickname);
    const [userBirth, setUserBirth] = useState(
        format(new Date(profile.userBirth), "yyyy-MM-dd")
    );
    const [userHeight, setUserHeight] = useState(profile.userHeight);
    const [userWeight, setUserWeight] = useState(profile.userWeight);
    const [userGender, setUserGender] = useState(profile.userGender);
    const [userImage, setUserImage] = useState(profileImageSrc);
    const [userMuscleMass, setUserMuscleMass] = useState(
        profile.userMuscleMass || ""
    );
    const [userBmi, setUserBmi] = useState(profile.userBmi || "");
    const [userBodyFatPercentage, setUserBodyFatPercentage] = useState(
        profile.userBodyFatPercentage || ""
    );
    const [userBmr, setUserBmr] = useState(profile.userBmr || "");

    const fileInputRef = React.createRef();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const maxWidth = 800; // 최대 너비 설정
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setUserImage(canvas.toDataURL("image/jpeg", 0.8)); // 품질 80%로 설정
            };
            img.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleResetImage = () => {
        setUserImage(default_image);
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
                    userBmr,
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
            <h1>프로필 수정</h1>
            <FormContainer>
                <ImageContainer>
                    <ProfileImage
                        src={userImage || default_image}
                        alt='프로필 이미지'
                    />
                    <HiddenInput
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                    <Button onClick={() => fileInputRef.current.click()}>
                        프로필 이미지 변경하기
                    </Button>
                    <Button onClick={handleResetImage}>
                        기본 이미지로 변경하기
                    </Button>
                </ImageContainer>
                <label>이메일</label>
                <Input
                    type='email'
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder='이메일'
                />
                <label>닉네임</label>
                <Input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='닉네임'
                />
                <label>생년월일</label>
                <Input
                    type='date'
                    value={userBirth}
                    onChange={(e) => setUserBirth(e.target.value)}
                    placeholder='생년월일'
                />
                <label>키 (cm)</label>
                <Input
                    type='number'
                    value={userHeight}
                    onChange={(e) => setUserHeight(e.target.value)}
                    placeholder='키 (cm)'
                />
                <label>몸무게 (kg)</label>
                <Input
                    type='number'
                    value={userWeight}
                    onChange={(e) => setUserWeight(e.target.value)}
                    placeholder='몸무게 (kg)'
                />
                <label>골격근량 (kg)</label>
                <Input
                    type='number'
                    value={userMuscleMass}
                    onChange={(e) => setUserMuscleMass(e.target.value)}
                    placeholder='골격근량 (kg)'
                />
                <label>BMI</label>
                <Input
                    type='number'
                    value={userBmi}
                    onChange={(e) => setUserBmi(e.target.value)}
                    placeholder='BMI'
                />
                <label>체지방률 (%)</label>
                <Input
                    type='number'
                    value={userBodyFatPercentage}
                    onChange={(e) => setUserBodyFatPercentage(e.target.value)}
                    placeholder='체지방률 (%)'
                />
                <label>기초대사량 (kcal)</label>
                <Input
                    type='number'
                    value={userBmr}
                    onChange={(e) => setUserBmr(e.target.value)}
                    placeholder='기초대사량 (kcal)'
                />
                <Button onClick={handleSubmit}>저장</Button>
            </FormContainer>
        </Container>
    );
};

export default EditProfile;
