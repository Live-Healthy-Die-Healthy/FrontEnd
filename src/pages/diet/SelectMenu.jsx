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
    margin-top: 5vh;
    margin-bottom: 10vh;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 2vw; /* Responsive font size */
    cursor: pointer;
    align-self: flex-start;
    margin: 10px 20px;

    @media (max-width: 768px) {
        font-size: 4vw;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    padding: 10px;
    width: 80%;
    font-size: 2vw; /* Responsive font size */

    @media (max-width: 768px) {
        font-size: 4vw;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const MenuButton = styled.button`
    background: #ffb784;
    color: #000000;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    font-size: 2vw; /* Responsive font size */
    border-radius: 5px;
    width: 80%;

    @media (max-width: 768px) {
        font-size: 4vw;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const MenuContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin: 10px 0px;
`;

const MenuName = styled.div`
    font-size: 2vw; /* Responsive font size */
    font-weight: bold;
    margin-bottom: 5px;

    @media (max-width: 768px) {
        font-size: 90%;
    }

    @media (max-width: 480px) {
        font-size: 5vw;
    }
`;

const InfoContainer = styled.div`
    margin-bottom: 5px;
    font-size: 1.5vw;

    @media (max-width: 768px) {
        font-size: 3vw;
    }

    @media (max-width: 480px) {
        font-size: 4vw;
    }
`;

const NutrientContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 27%; /* Fixed width */
    margin-left: 10px;
`;

const CalorieGIContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 27%; /* Fixed width */
    margin-left: 10px;
`;

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1; /* Ensure this container takes up the necessary space */
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
        <Container>
            <BackButton onClick={() => navigate(-1)}>&lt; 메뉴선택</BackButton>
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
                        <ColumnContainer>
                            <MenuName>{menu.menuName}</MenuName>
                            <InfoContainer>100g당</InfoContainer>
                        </ColumnContainer>
                        <CalorieGIContainer>
                            <InfoContainer>
                                {Math.round(menu.menuCalorie * 100)} kcal
                            </InfoContainer>
                            <InfoContainer>
                                GI지수 {Math.round(menu.menuGI)}
                            </InfoContainer>
                        </CalorieGIContainer>
                        <NutrientContainer>
                            <InfoContainer>
                                탄수화물 {Math.round(menu.menuCarbo * 100)} g
                            </InfoContainer>
                            <InfoContainer>
                                프로틴 {Math.round(menu.menuProtein * 100)} g
                            </InfoContainer>
                            <InfoContainer>
                                지방 {Math.round(menu.menuFat * 100)} g
                            </InfoContainer>
                        </NutrientContainer>
                    </MenuContainer>
                </MenuButton>
            ))}
        </Container>
    );
}
