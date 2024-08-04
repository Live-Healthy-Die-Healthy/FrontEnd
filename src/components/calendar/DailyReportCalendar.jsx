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
    padding-bottom: 30px;
`;

const CalendarContainer = styled.div`
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
`;

const MonthYear = styled.h2`
    color: #ff8000;
    font-size: 30px;
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 35px;
    color: ${(props) => (props.disabled ? "#ccc" : "#ff8000")};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
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
`;

const OverlayContent = styled.div`
    background-color: #ffeeae;
    padding: 20px;
    font-size: 20px;
    border-radius: 10px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
`;

const Button = styled.button`
    margin-top: 10px;
    font-size: 20px;
    margin: 0px 10px;
    padding: 10px 20px;
    background-color: ${(props) => props.color};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const LegendContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    align-self: flex-start;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 20px;
    border-radius: 30px;
    padding: 5px;
    background-color: ${(props) => props.color};
    flex-wrap: nowrap; /* 한 줄로 강제 */
`;

const LegendDot = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin-right: 5px;
`;

const LegendText = styled.span`
    white-space: nowrap; /* 텍스트를 한 줄로 표시 */
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
    font-size: 20px;
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
    font-size: 20px;
`;

const ModalButton = styled(Button)`
    margin: 10px;
    background-color: ${(props) => props.color};
`;
const ReportContainer = styled.div`
    background-color: #ffffff;
    font-size: 22px;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
`;

const ReportHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
`;

const MessageContainer = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const MessageBubble = styled.div`
    background-color: #ffeeae;
    border-radius: 30px;
    padding: 10px 15px;
    margin: 10px 0;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 30px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: #ffeeae;
        border-bottom: 0;
        border-left: 0;
        margin-left: -5px;
        margin-bottom: -10px;
    }
`;

const InfoBubble = styled.div`
    background-color: rgb(150, 206, 179, 0.3);
    border-radius: 20px;
    padding: 10px 15px;
    margin: 10px 0;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 요소들을 왼쪽에 정렬 */
`;

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
`;

const UserImage = styled.img`
    display: flex;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 20px 10px;
`;

const Title = styled.div`
    font-size: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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
    const [userImage, setUserImage] = useState(null);
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
    }, [currentDate, userId, accessToken, selectedDate]);

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
                setSelectedDateInfo(response.data.dailyReport || null);
                setIsValid(response.data.isValid);
                setIsFilled(response.data.isFilled);
                setUserImage(response.data.userImage);
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
            setUserImage(response.data.userImage);
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
            if (increment > 0 && newDate > new Date()) {
                return prevDate; // 미래의 달로 이동하려고 하면 현재 달을 유지
            }
            return newDate;
        });
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({
        start: subDays(monthStart, monthStart.getDay()),
        end: addDays(monthEnd, 6 - monthEnd.getDay()),
    });

    const closeOverlay = () => {
        setSelectedDate(null);
        fetchMonthRecords();
    };

    const renderReportContent = () => {
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
            aeroInfo,
            anAeroInfo,
            exerciseFeedback,
        } = selectedDateInfo;

        return (
            <ReportContainer>
                <ReportHeader>
                    <BackButton onClick={() => setSelectedDate(null)}>
                        &lt;
                    </BackButton>
                    <h2>{format(selectedDate, "yyyy.MM.dd")} 레포트</h2>
                </ReportHeader>
                <Title>식단 정보</Title>
                <InfoContainer>
                    <InfoBubble>
                        <div>오늘 먹은 아침: {breakfastLog.join(", ")}</div>
                        <div>
                            <br />
                            오늘 먹은 점심: {lunchLog.join(", ")}
                        </div>
                        <div>
                            <br />
                            오늘 먹은 저녁: {dinnerLog.join(", ")}
                        </div>
                        <div>
                            <br />
                            오늘 먹은 간식: {snackLog.join(", ")}
                        </div>
                        <br />
                        <div>아침: 총 {breakfastCal}kcal</div>
                        <br />
                        <div>점심: 총 {lunchCal}kcal</div>
                        <br />
                        <div>저녁: 총 {dinnerCal}kcal</div>
                        <br />
                        <div>간식: 총 {snackCal}kcal</div>
                        <br />
                        ----------------------
                        <br />
                        <div>
                            오늘 총 섭취 탄수화물: {totalCarbo}g<br />
                        </div>
                        <div>
                            오늘 총 섭취 단백질: {totalProtein}g<br />
                        </div>
                        <div>오늘 총 섭취 지방: {totalFat}g</div>
                        <div>오늘 총 섭취 칼로리: {totalCalories}kcal </div>
                        <br />
                        <div>권장 섭취 칼로리: {recommendedCal}kcal</div>
                    </InfoBubble>
                </InfoContainer>
                <Title>식단 피드백</Title>
                <MessageContainer>
                    <MessageBubble isUser>{dietFeedback}</MessageBubble>
                </MessageContainer>
                <UserImage
                    src={`data:image/jpeg;base64,${userImage}`}
                    alt='User'
                />
                <Title>운동 정보</Title>
                <InfoContainer>
                    <InfoBubble>
                        <h5>유산소 운동</h5>
                        {aeroInfo && aeroInfo.length > 0 ? (
                            aeroInfo.map((exercise, index) => (
                                <div key={index}>
                                    {exercise.exerciseName}: {exercise.distance}
                                    km, {exercise.exerciseTime}분
                                </div>
                            ))
                        ) : (
                            <div>유산소 운동 정보가 없습니다!</div>
                        )}
                        <br />
                        <h5>무산소 운동</h5>
                        {anAeroInfo && anAeroInfo.length > 0 ? (
                            anAeroInfo.map((exercise, index) => (
                                <div key={index}>
                                    {exercise.exerciseName}: {exercise.weight}
                                    kg, {exercise.repetitions}회
                                </div>
                            ))
                        ) : (
                            <div>무산소 운동 정보가 없습니다!</div>
                        )}
                    </InfoBubble>
                </InfoContainer>
                <Title>운동 피드백</Title>
                <MessageContainer>
                    <MessageBubble isUser>{exerciseFeedback}</MessageBubble>
                </MessageContainer>
                <UserImage
                    src={`data:image/jpeg;base64,${userImage}`}
                    alt='User'
                />
            </ReportContainer>
        );
    };

    return (
        <Container>
            {selectedDate ? (
                selectedDateInfo ? (
                    renderReportContent()
                ) : (
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
                            ) : (
                                <>
                                    <p>레포트가 존재하지 않습니다.</p>
                                    <Button
                                        color='#FF8000'
                                        onClick={handleCreateReport}
                                    >
                                        레포트 생성하기
                                    </Button>
                                    <Button
                                        color='#5DDEBE'
                                        onClick={closeOverlay}
                                    >
                                        닫기
                                    </Button>
                                </>
                            )}
                        </OverlayContent>
                    </Overlay>
                )
            ) : (
                <CalendarContainer>
                    <CalendarHeader>
                        <ArrowButton onClick={() => changeMonth(-1)}>
                            &lt;
                        </ArrowButton>
                        <MonthYear>
                            {format(currentDate, "yyyy년 M월")}
                        </MonthYear>
                        <ArrowButton
                            onClick={() => changeMonth(1)}
                            disabled={isSameMonth(new Date(), currentDate)}
                        >
                            &gt;
                        </ArrowButton>
                    </CalendarHeader>
                    <LegendContainer>
                        <LegendItem color='#a1d9ff'>
                            <span>레포트가 있는날은&nbsp;&nbsp;</span>
                            <LegendDot color='#535bcf' />
                            <span>으로 표시돼요 !</span>
                        </LegendItem>
                    </LegendContainer>
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
                                            <Dot color='#535bcf' />
                                        )}
                                    </RecordDots>
                                </DayCell>
                            );
                        })}
                    </CalendarGrid>
                </CalendarContainer>
            )}
            {showConfirmation && (
                <ConfirmationModal>
                    <ModalContent>
                        <p>
                            {isFilled
                                ? "레포트를 생성하시겠습니까?"
                                : "오늘 기록하지 않은 식단이 있습니다. 레포트를 받으시겠습니까? 레포트를 받으면 다시 수정할 수 없습니다."}
                        </p>
                        <ModalButton
                            color='#4799e6'
                            onClick={handleConfirmCreateReport}
                        >
                            확인
                        </ModalButton>
                        <ModalButton
                            color='#f36ca5'
                            onClick={() => setShowConfirmation(false)}
                        >
                            취소
                        </ModalButton>
                    </ModalContent>
                </ConfirmationModal>
            )}
        </Container>
    );
}
