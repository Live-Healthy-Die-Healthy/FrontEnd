import React, { useState } from 'react';
import axios from 'axios';
import { UserContext } from "../context/LoginContext";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  text-align: center;
`;


const ProfileSetting = () => {
  const { userId } = React.useContext(UserContext);
  const [userBirth, setUserBirth] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userImage, setUserImage] = useState(null);

  const handleImageUpload = (event) => {
    setUserImage(event.target.files[0]);
  };

  const handleSubmit = async () => {

    const response = await axios.post(`http://localhost:4000/profile`, {
        userId : userId,
        userBirth : userBirth,
        userHeight : userHeight,
        userWeight : userWeight,
        userGender : userGender,
        userImage : userImage,
        })
      .then(response => {
        alert("프로필이 성공적으로 업데이트되었습니다.");
      })
      .catch(error => {
        console.log(error);
        alert("프로필 업데이트에 실패했습니다.");
      });
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
        <input type="number" value={userHeight} onChange={(e) => setUserHeight(e.target.value)} />
      </div>
      <div>
        <label>몸무게</label>
        <input type="number" value={userWeight} onChange={(e) => setUserWeight(e.target.value)} />
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
