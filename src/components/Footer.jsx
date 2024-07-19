import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #f8f8f8;
    padding: 10px 0;
`;

const Button = styled.button`
    background: rgb(196, 196, 196);
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0 20px;
`;

export default function Footer() {
    const navigate = useNavigate();

    return (
        <Container>
            <Button onClick={() => navigate("/trainmonth")}>운동</Button>
            <Button onClick={() => navigate("/dietmonth")}>식단</Button>
            <Button onClick={() => navigate("/report")}>레포트</Button>
            <Button onClick={() => navigate("/settings")}>설정</Button>
        </Container>
    );
}
