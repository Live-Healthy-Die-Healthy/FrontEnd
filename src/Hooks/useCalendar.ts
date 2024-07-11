// import { getDaysInMonth, subMonths } from 'date-fns';
// import React from 'react';

// const DATE_MONTH_FIXER = 1;
// const CALENDER_LENGTH = 35;
// const DEFAULT_TRASH_VALUE = 0;
// const DAY_OF_WEEK = 7;
// const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'];

// const useCalendar = () => {
//   const [currentDate, setCurrentDate] = React.useState(new Date());
//   const totalMonthDays = getDaysInMonth(currentDate);

//   const prevDayList = Array.from({
//     length: Math.max(0, currentDate.getDay() - 1),
//   }).map(() => DEFAULT_TRASH_VALUE);
//   const currentDayList = Array.from({ length: totalMonthDays }).map(
//     (_, i) => i + 1,
//   );
//   const nextDayList = Array.from({
//     length: CALENDER_LENGTH - currentDayList.length - prevDayList.length,
//   }).map(() => DEFAULT_TRASH_VALUE);

//   const currentCalendarList = prevDayList.concat(currentDayList, nextDayList);
//   const weekCalendarList = currentCalendarList.reduce(
//     (acc: number[][], cur, idx) => {
//       const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
//       if (!acc[chunkIndex]) {
//         acc[chunkIndex] = [];
//       }
//       acc[chunkIndex].push(cur);
//       return acc;
//     },
//     [],
//   );
//   return {
//     weekCalendarList: weekCalendarList,
//     currentDate: currentDate,
//     setCurrentDate: setCurrentDate,
//   };
// };
// export default useCalendar;