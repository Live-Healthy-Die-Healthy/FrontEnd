import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DietCalendar from "../../components/calendar/DietCalendar";
import TrainingCalendar from "../../components/calendar/TrainingCalendar";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 0 20px;
`;

const CalendarContainer = styled.div`
    width: 100%;
`;

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    font-size: 30px;
`;

const CloseButton = styled.button`
    background-color: #a1d9ff;
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

export default function MonthlyDiet() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "training"
    );

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
            localStorage.setItem("activeTab", location.state.activeTab);
        }
    }, [location.state]);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    return (
        <Container>
            <TabContainer>
                <CloseButton onClick={() => navigate("/home")}>X</CloseButton>
                <span>캘린더</span>
            </TabContainer>
            <CalendarContainer>
                <DietCalendar />
            </CalendarContainer>
        </Container>
    );
}
