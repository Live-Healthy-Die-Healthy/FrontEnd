import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DailyReportCalendar from "../../components/calendar/DailyReportCalendar";
import WeeklyReportCalendar from "../../components/calendar/WeeklyReportCalendar";
import MonthlyReportCalendar from "../../components/calendar/MonthlyReportCalendar";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const Button = styled.button`
    background: rgb(196, 196, 196);
    height: 5vh;
    border: none;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    padding: 0 20px;
    margin: 10px;
    background-color: ${(props) => (props.isActive ? "#FF8000" : "#c4c4c4")};
    border-radius: 20px;
    width: 30%;
    color: white;

    &:hover {
        background-color: #ff8000;
    }
`;

const TabContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 100%;
    font-size: 30px;
    max-width: 1000px;
`;

const CloseButton = styled.button`
    background-color: #96ceb3;
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

export default function ReportPage() {
    const navigate = useNavigate();
    const [calendarType, setCalendarType] = useState("daily");

    return (
        <Container>
            <TabContainer>
                <CloseButton onClick={() => navigate("/home")}>X</CloseButton>
                <span>레포트</span>
            </TabContainer>
            <ButtonContainer>
                <Button
                    onClick={() => setCalendarType("daily")}
                    isActive={calendarType === "daily"}
                >
                    일간
                </Button>
                <Button
                    onClick={() => setCalendarType("weekly")}
                    isActive={calendarType === "weekly"}
                >
                    주간
                </Button>
                <Button
                    onClick={() => setCalendarType("monthly")}
                    isActive={calendarType === "monthly"}
                >
                    월간
                </Button>
            </ButtonContainer>
            {calendarType === "daily" && <DailyReportCalendar />}
            {calendarType === "weekly" && <WeeklyReportCalendar />}
            {calendarType === "monthly" && <MonthlyReportCalendar />}
        </Container>
    );
}
