import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";

export default function Kakao() {

  const { accessToken, setAccessToken, refreshToken, setRefreshToken, loginType, setLoginType } =
    useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log(code);
    if (code) {
      axios({
        url: "http://localhost:8112/auth/kakao/accesstoken",
        method: "post",
        data: {
          code: code,
        },
      }).then((result) => {
        const accessToken = result.data.access_token;
        const refreshToken = result.data.refresh_token;
        console.log("accessToken : " , accessToken);
        console.log("refreshToken : " , refreshToken);
        console.log("result : ", result);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setLoginType("KAKAO");
        navigate("/home");
      });
    }
  } catch (error) {}

  }, []);

  return (
    <div>Kakao Login ...</div>
  )
}
