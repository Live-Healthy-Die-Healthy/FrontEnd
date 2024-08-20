import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, BrowserRouter } from "react-router-dom";
import axios from "axios";
import { createGlobalStyle } from 'styled-components';

import HomePage from './pages/HomePage';
import LoginPage from './pages/login/LoginPage';

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
import DietDetail from './pages/diet/DietDetail';
import EditDiet from './pages/diet/EditDiet';
import SelectMenu from './pages/diet/SelectMenu';
import RecordDiet from './pages/diet/RecordDiet';
import AnalyzingPage from './pages/diet/AnalyzingPage';
import ConfirmDietPage from './pages/diet/ConfirmDietPage';

import ReportPage from './pages/reports/ReportPage';
import DailyReportPage from './pages/reports/DailyReportPage';
import WeeklyReportPage from './pages/reports/WeeklyReportPage';
import MonthlyReportPage from './pages/reports/MonthlyReportPage';
import YearlyReportPage from './pages/reports/YearlyReportPage';

import SettingPage from './pages/settings/SettingPage';
import ProfilePage from './pages/settings/ProfilePage';
import EditProfile from './pages/settings/EditProfile';

import FriendPage from './pages/friend/FriendPage';
import CompareFriendPage from './pages/friend/CompareFriendPage';

import styled from 'styled-components';
import ProtectedRoute from './pages/route/ProtectedRoute';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const ContentContainer = styled.div`
  /* padding-top: 30px; 
  padding-bottom: 30px;  */
`;

const AppContainer = styled.div`
  max-width: 100%;  // 변경
  width: 100%;  // 추가
  margin: 0 auto;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-height: 100vh;  // 추가
`;

function AppContent() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loginType, setLoginType] = useState("");
  const [userId, setUserId] = useState("1234");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
    setRefreshToken(localStorage.getItem('refreshToken'));
    setLoginType(localStorage.getItem('loginType'));
    setUserId(localStorage.getItem('userId'));
  }, []);


  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
          // 토큰 삭제 시 로컬 스토리지와 상태를 동시에 업데이트
          setAccessToken(null);
          setRefreshToken(null);
          setLoginType("");
          setUserId("");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('loginType');
          localStorage.removeItem('userId');
          navigate('/');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('loginType', loginType);
    localStorage.setItem('userId', userId);
  }, [accessToken, refreshToken, loginType, userId]);

  const shouldShowHeaderFooter = !["/", "/auth/callback/kakao", "/profilesetting"].includes(location.pathname);

  return (
    <UserContext.Provider
      value={{ 
        accessToken, 
        setAccessToken: (token) => {
          setAccessToken(token);
          token ? localStorage.setItem('accessToken', token) : localStorage.removeItem('accessToken');
        },
        refreshToken, 
        setRefreshToken: (token) => {
          setRefreshToken(token);
          token ? localStorage.setItem('refreshToken', token) : localStorage.removeItem('refreshToken');
        },
        loginType, 
        setLoginType: (type) => {
          setLoginType(type);
          type ? localStorage.setItem('loginType', type) : localStorage.removeItem('loginType');
        },
        userId, 
        setUserId: (id) => {
          setUserId(id);
          id ? localStorage.setItem('userId', id) : localStorage.removeItem('userId');
        }
      }}
    >
      <ContentContainer>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/callback/kakao" element={<Kakao />} />
          
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/profilesetting" element={<ProtectedRoute><ProfileSetting /></ProtectedRoute>} />
          <Route path="/traindaily/:date" element={<ProtectedRoute><DailyTraining /></ProtectedRoute>} />
          <Route path="/selecttraining" element={<ProtectedRoute><SelectTraining /></ProtectedRoute>} />
          <Route path="/recordtraining" element={<ProtectedRoute><RecordTraining /></ProtectedRoute>} />
          <Route path="/edittraining" element={<ProtectedRoute><EditTrain /></ProtectedRoute>} />

          <Route path="/dietmonth" element={<ProtectedRoute><MonthlyDiet /></ProtectedRoute>} />
          <Route path="/dietdaily/:date" element={<ProtectedRoute><DailyDiet /></ProtectedRoute>} />
          <Route path="/dietdetail/:formattedDate/:dietType" element={<ProtectedRoute><DietDetail /></ProtectedRoute>} />
          <Route path="/editdiet/:formattedDate/:dietType/:dietLogDetailId" element={<ProtectedRoute><EditDiet /></ProtectedRoute>} />
          <Route path="/selectmenu/:formattedDate/:dietType" element={<ProtectedRoute><SelectMenu /></ProtectedRoute>} />
          <Route path="/recorddiet/:dietType" element={<ProtectedRoute><RecordDiet /></ProtectedRoute>} />
          <Route path="/analyzing/:formattedDate/:dietType" element={<ProtectedRoute><AnalyzingPage /></ProtectedRoute>} />
          <Route path="/confirmDiet/:formattedDate/:dietType" element={<ProtectedRoute><ConfirmDietPage /></ProtectedRoute>} />

          <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/dailyreport" element={<ProtectedRoute><DailyReportPage /></ProtectedRoute>} />
          <Route path="/weeklyreport" element={<ProtectedRoute><WeeklyReportPage /></ProtectedRoute>} />
          <Route path="/monthlyreport" element={<ProtectedRoute><MonthlyReportPage /></ProtectedRoute>} />
          <Route path="/yearlyreport" element={<ProtectedRoute><YearlyReportPage /></ProtectedRoute>} />

          <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          
          <Route path="/friends" element={<ProtectedRoute><FriendPage /></ProtectedRoute>} />
          <Route path="/comparefriend/:formattedDate" element={<ProtectedRoute><CompareFriendPage /></ProtectedRoute>} />
        </Routes>
      </ContentContainer>
      {shouldShowHeaderFooter && <Footer />}
    </UserContext.Provider>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AppContent />
        </BrowserRouter>
      </AppContainer>
    </>
  );
}

export default App;