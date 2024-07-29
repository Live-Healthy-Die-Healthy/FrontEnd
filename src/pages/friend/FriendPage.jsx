import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import AddFriendOverlay from "../../components/friendOverlay/AddFriendOverlay";
import FriendRequestsOverlay from "../../components/friendOverlay/FriendRequestsOverlay";
import FriendComparisonComponent from "../../components/friendOverlay/FriendComparisonComponent";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: rgb(196, 196, 196);
  height: 13vh;
  border: none;
  font-size: 25px;
  cursor: pointer;
  padding: 0 20px;
  margin: 10px;
`;

const FriendList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 600px;
`;

const FriendItem = styled.li`
  background-color: #f0f0f0;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const FriendImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export default function FriendPage() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_PORT}/friendList`, {
            userId
          });
        setFriends(response.data);
      } catch (error) {
        console.error("친구 목록 가져오기 실패:", error);
      }
    };

    fetchFriends();
  }, [userId, showFriendRequests]);

  const friendClickHandler = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <Container>
      {!selectedFriend ? (
        <>
          <ButtonContainer>
            <Button onClick={() => setShowAddFriend(true)}>친구 추가하기</Button>
            <Button onClick={() => setShowFriendRequests(true)}>친구 요청 보기</Button>
          </ButtonContainer>

          <FriendList>
            <h1>친구목록</h1>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <FriendItem key={friend.userId} onClick={() => friendClickHandler(friend)}>
                  <FriendImage src={`data:image/jpeg;base64,${friend.userImage}`} alt={friend.username} />
                  <div>{friend.username}</div>
                </FriendItem>
              ))
            ) : (
              <h2>친구가 없습니다</h2>
            )}
          </FriendList>

          {showAddFriend && <AddFriendOverlay onClose={() => setShowAddFriend(false)} />}
          {showFriendRequests && <FriendRequestsOverlay onClose={() => setShowFriendRequests(false)} />}
        </>
      ) : (
        <FriendComparisonComponent friend={selectedFriend} onBack={() => setSelectedFriend(null)} />
      )}
    </Container>
  );
}