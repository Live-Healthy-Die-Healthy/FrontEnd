import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login/LoginPage';
import MonthlyTraining from './pages/training/MonthlyTraining';
import Footer from './components/Footer';
import Header from './components/Header';
import DailyTraining from './pages/training/DailyTraining';
import RecordTraining from './pages/training/RecordTraining';
import SelectTraining from './pages/training/SelectTraining';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import Git from "./components/callback/Git";
// import Google from "./components/callback/Google";
import Kakao from "./components/callback/Kakao";
import { UserContext } from "./context/LoginContext";


function App() {

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loginType, setLoginType] = useState("");

  useEffect(() => {
    if (accessToken) {
      switch (loginType) {
        case "GIT":
          axios({
            url: "https://api.github.com/user",
            method: "GET",
            headers: {
              'Authorization': `token ${accessToken}`,
            }
          }).then((result) => {
            console.log("user info from github", result);
          }).catch(error=>{console.log(error)});
    
          break;
        case "GOOGLE":
          break;
        case "KAKAO":
          axios({
            url: "https://kapi.kakao.com/v2/user/me",
            method: "GET",
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          }).then((result) => {
            console.log("hi");
            console.log("user info from kakao", result);
          }).catch(error=>{console.log(error)});
          
          break;
        default:
          break;
      }
    }
  }, [accessToken]);

  return (
    <Router>
        <UserContext.Provider
          value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, loginType, setLoginType }}
        >
          <Header/>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/auth/callback/git" element={<Git />} /> */}
            {/* <Route path="/auth/callback/google" element={<Google />} /> */}
            <Route path="/auth/callback/kakao" element={<Kakao />} />

            <Route path="/home" element={<HomePage />} />

            <Route path="/trainmonth" element={<MonthlyTraining />} />
            <Route path="/traindaily/:date" element={<DailyTraining />} />
            <Route path="/selecttraining" element={<SelectTraining />} />
            <Route path="/recordtraining" element={<RecordTraining />} />

          </Routes>
          
          <Footer/>

        </UserContext.Provider>
      </Router>
  );
}

export default App;
