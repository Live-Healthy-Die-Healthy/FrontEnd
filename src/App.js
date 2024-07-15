import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, BrowserRouter } from "react-router-dom";
import axios from "axios";
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/LoginPage';
import MonthlyTraining from './pages/training/MonthlyTraining';
import Footer from './components/Footer';
import Header from './components/Header';
import DailyTraining from './pages/training/DailyTraining';
import RecordTraining from './pages/training/RecordTraining';
import SelectTraining from './pages/training/SelectTraining';
import Kakao from "./components/callback/Kakao";
import { UserContext } from "./context/LoginContext";
import ProfileSetting from './pages/Profilesetting';
import EditTrain from './pages/training/EditTrain';
import MonthlyDiet from './pages/diet/MonthlyDiet';
import DailyDiet from './pages/diet/DailyDiet';
import ReportPage from './pages/reports/ReportPage';
import DailyReportPage from './pages/reports/DailyReportPage';
import WeeklyReportPage from './pages/reports/WeeklyReportPage';
import MonthlyReportPage from './pages/reports/MonthlyReportPage';
import YearlyReportPage from './pages/reports/YearlyReportPage';
import SettingPage from './pages/settings/SettingPage';
import ProfilePage from './pages/settings/ProfilePage';

function AppContent() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loginType, setLoginType] = useState("");
  const [userId, setUserId] = useState("1234");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
          setAccessToken(null);
          localStorage.removeItem('accessToken');
          navigate('/'); // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const shouldShowHeaderFooter = !["/", "/auth/callback/kakao", "/profilesetting"].includes(location.pathname);

  return (
    <UserContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, loginType, setLoginType, userId, setUserId }}
    >
      {shouldShowHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/callback/kakao" element={<Kakao />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/trainmonth" element={<MonthlyTraining />} />
        <Route path="/traindaily/:date" element={<DailyTraining />} />
        <Route path="/selecttraining" element={<SelectTraining />} />
        <Route path="/recordtraining" element={<RecordTraining />} />
        <Route path="/profilesetting" element={<ProfileSetting />} />
        <Route path="/edittraining" element={<EditTrain />} />

        <Route path="/dietmonth" element={<MonthlyDiet />} />
        <Route path="/dietdaily/:date" element={<DailyDiet />} />

        <Route path="/report" element={<ReportPage />} />
        <Route path="/dailyreport" element={<DailyReportPage />} />
        <Route path="/weeklyreport" element={<WeeklyReportPage />} />
        <Route path="/monthlyreport" element={<MonthlyReportPage />} />
        <Route path="/yearlyreport" element={<YearlyReportPage />} />

        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
      {shouldShowHeaderFooter && <Footer />}
    </UserContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
