import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/LoginContext";

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
`;

const Button = styled.button`
    margin: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const ImageUploadModal = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { userId } = useContext(UserContext);
    const { formattedDate, dietType } = useParams();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = async () => {
                const base64Image = reader.result;
                try {
                    const response = await axios.post(
                        "http://localhost:4000/gpt/dietImage",
                        {
                            userId,
                            dietType,
                            dietDate: formattedDate,
                            dietImage: base64Image,
                        }
                    );
                    navigate(`/analyzing/${formattedDate}/${dietType}`, {
                        state: {
                            analysisId: response.data.analysisId,
                            dietImage: base64Image,
                        },
                    });
                } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("이미지 업로드에 실패했습니다.");
                }
            };
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>이미지 업로드</h2>
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                />

                <Button onClick={() => fileInputRef.current.click()}>
                    이미지 선택
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFile}>
                    업로드 하기
                </Button>
                <Button onClick={onClose}>취소</Button>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ImageUploadModal;
