import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { BsPersonCircle } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";

const Container = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 480px;
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    padding: 10px 0;
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #000000;
    padding: 5px 10px;
    border-radius: 20px;
    transition: all 0.3s ease;
    width: 25%;
    justify-content: center;

    svg {
        font-size: 20px;
        margin-right: 5px;
    }

    span {
        max-width: 0;
        overflow: hidden;
        white-space: nowrap;
        transition: max-width 0.7s ease, opacity 0.3s ease;
        opacity: 0;
    }

    &:hover,
    &.active {
        background-color: #7aa2ff;

        span {
            max-width: 100px;
            opacity: 1;
        }
    }
`;

export default function Footer() {
    return (
        <Container>
            <NavItem to='/dietmonth' activeClassName='active'>
                <FaRegCalendarAlt />
                <span>캘린더</span>
            </NavItem>
            <NavItem to='/report' activeClassName='active'>
                <HiDocumentReport />
                <span>레포트</span>
            </NavItem>
            <NavItem to='/friends' activeClassName='active'>
                <FaUserFriends />
                <span>친구</span>
            </NavItem>
            <NavItem to='/profile' activeClassName='active'>
                <BsPersonCircle />
                <span>내정보</span>
            </NavItem>
        </Container>
    );
}
