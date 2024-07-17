import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";
import { format } from "date-fns";
import default_image from "../../image/default-profile.png"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 400px;
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
  margin-top: 10px;
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

const EditProfile = () => {
  const { state } = useLocation();
  const { profile } = state;
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(profile.userEmail);
  const [username, setUsername] = useState(profile.username);
  const [userBirth, setUserBirth] = useState(format(new Date(profile.userBirth), "yyyy-MM-dd"));
  const [userHeight, setUserHeight] = useState(profile.userHeight);
  const [userWeight, setUserWeight] = useState(profile.userWeight);
  const [userGender, setUserGender] = useState(profile.userGender);
  const [userImage, setUserImage] = useState(profile.userImage);

  const handleImageUpload = (event) => {
    setUserImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleResetImage = () => {
    setUserImage("default-profile.png");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put("http://localhost:4000/profile", {
        userId,
        userEmail,
        username,
        userBirth,
        userHeight,
        userWeight,
        userGender,
        userImage
      });
      alert("프로필이 성공적으로 업데이트되었습니다.");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <Container>
      <h1>프로필 수정</h1>
      <FormContainer>
        <ImageContainer>
          <ProfileImage src={userImage || default_image} alt="프로필 이미지" />
          <input type="file" onChange={handleImageUpload} />
          <Button onClick={handleResetImage}>기본 이미지로 변경하기</Button>
        </ImageContainer>
        <Input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="이메일" />
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="닉네임" />
        <Input type="date" value={userBirth} onChange={(e) => setUserBirth(e.target.value)} placeholder="생년월일" />
        <Input type="number" value={userHeight} onChange={(e) => setUserHeight(e.target.value)} placeholder="키 (cm)" />
        <Input type="number" value={userWeight} onChange={(e) => setUserWeight(e.target.value)} placeholder="몸무게 (kg)" />
        <Button onClick={handleSubmit}>저장</Button>
      </FormContainer>
    </Container>
  );
};

export default EditProfile;
