import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/LoginContext";
import heic2any from "heic2any";

const ModalOverlay = styled.div`
    font-size: 20px;
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
    width: 280px;
`;

const Button = styled.button`
    margin: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    cursor: pointer;
`;

const ImagePreview = styled.img`
    width: 100%;
    margin-bottom: 10px;
    border-radius: 10px;
`;

const ImageUploadModal = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { userId } = useContext(UserContext);
    const { formattedDate, dietType } = useParams();

    const compressImage = (file, maxSizeKB) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    let quality = 0.7;
                    let iterations = 0;

                    const compress = () => {
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        canvas.toBlob((blob) => {
                            if (blob.size > maxSizeKB * 1024 && iterations < 10) {
                                iterations++;
                                width *= 0.9;
                                height *= 0.9;
                                quality -= 0.1;
                                compress();
                            } else {
                                resolve(blob);
                            }
                        }, file.type, quality);
                    };

                    compress();
                };
            };
        });
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        let processedFile = file;

        if (file.type === "image/heic") {
            try {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                });
                processedFile = new File(
                    [convertedBlob],
                    file.name.replace(".heic", ".jpg"),
                    {
                        type: "image/jpeg",
                    }
                );
            } catch (error) {
                console.error("HEIC 변환 실패:", error);
                alert("이미지 변환에 실패했습니다.");
                return;
            }
        }

        setSelectedFile(processedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(processedFile);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            let fileToUpload = selectedFile;
            if (selectedFile.size > 700 * 1024) {
                const compressedBlob = await compressImage(selectedFile, 700);
                fileToUpload = new File([compressedBlob], selectedFile.name, {
                    type: compressedBlob.type,
                });
            }

            const reader = new FileReader();
            reader.readAsDataURL(fileToUpload);
            reader.onloadend = async () => {
                const base64Image = reader.result;
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_PORT}/gpt/dietImage`,
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
                    if (error.response && error.response.status === 413) {
                        alert("이미지 크기가 너무 큽니다. 다시 시도해주세요.");
                    } else {
                        alert("이미지 업로드에 실패했습니다.");
                    }
                }
            };
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>이미지 업로드</h2>
                {preview && (
                    <ImagePreview src={preview} alt='이미지 미리보기' />
                )}
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
