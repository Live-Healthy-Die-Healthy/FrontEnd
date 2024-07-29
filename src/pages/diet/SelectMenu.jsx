import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    padding: 10px;
    width: 80%;
    font-size: 16px;
`;

const MenuButton = styled.button`
    background: #a3d2ca;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    width: 80%;
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0px;
`;

const InfoContainer = styled.div`
    margin-left: 30px;
`;

const InfoContainertwo = styled.div`
    margin-left: auto;
`;

export default function SelectMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { date } = location.state;
    const { dietType } = useParams();

    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMenus, setFilteredMenus] = useState([]);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_PORT}/menuList`
                );
                setMenus(response.data);
                setFilteredMenus(response.data);
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };

        fetchMenus();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterMenus(e.target.value);
    };

    const filterMenus = (searchTerm) => {
        const filtered = menus.filter((menu) =>
            menu.menuName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMenus(filtered);
    };

    const handleMenuClick = (menuId, menuName) => {
        navigate(`/recorddiet/${dietType}`, {
            state: { date, menuId, menuName },
        });
    };

    return (
        <>
            <Container>
                <h3>메뉴 선택</h3>
                <SearchInput
                    type='text'
                    placeholder='메뉴 이름 검색'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {filteredMenus.map((menu) => (
                    <MenuButton
                        key={menu.menuId}
                        onClick={() =>
                            handleMenuClick(
                                menu.menuId,
                                menu.menuName,
                                menu.menuCalorie
                            )
                        }
                    >
                        <MenuContainer>
                            {menu.menuName}
                            <InfoContainertwo>
                                <InfoContainer>
                                    {Math.round(menu.menuCalorie * 100)} kcal
                                </InfoContainer>
                                <InfoContainer>
                                    탄수화물 {Math.round(menu.menuCarbo * 100)}{" "}
                                    g
                                </InfoContainer>
                                <InfoContainer>
                                    프로틴 {Math.round(menu.menuProtein * 100)}{" "}
                                    g
                                </InfoContainer>
                                <InfoContainer>
                                    지방 {Math.round(menu.menuFat * 100)} g
                                </InfoContainer>
                                <InfoContainer>
                                    GI지수 {Math.round(menu.menuGI)}
                                </InfoContainer>
                            </InfoContainertwo>
                            <InfoContainer>100g당</InfoContainer>
                        </MenuContainer>
                    </MenuButton>
                ))}
            </Container>
        </>
    );
}
