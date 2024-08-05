import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import {
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    isBefore,
    isAfter,
    isSameMonth,
} from "date-fns";
import { UserContext } from "../../context/LoginContext";

const ArrowButton = styled.button`
    background: none;
    border: none;
    font-size: 35px;
    font-weight: bold;
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
    font-size: 20px;
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

const Container = styled.div`
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
`;

const YearDisplay = styled.h2`
    color: #ff8000;
    font-size: 30px;
    margin: 0;
`;

const WeekList = styled.ul`
    list-style-type: none;
    padding: 0;
    width: 100%;
    max-width: 400px;
    padding-bottom: 20px;
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

const ReportContainer = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
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

const InfoContainer = styled.div`
    display: flex;
    justify-content: center;
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
    align-items: flex-start;
`;

const UserImage = styled.img`
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 20px 10px;
`;

const Title = styled.div`
    font-size: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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
    font-size: 20px;
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
    background-color: ${(props) => props.color};
`;

const DateContainer = styled.div`
    display: inline-block;
    background-color: #49406f;
    color: #ffffff;
    border-radius: 20px;
    width: 100px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

export default function MonthlyReportCalendar() {
    const { userId, accessToken } = useContext(UserContext);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [reportMonths, setReportMonths] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

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
                setUserImage(response.data.userImage);
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
            setUserImage(response.data.userImage);
            await fetchReportMonths(currentYear);
        } catch (error) {
            console.error("Error creating report:", error);
            alert("레포트 생성에 실패했습니다.");
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

    const renderMonthlyReport = () => {
        if (!monthlyReport) return null;

        const {
            meanCalories,
            totalExerciseTime,
            weightChangeRate,
            meanCarbo,
            meanProtein,
            meanFat,
            bodyFatChangeRate,
            muscleMassChangeRate,
            bmiChangeRate,
            dietFeedback,
            exerciseFeedback,
        } = monthlyReport;

        return (
            <ReportContainer>
                <ReportHeader>
                    <BackButton onClick={() => setSelectedMonth(null)}>
                        &lt;
                    </BackButton>
                    <h2>{format(selectedMonth, "yyyy년 M월")} 월간 레포트</h2>
                </ReportHeader>
                <Title>월간 요약</Title>
                <InfoContainer>
                    <InfoBubble>
                        <div>평균 일일 칼로리: {meanCalories}kcal</div>
                        <div>총 운동 시간: {totalExerciseTime}</div>
                        <div>체중 변화: {weightChangeRate}kg</div>
                    </InfoBubble>
                </InfoContainer>
                <Title>섭취 영양소</Title>
                <InfoContainer>
                    <InfoBubble>
                        <div>평균 일일 탄수화물: {meanCarbo}g</div>
                        <div>평균 일일 단백질: {meanProtein}g</div>
                        <div>평균 일일 지방: {meanFat}g</div>
                    </InfoBubble>
                </InfoContainer>
                <Title>체성분 변화</Title>
                <InfoContainer>
                    <InfoBubble>
                        <div>체중: {weightChangeRate}kg</div>
                        <div>체지방: {bodyFatChangeRate}%</div>
                        <div>골격근량: {muscleMassChangeRate}kg</div>
                        <div>BMI: {bmiChangeRate}kg/m²</div>
                    </InfoBubble>
                </InfoContainer>
                <Title>식단 피드백</Title>
                <MessageContainer>
                    <MessageBubble>{dietFeedback}</MessageBubble>
                </MessageContainer>
                <UserImage
                    src={`data:image/jpeg;base64,${userImage}`}
                    alt='User'
                />
                <Title>운동</Title>
                <InfoContainer>
                    <InfoBubble>
                        <div>총 운동 시간: {totalExerciseTime}</div>
                    </InfoBubble>
                </InfoContainer>
                <Title>운동 피드백</Title>
                <MessageContainer>
                    <MessageBubble>{exerciseFeedback}</MessageBubble>
                </MessageContainer>
                <UserImage
                    src={`data:image/jpeg;base64,${userImage}`}
                    alt='User'
                />
            </ReportContainer>
        );
    };

    const months = eachMonthOfInterval({
        start: startOfYear(new Date(currentYear, 0, 1)),
        end: endOfYear(new Date(currentYear, 0, 1)),
    });

    return (
        <Container>
            {selectedMonth ? (
                monthlyReport ? (
                    renderMonthlyReport()
                ) : (
                    <Overlay onClick={closeOverlay}>
                        <OverlayContent onClick={(e) => e.stopPropagation()}>
                            <DateContainer>
                                {format(selectedMonth, "yyyy년 M월")}
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
                                        color='#5ddebe'
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
                <>
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
                            const isDisabled =
                                isSameMonth(month, new Date()) ||
                                isAfter(month, new Date());
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
                </>
            )}
            {showConfirmation && (
                <ConfirmationModal>
                    <ModalContent>
                        <p>레포트를 생성하시겠습니까?</p>
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
