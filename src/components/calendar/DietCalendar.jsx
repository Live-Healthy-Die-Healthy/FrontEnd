import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    isBefore,
    addDays,
    subDays,
} from "date-fns";
import { UserContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 40px;
`;

const CalendarContainer = styled.div`
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    width: 100%;
    gap: 0;
    aspect-ratio: 7/6;
`;

const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-right: auto;
`;

const MonthYear = styled.h2`
    color: #ff8000;
    font-size: 30px;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 40px;
    color: #ff8000;
    cursor: pointer;
    position: relative;
`;

const DayCell = styled.div`
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: ${(props) => (props.isToday ? "#fff3e0" : "white")};
    color: ${(props) => (props.isCurrentMonth ? "black" : "#ccc")};
    border-bottom: ${(props) =>
        props.isWeekDay ? "none" : "1px solid #FFCB5B"};
    border-top: ${(props) => (props.isTopRow ? "2px solid #FFCB5B" : "none")};
    font-size: 20px;
    cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
    opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
    padding-top: 5px;
`;

const DayNumber = styled.span`
    font-weight: ${(props) => (props.isToday ? "bold" : "normal")};
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: ${(props) =>
        props.isSelected ? "#FFCB5B" : "transparent"};
`;

const RecordDots = styled.div`
    display: flex;
    margin-top: 4px;
`;

const Dot = styled.div`
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin: 0 2px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

const OverlayContent = styled.div`
    background-color: #ffeeae;
    padding: 20px;
    border-radius: 10px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
`;

const Button = styled.button`
    font-size: 20px;
    margin-top: 10px;
    margin: 0px 10px;
    padding: 10px 20px;
    background-color: ${(props) => props.color};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const RecordSection = styled.div`
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    font-weight: 400;
`;

const LegendContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 23px;
    margin-right: 20px;
    border-radius: 30px;
    padding: 5px;
    background-color: ${(props) => props.color};
`;

const LegendDot = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin-right: 5px;
`;

const DateContainer = styled.div`
    display: inline-block;
    background-color: #49406f;
    color: #ffffff;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function DietCalendar() {
    const { userId } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [records, setRecords] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMonthRecords = async () => {
            try {
                const [dietResponse, exerciseResponse] = await Promise.all([
                    axios.post(
                        `${process.env.REACT_APP_API_PORT}/dietCalender`,
                        {
                            userId,
                            date: format(currentDate, "yyyy-MM"),
                        }
                    ),
                    axios.post(
                        `${process.env.REACT_APP_API_PORT}/exerciseCalendar`,
                        {
                            userId,
                            date: format(currentDate, "yyyy-MM"),
                        }
                    ),
                ]);

                const combinedRecords = {};
                dietResponse.data.forEach((record) => {
                    const date = record.date.split("T")[0];
                    if (!combinedRecords[date]) combinedRecords[date] = {};
                    combinedRecords[date].diet = true;
                });
                exerciseResponse.data.forEach((record) => {
                    const date = record.exerciseDate.split("T")[0];
                    if (!combinedRecords[date]) combinedRecords[date] = {};
                    combinedRecords[date].exercise = true;
                });

                setRecords(combinedRecords);
            } catch (error) {
                console.error("Error fetching month records:", error);
            }
        };

        fetchMonthRecords();
    }, [currentDate, userId]);

    const handleDateClick = async (date) => {
        if (isBefore(date, new Date()) || isSameDay(date, new Date())) {
            setSelectedDate(date);
            try {
                const [dietResponse, exerciseResponse] = await Promise.all([
                    axios.post(
                        `${process.env.REACT_APP_API_PORT}/dietCalender`,
                        {
                            userId,
                            date: format(date, "yyyy-MM-dd"),
                        }
                    ),
                    axios.post(
                        `${process.env.REACT_APP_API_PORT}/exerciseCalendar`,
                        {
                            userId,
                            date: format(date, "yyyy-MM-dd"),
                        }
                    ),
                ]);

                const selectedDietRecords = dietResponse.data.filter(
                    (record) => record.date === format(date, "yyyy-MM-dd")
                );
                const selectedExerciseRecords = exerciseResponse.data.filter(
                    (record) =>
                        record.exerciseDate.split("T")[0] ===
                        format(date, "yyyy-MM-dd")
                );

                setSelectedDateInfo({
                    diet: selectedDietRecords,
                    exercise: selectedExerciseRecords,
                });
            } catch (error) {
                console.error("Error fetching date info:", error);
            }
        }
    };

    const changeMonth = (increment) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(
                prevDate.getFullYear(),
                prevDate.getMonth() + increment,
                1
            );
            return newDate;
        });
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({
        start: subDays(monthStart, monthStart.getDay()),
        end: addDays(monthEnd, 6 - monthEnd.getDay()),
    });

    return (
        <Container>
            <CalendarContainer>
                <CalendarHeader>
                    <ArrowButton onClick={() => changeMonth(-1)}>
                        &lt;
                    </ArrowButton>
                    <MonthYear>{format(currentDate, "yyyy년 M월")}</MonthYear>
                    {!isSameMonth(new Date(), currentDate) && (
                        <ArrowButton onClick={() => changeMonth(1)}>
                            &gt;
                        </ArrowButton>
                    )}
                </CalendarHeader>
                <LegendContainer>
                    <LegendItem color='#FFCB5B'>
                        <LegendDot color='#FC6A03' />
                        <span>식단</span>
                    </LegendItem>
                    <LegendItem color='#CBF9EE'>
                        <LegendDot color='#5DDEBE' />
                        <span>운동</span>
                    </LegendItem>
                </LegendContainer>
                <CalendarGrid>
                    {weekDays.map((day) => (
                        <DayCell key={day} isWeekDay style={{ color: "black" }}>
                            {day}
                        </DayCell>
                    ))}
                    {monthDays.map((day, index) => {
                        const formattedDate = format(day, "yyyy-MM-dd");
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isDisabled =
                            isBefore(new Date(), day) && !isToday(day);
                        const dayRecords = records[formattedDate] || {};
                        const isTopRow = index < 7;
                        const isLeftColumn = index % 7 === 0;
                        const isRightColumn = index % 7 === 6;

                        return (
                            <DayCell
                                key={day}
                                isToday={isToday(day)}
                                isCurrentMonth={isCurrentMonth}
                                isDisabled={isDisabled}
                                onClick={() =>
                                    !isDisabled && handleDateClick(day)
                                }
                                isTopRow={isTopRow}
                                isLeftColumn={isLeftColumn}
                                isRightColumn={isRightColumn}
                            >
                                <DayNumber
                                    isToday={isToday(day)}
                                    isSelected={isSameDay(day, selectedDate)}
                                >
                                    {format(day, "d")}
                                </DayNumber>
                                <RecordDots>
                                    {dayRecords.diet && <Dot color='#FC6A03' />}
                                    {dayRecords.exercise && (
                                        <Dot color='#5DDEBE' />
                                    )}
                                </RecordDots>
                            </DayCell>
                        );
                    })}
                </CalendarGrid>
            </CalendarContainer>
            {selectedDate && selectedDateInfo && (
                <Overlay onClick={() => setSelectedDate(null)}>
                    <OverlayContent onClick={(e) => e.stopPropagation()}>
                        <DateContainer>
                            {format(selectedDate, "M/d")}
                        </DateContainer>
                        <RecordSection color='#FFF3E0'>
                            <h4>식단 기록</h4>
                            {selectedDateInfo.diet.length > 0 ? (
                                selectedDateInfo.diet.map((item, index) => (
                                    <p key={index}>
                                        총 칼로리 : {item.calories}kcal
                                    </p>
                                ))
                            ) : (
                                <p>식단 기록이 없습니다.</p>
                            )}
                        </RecordSection>
                        <RecordSection color='#E0F2F1'>
                            <h4>운동 기록</h4>
                            {selectedDateInfo.exercise.length > 0 ? (
                                selectedDateInfo.exercise.map((item, index) =>
                                    item.exerciseType ===
                                    "AnaerobicExercise" ? (
                                        <p key={index}>
                                            {item.exerciseName}- {item.set}세트
                                        </p>
                                    ) : (
                                        <p key={index}>
                                            {item.exerciseName}- {item.distance}
                                            km
                                        </p>
                                    )
                                )
                            ) : (
                                <p>운동 기록이 없습니다.</p>
                            )}
                        </RecordSection>
                        <Button
                            color='#FF8000'
                            onClick={() =>
                                navigate(
                                    `/dietdaily/${format(
                                        selectedDate,
                                        "yyyy-MM-dd"
                                    )}`,
                                    {
                                        state: { date: selectedDate },
                                    }
                                )
                            }
                        >
                            식단 기록하기
                        </Button>
                        <Button
                            color='#A3D2CA'
                            onClick={() =>
                                navigate(
                                    `/traindaily/${format(
                                        selectedDate,
                                        "yyyy-MM-dd"
                                    )}`,
                                    {
                                        state: { date: selectedDate },
                                    }
                                )
                            }
                        >
                            운동 기록하기
                        </Button>
                    </OverlayContent>
                </Overlay>
            )}
        </Container>
    );
}
