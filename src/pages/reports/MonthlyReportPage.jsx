import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    format,
    startOfMonth,
    endOfMonth,
    isBefore,
    isAfter,
    startOfToday,
    getYear,
    getMonth,
} from "date-fns";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

const ReportList = styled.div`
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    width: 80%;
    max-width: 600px;
    margin: 20px auto;
    text-align: left;
`;

const ReportItem = styled.div`
    padding: 10px;
    margin: 10px 0;
    background: #f0f0f0;
    border-radius: 10px;
`;

const AlertMessage = styled.div`
    color: red;
    margin-bottom: 10px;
`;

const Button = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
`;

const CreateReportButton = styled(Button)`
    margin-top: 20px;
`;

const LoadingMessage = styled.div`
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
`;

const ConfirmationModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
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

const StyledCalendar = styled(Calendar)`
    width: 350px;
    max-width: 100%;
    background: white;
    border: 1px solid #a0a096;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;

    .react-calendar__navigation button {
        min-width: 44px;
        background: none;
    }

    .react-calendar__month-view__days__day--weekend {
        color: #d10000;
    }

    .react-calendar__tile--now {
        background: #ffff76;
    }

    .react-calendar__tile--active {
        background: #006edc;
        color: white;
    }

    .react-calendar__tile--hasActive {
        background: #76baff;
    }

    .react-calendar__tile--highlighted {
        background: #e6f3ff;
    }

    .react-calendar__tile:disabled {
        background-color: #f0f0f0;
        color: #ccc;
    }
`;

const MonthlyReportPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { userId, accessToken } = useContext(UserContext);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [highlightedMonths, setHighlightedMonths] = useState([]);

    useEffect(() => {
        fetchHighlightedMonths(getYear(selectedDate));
    }, [selectedDate]);

    const fetchHighlightedMonths = async (year) => {
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
            setHighlightedMonths(
                response.data.dates.map((date) => date.slice(0, 7))
            );
        } catch (error) {
            console.error("Error fetching report dates:", error);
        }
    };

    const handleMonthChange = async (date) => {
        setSelectedDate(date);
        setAlertMessage("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/monthly`,
                {
                    userId: userId,
                    date: format(date, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setIsValid(response.data.isValid);
            setIsFilled(response.data.isFilled);
            if (response.data.isValid) {
                setMonthlyReport(response.data.monthlyReport);
            } else {
                setMonthlyReport(null);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            setAlertMessage("레포트를 가져오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const tileDisabled = ({ date, view }) => {
        if (view === "year") {
            return isAfter(startOfMonth(date), startOfToday());
        }
        return false;
    };

    const tileClassName = ({ date, view }) => {
        if (view === "year") {
            const monthString = format(date, "yyyy-MM");
            return highlightedMonths.includes(monthString)
                ? "react-calendar__tile--highlighted"
                : null;
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
                `${process.env.REACT_APP_API_PORT}/report/newMonthly`,
                {
                    userId: userId,
                    date: format(selectedDate, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000,
                }
            );

            setMonthlyReport(response.data);
            setIsValid(true);
        } catch (error) {
            console.error("Error creating report:", error);
            setAlertMessage("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleYearChange = ({ activeStartDate }) => {
        fetchHighlightedMonths(getYear(activeStartDate));
    };

    return (
        <Container>
            <h3>월간 레포트 리스트 페이지</h3>
            {alertMessage && <AlertMessage>{alertMessage}</AlertMessage>}
            <StyledCalendar
                onChange={handleMonthChange}
                value={selectedDate}
                maxDetail='year'
                minDetail='year'
                maxDate={startOfToday()}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                onActiveStartDateChange={handleYearChange}
            />
            {isLoading ? (
                <>
                    <LoadingSpinner />
                    <LoadingMessage>레포트를 생성 중입니다...</LoadingMessage>
                </>
            ) : (
                monthlyReport && (
                    <ReportList>
                        {isValid ? (
                            <>
                                <ReportItem>
                                    meanCalories : {monthlyReport.meanCalories}
                                </ReportItem>
                                <ReportItem>
                                    meanTraning : {monthlyReport.meanTraining}
                                </ReportItem>
                                <ReportItem>
                                    dietFeedback : {monthlyReport.dietFeedback}
                                </ReportItem>
                                <ReportItem>
                                    execiseFeedback :{" "}
                                    {monthlyReport.exerciseFeedback}
                                </ReportItem>
                            </>
                        ) : (
                            <>
                                <ReportItem>
                                    <div>레포트가 존재하지 않습니다.</div>
                                </ReportItem>
                                <CreateReportButton
                                    onClick={handleCreateReport}
                                >
                                    레포트 생성하기
                                </CreateReportButton>
                            </>
                        )}
                    </ReportList>
                )
            )}
            {showConfirmation && (
                <ConfirmationModal>
                    <ModalContent>
                        <p>
                            {isFilled
                                ? "레포트를 생성하시겠습니까?"
                                : "이번 달 기록하지 않은 날이 있습니다. 레포트를 받으시겠습니까? 레포트를 받으면 다시 수정할 수 없습니다."}
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
};

export default MonthlyReportPage;
