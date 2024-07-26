import React, { useState } from "react";
import styled from "styled-components";
import DietCalendar from "../../components/calendar/DietCalendar";
import TrainingCalendar from "../../components/calendar/TrainingCalendar";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #f0f0f0;
    padding: 20px;
`;

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
`;

const Tab = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: ${props => props.active ? "#a3d2ca" : "#f0f0f0"};
    border: none;
    cursor: pointer;
    margin: 0 5px;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => props.active ? "#a3d2ca" : "#e0e0e0"};
    }
`;

const CalendarContainer = styled.div`
    width: 100%;
    height: 90vh;  // 또는 원하는 고정 높이
`;

export default function MonthlyView() {
    const [activeTab, setActiveTab] = useState("diet");

    return (
        <Container>
            <TabContainer>
                <Tab 
                    active={activeTab === "diet"} 
                    onClick={() => setActiveTab("diet")}
                >
                    식단
                </Tab>
                <Tab 
                    active={activeTab === "training"} 
                    onClick={() => setActiveTab("training")}
                >
                    운동
                </Tab>
            </TabContainer>
            <CalendarContainer>
            {activeTab === "diet" ? <DietCalendar /> : <TrainingCalendar />}
            </CalendarContainer>
        </Container>
    );
}