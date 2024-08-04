import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import AddFriendOverlay from "../../components/friendOverlay/AddFriendOverlay";
import FriendRequestsOverlay from "../../components/friendOverlay/FriendRequestsOverlay";
import FriendComparisonComponent from "../../components/friendOverlay/FriendComparisonComponent";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";
import { format, startOfToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MdPersonAddAlt1 } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
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

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    width: 100%;
    max-width: 1000px;
    font-size: 40px;
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
    margin: 0px 10px;
`;

const IconContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-left: auto;

    width: 100%;
    max-width: 800px;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    font-size: 50px;
    cursor: pointer;
    padding: 0 10px;
    margin: 0 5px;
    color: rgb(24, 24, 24);
    display: flex;
    align-items: center;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const NoFriendContainer = styled.div`
    border: 1px dashed lightgrey;
    border-radius: 40px;
    height: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const FriendContainer = styled.div`
    border: 1px solid lightgrey;
    border-radius: 40px;
    height: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NoFriend = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: grey;
`;

const TwoContainer = styled.div`
    font-size: 24px;
    width: 100%;
    max-width: 800px;
`;

export default function FriendPage() {
    const navigate = useNavigate();
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showFriendRequests, setShowFriendRequests] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { userId } = useContext(UserContext);
    const formattedDate = format(new Date(startOfToday()), "yyyy-MM-dd");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/friendList`,
                    {
                        userId,
                    }
                );
                setFriends(response.data);
                console.log("response.data : ", response.data);
            } catch (error) {
                console.error("친구 목록 가져오기 실패:", error);
            }
        };

        fetchFriends();
    }, [userId, showFriendRequests]);

    const friendClickHandler = (friend) => {
        setSelectedFriend(friend);
        navigate(`/comparefriend/${formattedDate}`, {
            state: { friend },
        });
    };

    return (
        <Container>
            <TabContainer>
                <Header>
                    <CloseButton onClick={() => navigate("/home")}>
                        X
                    </CloseButton>
                    <span>친구목록</span>
                </Header>
            </TabContainer>
            {!selectedFriend ? (
                <TwoContainer>
                    <IconContainer>
                        <IconButton onClick={() => setShowAddFriend(true)}>
                            <MdPersonAddAlt1 />
                        </IconButton>
                        <IconButton onClick={() => setShowFriendRequests(true)}>
                            <LiaUserFriendsSolid />
                        </IconButton>
                    </IconContainer>
                    {friends.length > 0 ? (
                        <FriendContainer>
                            <FriendList>
                                {friends.map((friend) => (
                                    <FriendItem
                                        key={friend.userId}
                                        onClick={() =>
                                            friendClickHandler(friend)
                                        }
                                    >
                                        <FriendImage
                                            src={`data:image/jpeg;base64,${friend.userImage}`}
                                            alt={friend.username}
                                        />
                                        <div>{friend.username}</div>
                                    </FriendItem>
                                ))}
                            </FriendList>
                        </FriendContainer>
                    ) : (
                        <NoFriend>
                            <NoFriendContainer>
                                친구들과 아이디를 공유해 친구를 추가해보세요 !
                            </NoFriendContainer>
                        </NoFriend>
                    )}
                    {showAddFriend && (
                        <AddFriendOverlay
                            onClose={() => setShowAddFriend(false)}
                        />
                    )}
                    {showFriendRequests && (
                        <FriendRequestsOverlay
                            onClose={() => setShowFriendRequests(false)}
                        />
                    )}
                </TwoContainer>
            ) : (
                <FriendComparisonComponent
                    friend={selectedFriend}
                    onBack={() => setSelectedFriend(null)}
                />
            )}
        </Container>
    );
}
