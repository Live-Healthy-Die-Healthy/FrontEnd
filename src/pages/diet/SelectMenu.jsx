import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import dummyData from "../../mocks/dummyMenu.json";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
`;

const SearchInput = styled.input`
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

const MenuImage = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 10px;
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
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
                setMenus(dummyData);
                setFilteredMenus(dummyData);
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
                        <MenuImage src={menu.menuImage} alt={menu.menuName} />
                        {menu.menuName}
                        <div>&nbsp;({menu.menuCalorie} kcal)</div>
                    </MenuContainer>
                </MenuButton>
            ))}
        </Container>
    );
}
