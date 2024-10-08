import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/LoginContext";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
`;

export default function Kakao() {
    const { setAccessToken, setRefreshToken, setLoginType, setUserId } =
        useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            if (code) {
                axios({
                    url: `${process.env.REACT_APP_API_PORT}/auth/kakao/accesstoken`,
                    method: "post",
                    data: {
                        code: code,
                    },
                }).then((result) => {
                    const accessToken = result.data.access_token;
                    const refreshToken = result.data.refresh_token;

                    localStorage.setItem("accessToken", accessToken);
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                    setLoginType("KAKAO");

                    axios({
                        url: "https://kapi.kakao.com/v2/user/me",
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then((userResult) => {
                            // console.log("user info from kakao", userResult);
                            const userId = userResult.data.id;
                            const userEmail =
                                userResult.data.kakao_account.email;
                            const userNickname =
                                userResult.data.kakao_account.profile.nickname;
                            setUserId(userId);
                            axios
                                .post(
                                    `${process.env.REACT_APP_API_PORT}/checkUser`,
                                    {
                                        userId,
                                    }
                                )
                                .then((response) => {
                                    if (!response.data.isExist) {
                                        navigate("/profilesetting", {
                                            state: { userEmail, userNickname },
                                        });
                                    } else {
                                        navigate("/home");
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    return <Container>Kakao Login Loading...</Container>;
}
