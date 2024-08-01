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

const Section = styled.div`
    margin-bottom: 20px;
    background: #f0f0f0;
    padding: 15px;
    border-radius: 10px;
`;

const SectionTitle = styled.h4`
    margin-top: 0;
    margin-bottom: 10px;
`;

const DailyCalories = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
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
    const [weekOptions, setWeekOptions] = useState([]);

    useEffect(() => {
        if (weeklyReport) {
            setIsValid(true);
        }
    }, [weeklyReport]);

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            updateWeekOptions();
        }
    }, [selectedYear, selectedMonth, highlightedDates]);

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

    const updateWeekOptions = () => {
        if (selectedYear && selectedMonth) {
            const newWeekOptions = getWeekOptions(
                selectedYear.value,
                selectedMonth.value
            );
            setWeekOptions(newWeekOptions);
        }
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
        setHighlightedDates([]);
        setWeekOptions([]);
    };

    const handleMonthChange = async (option) => {
        setSelectedMonth(option);
        setSelectedWeek(null);
        setAlertMessage("");
        setHighlightedDates([]);

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
            console.log("Fetched dates:", response.data.date);
        } catch (error) {
            console.error("Error fetching report dates:", error);
            setAlertMessage("날짜 정보를 가져오는데 실패했습니다.");
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
                    timeout: 120000,
                }
            );

            setWeeklyReport(response.data);
            setIsValid(true);

            // 새 레포트가 생성되었으므로 highlightedDates 업데이트
            const newHighlightedDates = [
                ...highlightedDates,
                format(startOfWeek, "yyyy-MM-dd"),
            ];
            setHighlightedDates(newHighlightedDates);
        } catch (error) {
            console.error("Error creating report:", error);
            setAlertMessage("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const yearOptions = getYearOptions();
    const monthOptions = selectedYear ? getMonthOptions() : [];

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}시간 ${mins}분`;
    };

    const renderWeeklyReport = () => {
        if (!weeklyReport) return null;

        const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
        const totalExerciseMinutes = weeklyReport.totalTraining;
        const avgExerciseMinutes = Math.round(totalExerciseMinutes / 7);

        return (
            <>
                <Section>
                    <SectionTitle>주간 식단 레포트</SectionTitle>
                    {weekDays.map((day, index) => (
                        <DailyCalories key={day}>
                            <span>{day}요일:</span>
                            <span>{weeklyReport.weeklyCal[index]} kcal</span>
                        </DailyCalories>
                    ))}
                    <DailyCalories>
                        <strong>평균 섭취 칼로리:</strong>
                        <strong>
                            {Math.round(weeklyReport.meanCalories)} kcal
                        </strong>
                    </DailyCalories>
                    <p>피드백: {weeklyReport.dietFeedback}</p>
                </Section>

                <Section>
                    <SectionTitle>주간 운동 레포트</SectionTitle>
                    <div>총 운동 시간: {formatTime(totalExerciseMinutes)}</div>
                    <div>
                        일 평균 운동 시간: {formatTime(avgExerciseMinutes)}
                    </div>
                    <div>
                        운동 비율:
                        <ul>
                            <li>
                                가슴:{" "}
                                {Math.round(weeklyReport.anaerobicRatio.chest)}%
                            </li>
                            <li>
                                팔:{" "}
                                {Math.round(weeklyReport.anaerobicRatio.arms)}%
                            </li>
                            <li>
                                복근:{" "}
                                {Math.round(weeklyReport.anaerobicRatio.core)}%
                            </li>
                            <li>
                                어깨:{" "}
                                {Math.round(
                                    weeklyReport.anaerobicRatio.shoulders
                                )}
                                %
                            </li>
                            <li>
                                등:{" "}
                                {Math.round(weeklyReport.anaerobicRatio.back)}%
                            </li>
                            <li>
                                하체:{" "}
                                {Math.round(weeklyReport.anaerobicRatio.legs)}%
                            </li>
                        </ul>
                    </div>
                    <p>피드백: {weeklyReport.exerciseFeedback}</p>
                </Section>
            </>
        );
    };

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
                            renderWeeklyReport()
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
