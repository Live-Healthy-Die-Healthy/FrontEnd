import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import {
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    isSameMonth,
    isBefore,
    isAfter,
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

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
`;

const YearDisplay = styled.h2`
    color: #ff8000;
    font-size: 24px;
`;

const ArrowButton = styled.button`
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

const MonthGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 400px;
`;

const MonthCell = styled.div`
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.hasReport ? "#FFECB3" : "white")};
    border: 1px solid #ddd;
    cursor: pointer;
    font-size: 16px;
    ${(props) =>
        props.isDisabled
            ? `
        color: #ccc;
        cursor: not-allowed;
    `
            : `
        &:hover {
            background-color: ${props.hasReport ? "#FFE082" : "#f0f0f0"};
        }
    `}
`;

const ReportList = styled.div`
    margin-top: 20px;
    width: 100%;
    max-width: 400px;
`;

const ReportItem = styled.div`
    padding: 10px;
    margin: 10px 0;
    background: #f0f0f0;
    border-radius: 10px;
`;

const Button = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
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

const CloseButton = styled(Button)`
    background-color: #ff4136;
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

const ItemTitle = styled.div`
    font-size: 20px;
    margin-bottom: 10px;
`;

const FeedbackContainer = styled.div`
    background-color: #ffe873;
    padding: 10px;
`;

export default function MonthlyReportCalendar() {
    const { userId, accessToken } = useContext(UserContext);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [reportMonths, setReportMonths] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        fetchReportMonths(currentYear);
    }, [currentYear, userId, accessToken]);

    const fetchReportMonths = async (year) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/monthlyReportDate`,
                {
                    userId: userId,
                    year: year.toString(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setReportMonths(
                response.data.dates.map((date) => date.slice(0, 7))
            );
        } catch (error) {
            console.error("Error fetching report dates:", error);
        }
    };

    const handleYearChange = (increment) => {
        setCurrentYear((prevYear) => (increment ? prevYear + 1 : prevYear - 1));
        setSelectedMonth(null);
        setMonthlyReport(null);
    };

    const handleMonthClick = async (month) => {
        setSelectedMonth(month);
        setIsLoading(true);
        setShowOverlay(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/monthly`,
                {
                    userId: userId,
                    date: format(month, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.isValid) {
                setMonthlyReport(response.data.monthlyReport);
            } else {
                setMonthlyReport(null);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            setMonthlyReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const months = eachMonthOfInterval({
        start: startOfYear(new Date(currentYear, 0, 1)),
        end: endOfYear(new Date(currentYear, 0, 1)),
    });

    const handleConfirmCreateReport = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/newMonthly`,
                {
                    userId: userId,
                    date: format(selectedMonth, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000,
                }
            );

            setMonthlyReport(response.data);
            // 레포트 생성 후 즉시 reportMonths 업데이트
            await fetchReportMonths(currentYear);
        } catch (error) {
            console.error("Error creating report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeOverlay = async () => {
        setShowOverlay(false);
        setSelectedMonth(null);
        setMonthlyReport(null);
        await fetchReportMonths(currentYear);
    };

    return (
        <Container>
            <Header>
                <ArrowButton
                    onClick={() => handleYearChange(false)}
                    disabled={currentYear <= 2020}
                >
                    &lt;
                </ArrowButton>
                <YearDisplay>{currentYear}년</YearDisplay>
                <ArrowButton
                    onClick={() => handleYearChange(true)}
                    disabled={isBefore(
                        new Date(),
                        startOfYear(new Date(currentYear + 1, 0, 1))
                    )}
                >
                    &gt;
                </ArrowButton>
            </Header>
            <MonthGrid>
                {months.map((month) => {
                    const isDisabled = isAfter(month, new Date());
                    return (
                        <MonthCell
                            key={month.getTime()}
                            onClick={() =>
                                !isDisabled && handleMonthClick(month)
                            }
                            hasReport={reportMonths.includes(
                                format(month, "yyyy-MM")
                            )}
                            isDisabled={isDisabled}
                        >
                            {format(month, "M")}월
                        </MonthCell>
                    );
                })}
            </MonthGrid>
            {showOverlay && (
                <Overlay onClick={closeOverlay}>
                    <OverlayContent onClick={(e) => e.stopPropagation()}>
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <LoadingMessage>
                                    레포트를 생성 중입니다...
                                </LoadingMessage>
                            </>
                        ) : (
                            selectedMonth && (
                                <>
                                    <h3>
                                        {format(selectedMonth, "yyyy년 M월")}{" "}
                                        레포트
                                    </h3>
                                    {monthlyReport ? (
                                        <>
                                            <ReportItem>
                                                <ItemTitle>월간 요약</ItemTitle>
                                                <div>
                                                    평균 일일 칼로리:{" "}
                                                    {monthlyReport.meanCalories}
                                                    kcal
                                                </div>
                                                <div>
                                                    총 운동 시간:{" "}
                                                    {
                                                        monthlyReport.totalExerciseTime
                                                    }
                                                </div>
                                                <div>
                                                    체중 변화:{" "}
                                                    {
                                                        monthlyReport.weightChangeRate
                                                    }
                                                    kg
                                                </div>
                                            </ReportItem>
                                            <ReportItem>
                                                <ItemTitle>
                                                    섭취 영양소
                                                </ItemTitle>
                                                <div>
                                                    평균 일일 탄수화물:{" "}
                                                    {monthlyReport.meanCarbo}g
                                                </div>
                                                <div>
                                                    평균 일일 단백질:{" "}
                                                    {monthlyReport.meanProtein}g
                                                </div>
                                                <div>
                                                    평균 일일 지방:{" "}
                                                    {monthlyReport.meanFat}g
                                                </div>

                                                <ItemTitle>
                                                    체성분 변화
                                                </ItemTitle>

                                                <div>
                                                    체중:{" "}
                                                    {
                                                        monthlyReport.weightChangeRate
                                                    }
                                                    g
                                                </div>
                                                <div>
                                                    체지방:{" "}
                                                    {
                                                        monthlyReport.bodyFatChangeRate
                                                    }
                                                    g
                                                </div>
                                                <div>
                                                    근육량:{" "}
                                                    {
                                                        monthlyReport.muscleMassChangeRate
                                                    }
                                                    g
                                                </div>
                                                <div>
                                                    BMI:{" "}
                                                    {
                                                        monthlyReport.bmiChangeRate
                                                    }
                                                    g
                                                </div>

                                                <FeedbackContainer>
                                                    식단 피드백:{" "}
                                                    {monthlyReport.dietFeedback}
                                                </FeedbackContainer>
                                            </ReportItem>
                                            <ReportItem>
                                                <ItemTitle>운동</ItemTitle>
                                                <div>
                                                    총 운동 시간:{" "}
                                                    {
                                                        monthlyReport.totalExerciseTime
                                                    }
                                                </div>
                                                <FeedbackContainer>
                                                    운동 피드백:{" "}
                                                    {
                                                        monthlyReport.exerciseFeedback
                                                    }
                                                </FeedbackContainer>
                                            </ReportItem>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                레포트가 존재하지 않습니다.
                                            </div>
                                            <Button
                                                onClick={
                                                    handleConfirmCreateReport
                                                }
                                            >
                                                레포트 생성하기
                                            </Button>
                                        </>
                                    )}
                                    <CloseButton onClick={closeOverlay}>
                                        닫기
                                    </CloseButton>
                                </>
                            )
                        )}
                    </OverlayContent>
                </Overlay>
            )}
        </Container>
    );
}
