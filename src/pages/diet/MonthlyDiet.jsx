import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DietCalendar from "../../components/calendar/DietCalendar";
import TrainingCalendar from "../../components/calendar/TrainingCalendar";
import { useLocation } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #f0f0f0;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2vh;
`;

const Tab = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: ${(props) => (props.active ? "#a3d2ca" : "#f0f0f0")};
    border: none;
    cursor: pointer;
    margin: 0 5px;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${(props) => (props.active ? "#a3d2ca" : "#e0e0e0")};
    }
`;

const CalendarContainer = styled.div`
    width: 100%;
`;

export default function MonthlyView() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "training"
    );

    useEffect(() => {
        // URL에서 상태를 확인하여 activeTab을 설정합니다
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
                <Tab
                    active={activeTab === "training"}
                    onClick={() => setActiveTab("training")}
                >
                    운동
                </Tab>
                <Tab
                    active={activeTab === "diet"}
                    onClick={() => setActiveTab("diet")}
                >
                    식단
                </Tab>
            </TabContainer>
            <CalendarContainer>
                {activeTab === "diet" ? <DietCalendar /> : <TrainingCalendar />}
            </CalendarContainer>
        </Container>
    );
}
