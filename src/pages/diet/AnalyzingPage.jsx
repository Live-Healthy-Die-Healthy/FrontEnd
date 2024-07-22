import React, { useEffect, useState, useCallback } from "react";
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
    const [error, setError] = useState(null);
    const { formattedDate, dietType } = useParams();

    const checkAnalysisStatus = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_API_PORT}:4000/gpt/analysisStatus/${analysisId}`
            );
            if (response.data.status === "completed") {
                setIsAnalyzing(false);
                console.log(
                    "response.data.dietDetailLogIds : ",
                    response.data.dietDetailLogIds
                );

                navigate(`/confirmDiet/${formattedDate}/${dietType}`, {
                    state: {
                        dietInfo: response.data.dietInfo,
                        dietImage,
                        dietDetailLogIds: response.data.dietDetailLogIds,
                    },
                });
            } else if (response.data.status === "in_progress") {
                setError("식단 사진을 분석 중입니다...");
            } else if (response.data.status === "failed") {
                alert(response.data.message);
                navigate(-1);
            }
        } catch (error) {
            console.error("Error checking analysis status:", error);
            setError("분석 상태를 확인하는 중 오류가 발생했습니다.");
        }
    }, [analysisId, navigate, formattedDate, dietType, dietImage]);

    useEffect(() => {
        let intervalId;
        let timeoutId;

        const startChecking = () => {
            intervalId = setInterval(checkAnalysisStatus, 5000); // 5초마다 상태 확인
        };

        startChecking();

        // 5분 후에도 분석이 완료되지 않으면 사용자에게 알림
        timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            setError(
                "분석이 예상보다 오래 걸리고 있습니다. 나중에 다시 시도해주세요."
            );
            alert(
                "분석이 예상보다 오래 걸리고 있습니다. 나중에 다시 시도해주세요."
            );
            navigate(-1);
        }, 300000); // 5분

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [checkAnalysisStatus]);

    return (
        <Container>
            <Spinner />
            <p>사진을 분석하는 중입니다...</p>
        </Container>
    );
};

export default AnalyzingPage;
