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
    align-items: flex-start;
    background-color: #ffffff;
    width: 100%;
`;

const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-right: auto;
`;

const MonthYear = styled.h2`
    color: #ff8000;
    font-size: 24px;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #ff8000;
    cursor: pointer;
    position: relative;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    width: 100%;
    gap: 0;
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
    font-size: 16px;
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
    margin-top: 10px;
    margin: 0px 10px;
    padding: 10px 20px;
    background-color: ${(props) => props.color};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
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

const LoadingMessage = styled.div`
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
`;

const LoadingSpinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ConfirmationModal = styled(Overlay)`
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
`;

const ModalButton = styled(Button)`
    margin: 10px;
`;

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function DailyReportCalendar() {
    const { userId, accessToken } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [records, setRecords] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    const fetchMonthRecords = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/dailyReportDate`,
                {
                    userId,
                    month: format(currentDate, "yyyy-MM"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const combinedRecords = {};
            response.data.date.forEach((record) => {
                const date = record.split("T")[0];
                if (!combinedRecords[date]) combinedRecords[date] = {};
                combinedRecords[date].report = true;
            });

            setRecords(combinedRecords);
        } catch (error) {
            console.error("Error fetching month records:", error);
        }
    };

    useEffect(() => {
        fetchMonthRecords();
    }, [currentDate, userId, accessToken]);

    const handleDateClick = async (date) => {
        if (isBefore(date, new Date()) || isSameDay(date, new Date())) {
            setSelectedDate(date);
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/report/daily`,
                    {
                        userId,
                        date: format(date, "yyyy-MM-dd"),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log("response : ", response);
                setSelectedDateInfo(response.data.dailyReport || null);
                setIsValid(response.data.isValid);
                setIsFilled(response.data.isFilled);
            } catch (error) {
                console.error("Error fetching date info:", error);
                setSelectedDateInfo(null);
            }
        }
    };

    const handleCreateReport = () => {
        setShowConfirmation(true);
    };

    const handleConfirmCreateReport = async () => {
        setShowConfirmation(false);
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/newDaily`,
                {
                    userId,
                    date: format(selectedDate, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000, // 2분 타임아웃 설정
                }
            );

            setIsValid(true);
            setIsFilled(true);
            setSelectedDateInfo(response.data);
        } catch (error) {
            console.error("Error creating report:", error);
            alert("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
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

    const renderDietSection = () => {
        if (!selectedDateInfo) return null;

        const {
            breakfastLog,
            lunchLog,
            dinnerLog,
            snackLog,
            breakfastCal,
            lunchCal,
            dinnerCal,
            snackCal,
            totalCarbo,
            totalProtein,
            totalFat,
            totalCalories,
            recommendedCal,
            dietFeedback,
        } = selectedDateInfo;

        return (
            <RecordSection>
                <h4>식단 정보</h4>
                <div>아침 로그: {breakfastLog.join(", ")}</div>
                <div>아침 총 칼로리: {Math.round(breakfastCal)} kcal</div>
                <div>점심 로그: {lunchLog.join(", ")}</div>
                <div>점심 총 칼로리: {Math.round(lunchCal)} kcal</div>
                <div>저녁 로그: {dinnerLog.join(", ")}</div>
                <div>저녁 총 칼로리: {Math.round(dinnerCal)} kcal</div>
                <div>간식 로그: {snackLog.join(", ")}</div>
                <div>간식 총 칼로리: {Math.round(snackCal)} kcal</div>
                <div>오늘 총 섭취 탄수화물: {Math.round(totalCarbo)} g</div>
                <div>오늘 총 섭취 단백질: {Math.round(totalProtein)} g</div>
                <div>오늘 총 섭취 지방: {Math.round(totalFat)} g</div>
                <div>오늘 총 섭취 칼로리: {Math.round(totalCalories)} kcal</div>
                <div>권장 섭취 칼로리: {Math.round(recommendedCal)} kcal</div>
                <p>피드백: {dietFeedback}</p>
            </RecordSection>
        );
    };

    const renderExerciseSection = () => {
        if (!selectedDateInfo) return null;

        const { aeroInfo, anAeroInfo, exerciseFeedback } = selectedDateInfo;

        return (
            <RecordSection>
                <h4>운동 정보</h4>
                <div>
                    <h5>유산소 운동</h5>
                    {aeroInfo && aeroInfo.length > 0 ? (
                        aeroInfo.map((exercise, index) => (
                            <div key={index}>
                                {exercise.exerciseName}: {exercise.distance}km,{" "}
                                {exercise.exerciseTime}분
                            </div>
                        ))
                    ) : (
                        <div>유산소 운동 정보가 없습니다!</div>
                    )}
                </div>
                <div>
                    <h5>무산소 운동</h5>
                    {anAeroInfo && anAeroInfo.length > 0 ? (
                        anAeroInfo.map((exercise, index) => (
                            <div key={index}>
                                {exercise.exerciseName}: {exercise.weight}kg,{" "}
                                {exercise.repetitions}회
                            </div>
                        ))
                    ) : (
                        <div>무산소 운동 정보가 없습니다!</div>
                    )}
                </div>
                <p>피드백: {exerciseFeedback}</p>
                <Button color='#3846ff' onClick={closeOverlay}>
                    확인
                </Button>
            </RecordSection>
        );
    };

    const closeOverlay = () => {
        setSelectedDate(null);
        fetchMonthRecords();
    };

    return (
        <Container>
            {selectedDate ? (
                <Overlay onClick={() => setSelectedDate(null)}>
                    <OverlayContent onClick={(e) => e.stopPropagation()}>
                        <DateContainer>
                            {format(selectedDate, "M/d")}
                        </DateContainer>
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <LoadingMessage>
                                    레포트를 생성 중입니다...
                                </LoadingMessage>
                            </>
                        ) : selectedDateInfo ? (
                            <>
                                {renderDietSection()}
                                {renderExerciseSection()}
                            </>
                        ) : (
                            <>
                                <p>레포트가 존재하지 않습니다.</p>
                                <Button
                                    color='#3846ff'
                                    onClick={handleCreateReport}
                                >
                                    레포트 생성하기
                                </Button>
                                <Button color='#3846ff' onClick={closeOverlay}>
                                    닫기
                                </Button>
                            </>
                        )}
                    </OverlayContent>
                </Overlay>
            ) : (
                <>
                    <CalendarHeader>
                        <ArrowButton onClick={() => changeMonth(-1)}>
                            &lt;
                        </ArrowButton>
                        <MonthYear>
                            {format(currentDate, "yyyy년 M월")}
                        </MonthYear>
                        {!isSameMonth(new Date(), currentDate) && (
                            <ArrowButton onClick={() => changeMonth(1)}>
                                &gt;
                            </ArrowButton>
                        )}
                    </CalendarHeader>
                    {/* <LegendContainer>
                        <LegendItem color='#a1d9ff'>
                            <LegendDot color='#3846ff' />
                            <span>레포트</span>
                        </LegendItem>
                    </LegendContainer> */}
                    <CalendarGrid>
                        {weekDays.map((day) => (
                            <DayCell
                                key={day}
                                isWeekDay
                                style={{ color: "black" }}
                            >
                                {day}
                            </DayCell>
                        ))}
                        {monthDays.map((day, index) => {
                            const formattedDate = format(day, "yyyy-MM-dd");
                            const isCurrentMonth = isSameMonth(
                                day,
                                currentDate
                            );
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
                                        isSelected={isSameDay(
                                            day,
                                            selectedDate
                                        )}
                                    >
                                        {format(day, "d")}
                                    </DayNumber>
                                    <RecordDots>
                                        {dayRecords.report && (
                                            <Dot color='#3846ff' />
                                        )}
                                    </RecordDots>
                                </DayCell>
                            );
                        })}
                    </CalendarGrid>
                </>
            )}
            {showConfirmation && (
                <ConfirmationModal>
                    <ModalContent>
                        <p>
                            {isFilled
                                ? "레포트를 생성하시겠습니까?"
                                : "오늘 기록하지 않은 식단이 있습니다. 레포트를 받으시겠습니까? 레포트를 받으면 다시 수정할 수 없습니다."}
                        </p>
                        <ModalButton onClick={handleConfirmCreateReport}>
                            확인
                        </ModalButton>
                        <ModalButton onClick={() => setShowConfirmation(false)}>
                            취소
                        </ModalButton>
                    </ModalContent>
                </ConfirmationModal>
            )}
        </Container>
    );
}
