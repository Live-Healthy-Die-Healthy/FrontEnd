import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DietCalendar from "../../components/calendar/DietCalendar";
import TrainingCalendar from "../../components/calendar/TrainingCalendar";
import { useLocation } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    margin-top: 40px;
    padding: 0 20px;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 2vh;
    width: 100%;
    font-size: 30px;
`;

const CalendarContainer = styled.div`
    width: 100%;
`;

export default function MonthlyDiet() {
    const location = useLocation();
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
            <TabContainer>캘린더</TabContainer>
            <CalendarContainer>
                <DietCalendar />
            </CalendarContainer>
        </Container>
    );
}
