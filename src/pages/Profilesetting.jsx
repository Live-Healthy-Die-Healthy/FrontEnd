import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from "../context/LoginContext";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;
`;

const ProfileSetting = () => {
  const location = useLocation();
  const { userEmail, userNickname } = location.state;
  const { userId } = React.useContext(UserContext);
  const [userBirth, setUserBirth] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [userGender, setUserGender] = useState("남성");
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    setUserImage(event.target.files[0]);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setUserHeight(value);
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setUserWeight(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/newProfile`, {
        userId,
        userEmail,
        userNickname,
        userBirth,
        userHeight,
        userWeight,
        userGender,
        userImage,
      });
      alert("프로필이 성공적으로 업데이트되었습니다.");
      navigate("/home");
    } catch (error) {
      console.log(error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <Container>
      <h1>프로필 등록하기</h1>
      <div>
        <label htmlFor="profileImage">프로필 사진 업로드</label>
        <input type="file" id="profileImage" onChange={handleImageUpload} />
      </div>
      <div>
        <label>생년월일</label>
        <input type="date" value={userBirth} onChange={(e) => setUserBirth(e.target.value)} />
      </div>
      <div>
        <label>키</label>
        <input type="number" value={userHeight} onChange={handleHeightChange} />
      </div>
      <div>
        <label>몸무게</label>
        <input type="number" value={userWeight} onChange={handleWeightChange} />
      </div>
      <div>
        <label>성별</label>
        <select value={userGender} onChange={(e) => setUserGender(e.target.value)}>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>
      <button onClick={handleSubmit}>프로필 저장</button>
    </Container>
  );
};

export default ProfileSetting;
