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
    position: fixed;
    bottom: 0;
    background-color: #5ddebe;
    padding: 10px 0;
`;

const MenuName = styled.span`
    font-size: 13px;
`;

const NavItem = styled(NavLink)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #b53a14;
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
        background-color: #ffcb5b;

        span {
            max-width: 100px;
            opacity: 1;
        }
    }
`;

const NavCon = styled.div`
    width: 25%;
`;

export default function Footer() {
    return (
        <Container>
            <NavItem to='/dietmonth' activeClassName='active'>
                <FaRegCalendarAlt />
                <MenuName>캘린더</MenuName>
            </NavItem>
            <NavItem to='/report' activeClassName='active'>
                <HiDocumentReport />
                <MenuName>레포트</MenuName>
            </NavItem>
            <NavItem to='/friends' activeClassName='active'>
                <FaUserFriends />
                <MenuName>친구</MenuName>
            </NavItem>
            <NavItem to='/profile' activeClassName='active'>
                <BsPersonCircle />
                <MenuName>내정보</MenuName>
            </NavItem>
        </Container>
    );
}
