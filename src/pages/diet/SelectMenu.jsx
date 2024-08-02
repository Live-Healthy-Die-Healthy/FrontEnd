// SelectMenu.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import RecordDietOverlay from "../../components/RecordOverlay/RecordDietOverlay"; // 오버레이 컴포넌트 import

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
    font-size: 4vw; /* Responsive font size */
    cursor: pointer;
    align-self: flex-start;
    margin: 0px 5px;
    font-weight: bold;
    color: #fc6a03;

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
    font-size: 2vw;
    background-color: rgba(150, 206, 179, 0.25);
    color: black;
    border-radius: 30px;

    &::placeholder {
        color: #7ebc9e;
    }

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
    align-items: stretch;
    width: 80%;
    margin: 10px 0px;
    background: #ffeeae;
    padding: 10px 0;
    border-radius: 10px;
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 40%;
    padding: 0 10px;
`;

const NutrientSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 40%;
    padding: 0 10px;
    border-right: 1px solid white;
`;

const ButtonSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
`;

const PlusButton = styled.button`
    background: none;
    border: none;
    font-size: 50px;
    cursor: pointer;
    color: #fc6a03;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 27%;
    margin-left: 10px;
`;

const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1; /* Ensure this container takes up the necessary space */
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    padding-left: 20px; /* Optional: Add some padding to the left */
`;

const MenuSelect = styled.div`
    font-size: 4vw;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 27%;
    margin-left: 10px;
`;

export default function SelectMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { date } = location.state;
    const { dietType } = useParams();

    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null); // 선택한 메뉴 상태 추가

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

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    const closeOverlay = () => {
        setSelectedMenu(null);
    };

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate(-1)}>&lt; </BackButton>
                <MenuSelect>메뉴선택</MenuSelect>
            </Header>
            <SearchInput
                type='text'
                placeholder='음식 이름을 적어주세요'
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {filteredMenus.map((menu) => (
                <MenuContainer key={menu.menuId}>
                    <InfoSection>
                        <MenuName>{menu.menuName}</MenuName>
                        <InfoContainer>(100g)</InfoContainer>
                        <InfoContainer>
                            {Math.round(menu.menuCalorie * 100)} kcal
                        </InfoContainer>
                        <InfoContainer>
                            GI지수 {Math.round(menu.menuGI)}
                        </InfoContainer>
                    </InfoSection>
                    <NutrientSection>
                        <InfoContainer>
                            탄수화물 {Math.round(menu.menuCarbo * 100)} g
                        </InfoContainer>
                        <InfoContainer>
                            단백질 {Math.round(menu.menuProtein * 100)} g
                        </InfoContainer>
                        <InfoContainer>
                            지방 {Math.round(menu.menuFat * 100)} g
                        </InfoContainer>
                    </NutrientSection>
                    <ButtonSection>
                        <PlusButton onClick={() => handleMenuClick(menu)}>
                            <FaPlus />
                        </PlusButton>
                    </ButtonSection>
                </MenuContainer>
            ))}
            {selectedMenu && (
                <RecordDietOverlay
                    date={date}
                    dietType={dietType}
                    menuId={selectedMenu.menuId}
                    menuName={selectedMenu.menuName}
                    onClose={closeOverlay}
                />
            )}
        </Container>
    );
}
