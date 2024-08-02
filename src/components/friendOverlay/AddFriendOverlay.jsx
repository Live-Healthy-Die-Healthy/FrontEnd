import React, { useState, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/LoginContext";
import axios from "axios"; // axios import 추가

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
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: #333;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;

const AddFriendOverlay = ({ onClose }) => {
    const [friendId, setFriendId] = useState("");
    const { userId } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (friendId === "") {
            alert("친구의 ID를 입력해주세요 !");
            return;
        } else if (userId === friendId) {
            alert("자신은 친구로 추가할 수 없습니다.");
            setFriendId("");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/friendRequest`,
                {
                    userId,
                    to_user_id: friendId,
                }
            );
            if (response.data.success === false) {
                alert("이미 친구 요청을 보낸 사용자입니다 !");
                return;
            } else if (!response.data.isExist) {
                alert("존재하지 않는 사용자 입니다, 아이디를 확인해주세요 !");
                return;
            }

            console.log("친구 추가 요청 성공:", response.data);
            alert("친구 요청을 보냈습니다.");
            onClose();
        } catch (error) {
            alert("친구 요청 중 오류가 발생했습니다.");
            setFriendId("");
            console.error("친구 추가 요청 오류:", error);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <OverlayContent onClick={(e) => e.stopPropagation()}>
                <Title>친구 추가하기</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type='text'
                        value={friendId}
                        onChange={(e) => setFriendId(e.target.value)}
                        placeholder='친구 ID 입력'
                    />
                    <Button type='submit'>추가하기</Button>
                </Form>
            </OverlayContent>
        </Overlay>
    );
};

export default AddFriendOverlay;
