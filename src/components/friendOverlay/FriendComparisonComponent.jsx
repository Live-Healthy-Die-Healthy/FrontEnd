import React from "react";
import styled from "styled-components";

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const BackButton = styled.button`
  align-self: flex-start;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const FriendImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const ComparisonContent = styled.div`
  width: 100%;
  // 여기에 비교 내용에 대한 스타일을 추가하세요
`;

const FriendComparisonComponent = ({ friend, onBack }) => {
  return (
    <ComparisonContainer>
      <BackButton onClick={onBack}>뒤로 가기</BackButton>
      <FriendInfo>
        <FriendImage src={`data:image/jpeg;base64,${friend.userImage}`} alt={friend.username} />
        <h2>{friend.username}</h2>
      </FriendInfo>
      <ComparisonContent>
        {/* 여기에 친구와의 비교 내용을 추가하세요 */}
        <p>친구와의 비교 내용이 여기에 들어갑니다.</p>
      </ComparisonContent>
    </ComparisonContainer>
  );
};

export default FriendComparisonComponent;