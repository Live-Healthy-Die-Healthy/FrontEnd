import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { format, isAfter, startOfDay, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

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

const Button = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DatePickerContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AlertMessage = styled.div`
    color: red;
    margin-bottom: 10px;
`;
const CreateReportButton = styled(Button)`
    margin-top: 20px;
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

const StyledDatePicker = styled(DatePicker)`
    .react-datepicker__day--highlighted {
        background-color: #007bff;
        color: white;
    }
`;

const BackButton = styled(Button)`
    margin-top: 20px;
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

const MealInfo = styled.div`
    margin-bottom: 10px;
`;

const ExerciseInfo = styled.div`
    margin-bottom: 10px;
`;

export default function DailyReportPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyReport, setDailyReport] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(true);
    const { accessToken, userId } = useContext(UserContext);

    useEffect(() => {
        fetchReportDates(selectedDate);
    }, [selectedDate]);

    const fetchReportDates = async (date) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/dailyReportDate`,
                {
                    userId: userId,
                    month: format(date, "yyyy-MM"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setHighlightedDates(
                response.data.date.map((date) => parseISO(date))
            );
        } catch (error) {
            console.error("Error fetching report dates:", error);
        }
    };

    const handleDateChange = async (date) => {
        const today = startOfDay(new Date());
        if (isAfter(date, today)) {
            setAlertMessage(
                "오늘 이후의 날짜는 선택할 수 없습니다. 다시 선택해주세요."
            );
            return;
        }

        setSelectedDate(date);
        setAlertMessage("");
        setIsLoading(true);
        setShowDatePicker(false);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_PORT}/report/daily`,
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

            if (response.data.isValid) {
                setDailyReport(response.data.dailyReport);
                setIsValid(true);
            } else {
                setDailyReport(null);
                setIsValid(false);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            setAlertMessage("레포트를 가져오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (date) => {
        fetchReportDates(date);
    };

    const handleBackClick = () => {
        setShowDatePicker(true);
        setDailyReport(null);
        setIsValid(false);
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
                    userId: userId,
                    date: format(selectedDate, "yyyy-MM-dd"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    timeout: 120000, // 2분 타임아웃 설정
                }
            );

            // 응답 데이터를 즉시 설정
            setDailyReport(response.data);
            setIsValid(true);
            setIsFilled(true); // 새로 생성된 레포트는 채워진 것으로 간주

            console.log("response.data : ", response.data);
            console.log("dailyReport : ", response.data);
        } catch (error) {
            console.error("Error creating report:", error);
            setAlertMessage("레포트 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderDietSection = () => {
        if (!dailyReport) return null;

        const {
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
        } = dailyReport;

        return (
            <Section>
                <SectionTitle>식단 정보</SectionTitle>
                <MealInfo>아침: {breakfastCal} kcal</MealInfo>
                <MealInfo>점심: {lunchCal} kcal</MealInfo>
                <MealInfo>저녁: {dinnerCal} kcal</MealInfo>
                <MealInfo>간식: {snackCal} kcal</MealInfo>
                <MealInfo>오늘 총 섭취 탄수화물: {totalCarbo} kcal</MealInfo>
                <MealInfo>오늘 총 섭취 단백질: {totalProtein} kcal</MealInfo>
                <MealInfo>오늘 총 섭취 지방: {totalFat} kcal</MealInfo>
                <MealInfo>오늘 총 섭취 칼로리: {totalCalories} kcal</MealInfo>
                <MealInfo>권장 섭취 칼로리: {recommendedCal} kcal</MealInfo>
                <p>피드백: {dietFeedback}</p>
            </Section>
        );
    };

    const renderExerciseSection = () => {
        if (!dailyReport) return null;

        const { aeroInfo, anAeroInfo, exerciseFeedback } = dailyReport;

        return (
            <Section>
                <SectionTitle>운동 정보</SectionTitle>
                <ExerciseInfo>
                    <strong>유산소 운동:</strong>
                    {aeroInfo.map((exercise, index) => (
                        <div key={index}>
                            {exercise.exerciseName}: {exercise.distance}km,{" "}
                            {exercise.exerciseTime}분
                        </div>
                    ))}
                </ExerciseInfo>
                <ExerciseInfo>
                    <strong>무산소 운동:</strong>
                    {anAeroInfo.map((exercise, index) => (
                        <div key={index}>
                            {exercise.exerciseName}: {exercise.weight}kg,{" "}
                            {exercise.repetitions}회
                        </div>
                    ))}
                </ExerciseInfo>
                <p>피드백: {exerciseFeedback}</p>
            </Section>
        );
    };

    return (
        <Container>
            <h3>일간 레포트 리스트 페이지</h3>
            {showDatePicker ? (
                <StyledDatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    onMonthChange={handleMonthChange}
                    maxDate={new Date()}
                    inline
                    highlightDates={highlightedDates}
                />
            ) : (
                <>
                    {alertMessage && (
                        <AlertMessage>{alertMessage}</AlertMessage>
                    )}
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <LoadingMessage>
                                레포트를 생성 중입니다...
                            </LoadingMessage>
                        </>
                    ) : (
                        <ReportList>
                            {isValid && dailyReport ? (
                                <>
                                    {renderDietSection()}
                                    {renderExerciseSection()}
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
                    )}
                    <BackButton onClick={handleBackClick}>뒤로가기</BackButton>
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
