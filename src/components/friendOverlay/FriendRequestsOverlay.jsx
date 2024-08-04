import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Overlay = styled.div`
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

const OverlayContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const RequestList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const RequestItem = styled.li`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`;

const UserImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-right: 10px;
`;

const UserInfo = styled.div`
    flex-grow: 1;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Button = styled.button`
    padding: 8px 16px;
    margin-left: 5px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 18px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:first-child {
        background-color: #28a745;

        &:hover {
            background-color: #218838;
        }
    }

    &:last-child {
        background-color: #dc3545;

        &:hover {
            background-color: #c82333;
        }
    }
`;

const FriendRequestsOverlay = ({ onClose }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const { userId } = useContext(UserContext);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/showFriendRequest`,
                    { userId }
                );
                console.log("response : ", response);
                setFriendRequests(response.data);
            } catch (error) {
                console.error("친구 요청 목록 가져오기 실패:", error);
            }
        };

        fetchFriendRequests();
    }, [userId]);

    const handleRequestResponse = async (to_user_id, confirm) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_PORT}/confirmFriendRequest`,
                {
                    userId,
                    to_user_id,
                    confirm,
                }
            );

            setFriendRequests(
                friendRequests.filter(
                    (request) => request.userId !== to_user_id
                )
            );
        } catch (error) {
            console.error("친구 요청 응답 실패:", error);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <OverlayContent onClick={(e) => e.stopPropagation()}>
                <Title>친구 요청 보기</Title>
                {friendRequests.length > 0 ? (
                    <RequestList>
                        {friendRequests.map((request) => (
                            <RequestItem key={request.userId}>
                                {/* <UserImage
                                    src={`data:image/jpeg;base64,${request.userImage}`}
                                    alt={request.username}
                                /> */}
                                <UserInfo>
                                    <div>{request.username}</div>
                                </UserInfo>
                                <ButtonGroup>
                                    <Button
                                        onClick={() =>
                                            handleRequestResponse(
                                                request.userId,
                                                "accepted"
                                            )
                                        }
                                    >
                                        수락
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleRequestResponse(
                                                request.userId,
                                                "rejected"
                                            )
                                        }
                                    >
                                        거절
                                    </Button>
                                </ButtonGroup>
                            </RequestItem>
                        ))}
                    </RequestList>
                ) : (
                    <p>친구 요청이 없습니다.</p>
                )}
            </OverlayContent>
        </Overlay>
    );
};

export default FriendRequestsOverlay;
