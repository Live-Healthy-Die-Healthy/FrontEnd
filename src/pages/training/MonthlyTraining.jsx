// import React, { useState, useEffect, useContext } from "react";
// import styled from "styled-components";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { format, startOfToday } from "date-fns";
// import { UserContext } from "../../context/LoginContext";

// const Container = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     height: 100vh;
//     text-align: center;
//     background-color: #f0f0f0;
//     padding: 20px;
// `;

// const StyledCalendarWrapper = styled.div`
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     position: relative;
//     margin-top: 20px;

//     @media (max-width: 768px) {
//         width: 100%;
//         padding: 0 10px;
//     }
// `;

// const StyledCalendar = styled(Calendar)`
//     width: 100%;
//     height: 90vh;

//     border: none;

//     .react-calendar__tile {
//         height: calc(80vh / 6);
//         max-width: none;
//     }

//     .react-calendar__tile--now {
//         background: #fffae6;
//     }

//     .react-calendar__tile--active {
//         background: #a3d2ca;
//     }

//     @media (max-width: 768px) {
//         .react-calendar__tile {
//             height: calc(90vh / 6);
//         }
//     }

//     .react-calendar__tile--disabled {
//         background-color: #f0f0f0;
//         color: #ccc;
//     }
// `;

// export default function MonthlyTraining() {
//     const today = startOfToday();
//     const [date, setDate] = useState(today);
//     const formattedDate = format(new Date(date), "yyyy-MM-dd");
//     const [records, setRecords] = useState({});
//     const { accessToken, userId } = useContext(UserContext);
//     const navigate = useNavigate();

//     const fetchRecords = async (date) => {
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_PORT}/exerciseCalendar`,
//                 { userId, date }
//             );
//             const data = response.data.reduce((acc, record) => {
//                 const formattedDate = record.exerciseDate.split("T")[0];
//                 if (!acc[formattedDate]) acc[formattedDate] = [];
//                 const exerciseDetail =
//                     record.exerciseType === "AerobicExercise"
//                         ? `${record.exerciseName} - ${record.distance}km`
//                         : `${record.exerciseName} - ${record.set}세트`;
//                 acc[formattedDate].push(exerciseDetail);
//                 return acc;
//             }, {});
//             setRecords(data);
//         } catch (error) {
//             console.error("Error fetching records:", error);
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         fetchRecords(formattedDate);
//     }, [formattedDate]);

//     const handleDateChange = (selectedDate) => {
//         if (selectedDate <= today) {
//             setDate(selectedDate);
//             navigate(`/traindaily/${format(selectedDate, "yyyy-MM-dd")}`, {
//                 state: { date: selectedDate },
//             });
//         }
//     };
//     const handleActiveMonthChange = ({ activeStartDate }) => {
//         const newMonth = activeStartDate.getMonth() + 1;
//         const newDate = new Date(
//             activeStartDate.getFullYear(),
//             newMonth - 1,
//             1
//         );
//         setDate(newDate); // 업데이트된 달의 첫 번째 날로 설정
//         fetchRecords(format(newDate, "yyyy-MM-dd")); // 새 날짜에 대한 기록을 가져옴
//     };

//     const tileContent = ({ date, view }) => {
//         const formattedDate = format(date, "yyyy-MM-dd");
//         if (records[formattedDate]) {
//             return (
//                 <div
//                     style={{
//                         marginTop: "1px",
//                         fontSize: "12px",
//                         color: "#1179db",
//                     }}
//                 >
//                     {records[formattedDate].map((exercise, index) => (
//                         <div key={index}>{exercise}</div>
//                     ))}
//                 </div>
//             );
//         }
//         return null;
//     };

//     const tileDisabled = ({ date }) => {
//         return date > today;
//     };

//     return (
//         <Container>
//             <h1>월간 운동</h1>
//             <StyledCalendarWrapper>
//                 <StyledCalendar
//                     value={date}
//                     onChange={handleDateChange}
//                     onActiveStartDateChange={handleActiveMonthChange}
//                     calendarType='gregory'
//                     showNeighboringMonth={false}
//                     next2Label={null}
//                     prev2Label={null}
//                     minDetail='year'
//                     tileContent={tileContent}
//                     tileDisabled={tileDisabled}
//                     maxDate={today}
//                 />
//             </StyledCalendarWrapper>
//         </Container>
//     );
// }
