import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
    margin-bottom: 20px;
`;

const AnalyzingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysisId, dietImage } = location.state;
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const { formattedDate, dietType } = useParams();

    useEffect(() => {
        const checkAnalysisStatus = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/analysisStatus/${analysisId}`
                );
                if (response.data.status === "completed") {
                    setIsAnalyzing(false);
                    navigate(`/confirmDiet/${formattedDate}/${dietType}`, {
                        state: { dietInfo: response.data.dietInfo, dietImage },
                    });
                } else {
                    setTimeout(checkAnalysisStatus, 5000); // 5초마다 상태 확인
                }
            } catch (error) {
                console.error("Error checking analysis status:", error);
            }
        };

        checkAnalysisStatus();
    }, [analysisId, navigate, formattedDate, dietType, dietImage]);

    return (
        <Container>
            <Spinner />
            <p>사진을 분석하는 중입니다...</p>
        </Container>
    );
};

export default AnalyzingPage;
