import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
`;

const Button = styled.button`
    background: rgb(196, 196, 196);
    height: 13vh;
    border: none;
    font-size: 25px;
    font-weight: 600;
    cursor: pointer;
    padding: 0 20px;
    margin: 10px;
    background-color: ${(props) => props.color};
    border-radius: 20px;
    width: 70%;
`;

export default function ReportPage() {
    const navigate = useNavigate();

    return (
        <Container>
            <Button color='#FC6A03' onClick={() => navigate("/dailyreport")}>
                일간 레포트
            </Button>
            <Button color='#FFBB29' onClick={() => navigate("/weeklyreport")}>
                주간 레포트
            </Button>
            <Button color='#D8CFFF' onClick={() => navigate("/monthlyreport")}>
                월간 레포트
            </Button>
        </Container>
    );
}
