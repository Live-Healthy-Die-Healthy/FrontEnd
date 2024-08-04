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
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loginType, setLoginType] = useState(localStorage.getItem('loginType'));
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
  setRefreshToken(null);
  setLoginType("");
  setUserId("");
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('loginType');
  localStorage.removeItem('userId');
          navigate('/'); // 로그인 페이지로 리다이렉트
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
          localStorage.setItem('accessToken', token);
        },
        refreshToken, 
        setRefreshToken: (token) => {
          setRefreshToken(token);
          localStorage.setItem('refreshToken', token);
        },
        loginType, 
        setLoginType: (type) => {
          setLoginType(type);
          localStorage.setItem('loginType', type);
        },
        userId, 
        setUserId: (id) => {
          setUserId(id);
          localStorage.setItem('userId', id);
        }
      }}
    >
      <ContentContainer>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/callback/kakao" element={<Kakao />} />
          
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profilesetting" element={<ProfileSetting />} />
                  <Route path="/traindaily/:date" element={<DailyTraining />} />
                  <Route path="/selecttraining" element={<SelectTraining />} />
                  <Route path="/recordtraining" element={<RecordTraining />} />
                  <Route path="/edittraining" element={<EditTrain />} />

                  <Route path="/dietmonth" element={<MonthlyDiet />} />
                  <Route path="/dietdaily/:date" element={<DailyDiet />} />
                  <Route path="/dietdetail/:formattedDate/:dietType" element={<DietDetail />} />
                  <Route path="/editdiet/:formattedDate/:dietType/:dietLogDetailId" element={<EditDiet />} />
                  <Route path="/selectmenu/:formattedDate/:dietType" element={<SelectMenu />} />
                  <Route path="/recorddiet/:dietType" element={<RecordDiet />} />
                  <Route path="/analyzing/:formattedDate/:dietType" element={<AnalyzingPage />} />
                  <Route path="/confirmDiet/:formattedDate/:dietType" element={<ConfirmDietPage />} />

                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/dailyreport" element={<DailyReportPage />} />
                  <Route path="/weeklyreport" element={<WeeklyReportPage />} />
                  <Route path="/monthlyreport" element={<MonthlyReportPage />} />
                  <Route path="/yearlyreport" element={<YearlyReportPage />} />

                  <Route path="/settings" element={<SettingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/editprofile" element={<EditProfile />} />
                  
                  <Route path="/friends" element={<FriendPage />} />
                  <Route path="/comparefriend/:formattedDate" element={<CompareFriendPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ContentContainer>
      {shouldShowHeaderFooter && <Footer />}
    </UserContext.Provider>
  );
}

function App() {
  return (
    <><GlobalStyle />
    <AppContainer>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppContent />
    </BrowserRouter>
    </AppContainer>
    </>
  );
}

export default App;
