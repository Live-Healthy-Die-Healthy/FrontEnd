import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachWeekOfInterval,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    isSameMonth,
    isBefore,
} from "date-fns";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 100%;
    padding: 20px;
`;

const Header = styled.h2`
    color: #ff8000;
    font-size: 24px;
`;

const WeekList = styled.ul`
    list-style-type: none;
    padding: 0;
    width: 100%;
    max-width: 400px;
    padding-bottom: 20px;
`;

const WeekNumber = styled.h3`
    margin: 0 0 5px 0;
    color: #333;
`;

const DateRange = styled.p`
    margin: 0;
    color: #666;
    font-size: 14px;
`;

const MonthNavigation = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const NavButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #ff8000;
    cursor: pointer;
    &:disabled {
        color: #ccc;
        cursor: not-allowed;
    }
`;

const WeekItem = styled.li`
    background-color: ${(props) => (props.hasReport ? "#FFECB3" : "#fff")};
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${(props) =>
            props.hasReport ? "#FFE082" : "#f0f0f0"};
    }
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

export default function WeeklyReportList() {
    const { userId, accessToken } = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weeks, setWeeks] = useState([]);
    const [reportDates, setReportDates] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedWeekInfo, setSelectedWeekInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const fetchMonthReports = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/weeklyReportDate`,
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
            setReportDates(
                response.data.date.map((date) => date.split("T")[0])
            );
        } catch (error) {
            console.error("Error fetching month reports:", error);
        }
    };

    useEffect(() => {
        fetchMonthReports();
    }, [currentDate, userId, accessToken]);

    useEffect(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const weeksInMonth = eachWeekOfInterval(
            { start: monthStart, end: monthEnd },
            { weekStartsOn: 1 }
        );

        const formattedWeeks = weeksInMonth.map((week, index) => {
            const weekStart = startOfWeek(week, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
            return {
                weekNumber: index + 1,
                startDate: weekStart,
                endDate: weekEnd,
                dateRange: `${format(weekStart, "MM/dd")} ~ ${format(
                    weekEnd,
                    "MM/dd"
                )}`,
                hasReport: reportDates.includes(
                    format(weekStart, "yyyy-MM-dd")
                ),
            };
        });

        setWeeks(formattedWeeks);
    }, [currentDate, reportDates, selectedWeek]);

    const changeMonth = (increment) => {
        setCurrentDate((prevDate) =>
            increment ? addMonths(prevDate, 1) : subMonths(prevDate, 1)
        );
    };

    const handleWeekClick = async (week) => {
        if (
            isBefore(week.startDate, new Date()) ||
            isSameMonth(week.startDate, new Date())
        ) {
            setSelectedWeek(week);
            console.log("selectedWeek : ", selectedWeek);
            setIsLoading(true);
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_PORT}/report/weekly`,
                    {
                        userId,
                        date: format(week.startDate, "yyyy-MM-dd"),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log(" /report/weekly response : ", response);
                setSelectedWeekInfo(response.data.weeklyReport || null);
                setIsValid(response.data.isValid);
                setIsFilled(response.data.isFilled);
            } catch (error) {
                console.error("Error fetching week info:", error);
                setSelectedWeekInfo(null);
            } finally {
                setIsLoading(false);
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
                `${process.env.REACT_APP_API_PORT}/report/newWeekly`,
                {
                    userId,
                    date: format(selectedWeek.startDate, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000,
                }
            );
            console.log(" /report/newWeekly response : ", response);

            setIsValid(true);
            setIsFilled(true);
            setSelectedWeekInfo(response.data);
        } catch (error) {
            console.error("Error creating report:", error);
            alert("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeOverlay = () => {
        setSelectedWeek(null);
        fetchMonthReports();
    };

    const renderWeeklyReport = () => {
        if (!selectedWeekInfo) return null;

        const {
            weeklyCal,
            meanCalories,
            meanCarbo,
            meanProtein,
            meanFat,
            dietFeedback,
            totalTraining,
            aerobicRatio,
            anaerobicRatio,
            exerciseFeedback,
        } = selectedWeekInfo;

        const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

        return (
            <>
                <h3>주간 식단 레포트</h3>
                {weekDays.map((day, index) => (
                    <div key={day}>
                        <span>{day}요일: </span>
                        {weeklyCal && <span>{weeklyCal[index]} kcal</span>}
                    </div>
                ))}
                <div>평균 섭취 칼로리: {Math.round(meanCalories)} kcal</div>
                <div>평균 섭취 탄수화물: {Math.round(meanCarbo)} g</div>
                <div>평균 섭취 단백질: {Math.round(meanProtein)} g</div>
                <div>평균 섭취 지방: {Math.round(meanFat)} g</div>
                <p>피드백: {dietFeedback}</p>

                <h3>주간 운동 레포트</h3>
                <div>총 운동 시간: {totalTraining}분</div>
                <div>유산소 운동 비율: {Math.round(aerobicRatio)}%</div>
                <div>무산소 운동 비율:</div>
                {anaerobicRatio && (
                    <ul>
                        <li>가슴: {Math.round(anaerobicRatio.chest)}%</li>
                        <li>팔: {Math.round(anaerobicRatio.arm)}%</li>
                        <li>복근: {Math.round(anaerobicRatio.core)}%</li>
                        <li>어깨: {Math.round(anaerobicRatio.shoulder)}%</li>
                        <li>등: {Math.round(anaerobicRatio.back)}%</li>
                        <li>하체: {Math.round(anaerobicRatio.leg)}%</li>
                    </ul>
                )}
                <p>피드백: {exerciseFeedback}</p>

                <Button color='#3846ff' onClick={closeOverlay}>
                    확인
                </Button>
            </>
        );
    };

    return (
        <Container>
            <MonthNavigation>
                <NavButton onClick={() => changeMonth(false)}>&lt;</NavButton>
                <Header>{format(currentDate, "yyyy년 M월")} 주간 레포트</Header>
                <NavButton
                    onClick={() => changeMonth(true)}
                    disabled={
                        isSameMonth(new Date(), currentDate) ||
                        isBefore(new Date(), currentDate)
                    }
                >
                    &gt;
                </NavButton>
            </MonthNavigation>
            <WeekList>
                {weeks.map((week) => (
                    <WeekItem
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        hasReport={week.hasReport}
                    >
                        <WeekNumber>{week.weekNumber}주차</WeekNumber>
                        <DateRange>{week.dateRange}</DateRange>
                    </WeekItem>
                ))}
            </WeekList>
            {selectedWeek && (
                <Overlay onClick={closeOverlay}>
                    <OverlayContent onClick={(e) => e.stopPropagation()}>
                        <DateContainer>{selectedWeek.dateRange}</DateContainer>
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <LoadingMessage>
                                    레포트를 생성 중입니다...
                                </LoadingMessage>
                            </>
                        ) : selectedWeekInfo ? (
                            renderWeeklyReport()
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
            )}
            {showConfirmation && (
                <ConfirmationModal>
                    <ModalContent>
                        <p>
                            {isFilled
                                ? "레포트를 생성하시겠습니까?"
                                : "이번 주 기록하지 않은 날이 있습니다. 레포트를 받으시겠습니까? 레포트를 받으면 다시 수정할 수 없습니다."}
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
