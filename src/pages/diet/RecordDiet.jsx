import React, { useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import axios from "axios";
import { UserContext } from "../../context/LoginContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
`;

const FormContainer = styled.div`
  width: 80%;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #a3d2ca;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
`;

export default function RecordDiet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dietType } = useParams();
  const { date, menuId, menuName } = location.state;
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  const [quantity, setQuantity] = useState("");

  const { accessToken, userId } = useContext(UserContext);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleSave = async () => {
    if (!quantity) {
      alert("섭취량을 입력해주세요.");
      return;
    }

    const dietData = {
      userId,
      dietDate: formattedDate,
      dietType,
      menuId,
      quantity: Number(quantity)
    };

    try {
      const response = await axios.post("http://localhost:4000/addDiet", dietData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        navigate(`/dietdaily/${formattedDate}`, {
          state: { date }
        });
      } else {
        alert("식사 기록 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving diet log:", error);
      alert("식사 기록 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <h3>{formattedDate} {dietType} 기록</h3>
      <FormContainer>
        <h4>{menuName}</h4>
        <Input
          type="number"
          placeholder="섭취량 (g)"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <Button onClick={handleSave}>저장</Button>
      </FormContainer>
    </Container>
  );
}