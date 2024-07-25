import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachWeekOfInterval,
    endOfWeek,
    isBefore,
    startOfToday,
    parseISO,
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
    margin: 0 auto;
    text-align: left;
`;

const ReportItem = styled.div`
    padding: 10px;
    margin: 10px 0;
    background: #f0f0f0;
    border-radius: 10px;
`;

const SelectWrapper = styled.div`
    width: 200px;
    margin-bottom: 20px;
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

const WeeklyReportPage = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [startOfWeek, setStartOfWeek] = useState(null);
    const { userId, accessToken } = useContext(UserContext);
    const [weeklyReport, setWeeklyReport] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [highlightedDates, setHighlightedDates] = useState([]);

    useEffect(() => {
        if (weeklyReport) {
            setIsValid(true);
        }
    }, [weeklyReport]);

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        for (let i = currentYear - 7; i <= currentYear; i++) {
            yearOptions.push({ value: i, label: `${i}년` });
        }
        return yearOptions;
    };

    const getMonthOptions = () => {
        const monthOptions = [];
        for (let i = 0; i < 12; i++) {
            monthOptions.push({ value: i, label: `${i + 1}월` });
        }
        return monthOptions;
    };

    const getWeekOptions = (year, month) => {
        const startOfMonthDate = startOfMonth(new Date(year, month));
        const endOfMonthDate = endOfMonth(new Date(year, month));
        const weeksInMonth = eachWeekOfInterval(
            { start: startOfMonthDate, end: endOfMonthDate },
            { weekStartsOn: 1 }
        );
        const today = startOfToday();

        return weeksInMonth.map((startOfWeekDate, index) => {
            const endOfWeekDate = endOfWeek(startOfWeekDate, {
                weekStartsOn: 1,
            });
            const isHighlighted = highlightedDates.includes(
                format(startOfWeekDate, "yyyy-MM-dd")
            );
            return {
                value: index + 1,
                label: `${index + 1}주차 레포트${
                    isHighlighted ? " (작성됨)" : ""
                }`,
                start: startOfWeekDate,
                end: endOfWeekDate,
                isDisabled: !isBefore(endOfWeekDate, today),
                isHighlighted: isHighlighted,
            };
        });
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.data.isHighlighted
                ? "#e6f3ff"
                : provided.backgroundColor,
            color: state.isDisabled ? "#ccc" : "#333",
        }),
    };

    const handleYearChange = (option) => {
        setSelectedYear(option);
        setSelectedMonth(null);
        setSelectedWeek(null);
        setAlertMessage("");
    };

    const handleMonthChange = async (option) => {
        setSelectedMonth(option);
        setSelectedWeek(null);
        setAlertMessage("");

        // Fetch dates for the selected month
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/weeklyReportDate`,
                {
                    userId: userId,
                    month: `${selectedYear.value}-${String(
                        option.value + 1
                    ).padStart(2, "0")}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setHighlightedDates(response.data.date);
        } catch (error) {
            console.error("Error fetching report dates:", error);
        }
    };

    const handleWeekChange = async (option) => {
        if (option.isDisabled) {
            setAlertMessage("미래의 주차는 선택할 수 없습니다.");
            return;
        }

        setSelectedWeek(option);
        setStartOfWeek(format(option.start, "yyyy-MM-dd"));
        setAlertMessage("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/weekly`,
                {
                    userId: userId,
                    date: format(option.start, "yyyy-MM-dd"),
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
                setWeeklyReport(response.data.weeklyReport);
            } else {
                setWeeklyReport(null);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            setAlertMessage("레포트를 가져오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
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
                    userId: userId,
                    date: format(startOfWeek, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000, // 2분 타임아웃 설정
                }
            );

            setWeeklyReport(response.data);
            setIsValid(true);
        } catch (error) {
            console.error("Error creating report:", error);
            setAlertMessage("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const yearOptions = getYearOptions();
    const monthOptions = selectedYear ? getMonthOptions() : [];
    const weekOptions =
        selectedYear && selectedMonth
            ? getWeekOptions(selectedYear.value, selectedMonth.value)
            : [];

    return (
        <Container>
            <h3>주간 레포트 리스트 페이지</h3>
            {alertMessage && <AlertMessage>{alertMessage}</AlertMessage>}
            <SelectWrapper>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    options={yearOptions}
                    placeholder='년 선택'
                />
            </SelectWrapper>
            <SelectWrapper>
                <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    placeholder='월 선택'
                    isDisabled={!selectedYear}
                />
            </SelectWrapper>
            <SelectWrapper>
                <Select
                    value={selectedWeek}
                    onChange={handleWeekChange}
                    options={weekOptions}
                    placeholder='주차 선택'
                    isDisabled={!selectedMonth}
                    isOptionDisabled={(option) => option.isDisabled}
                    styles={customStyles}
                />
            </SelectWrapper>
            {isLoading ? (
                <>
                    <LoadingSpinner />
                    <LoadingMessage>레포트를 생성 중입니다...</LoadingMessage>
                </>
            ) : (
                selectedWeek && (
                    <ReportList>
                        {isValid ? (
                            <>
                                <ReportItem>
                                    meanCalories : {weeklyReport.meanCalories}
                                </ReportItem>
                                <ReportItem>
                                    meanExercise : {weeklyReport.meanExercise}
                                </ReportItem>
                                <ReportItem>
                                    dietFeedback : {weeklyReport.dietFeedback}
                                </ReportItem>
                                <ReportItem>
                                    execiseFeedback :{" "}
                                    {weeklyReport.exerciseFeedback}
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
};

export default WeeklyReportPage;
