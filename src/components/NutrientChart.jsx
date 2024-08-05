import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const ChartContainer = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    background-color: #e5f3ec;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-size: 20px;
`;

const NutrientBar = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
`;

const NutrientLabel = styled.span`
    font-size: 22px;
    color: #333;
    margin-bottom: 5px;
`;

const BarContainer = styled.div`
    width: 100%;
    height: 20px;
    background-color: #c0e8d5;
    border-radius: 10px;
    overflow: visible;
    position: relative;
`;

const fillAnimation = (width) => keyframes`
    0% { width: 0; }
    100% { width: ${width}%; }
`;

const FilledBar = styled.div`
    height: 100%;
    background-color: #fc6a03;
    width: ${(props) => props.width}%;
    border-radius: 10px;
    animation: ${fillAnimation} 1s ease-out forwards;
`;

const OptimalLine = styled.div`
    position: absolute;
    top: -15px;
    bottom: -15px;
    width: 2px;
    background-color: #000;
    opacity: 0.25;
    left: ${(props) => props.position}%;
`;

const OptimalLabel = styled.div`
    position: absolute;
    top: -28px;
    left: ${(props) => props.position}%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #666;
    white-space: nowrap;
`;

const OptimalValue = styled.div`
    position: absolute;
    bottom: -25px;
    left: ${(props) => props.position}%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #666;
`;

const ValueLabel = styled.span`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #333;
`;

const NutrientChart = ({ nutritionInfo }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const renderNutrientBar = (nutrient, value, optimal, optimalIntake) => {
        const percentage = (value / optimal) * 100;
        const optimalPosition = (optimalIntake / optimal) * 100;
        return (
            <NutrientBar key={nutrient}>
                <NutrientLabel>
                    {nutrient} {Math.round(value)}g
                </NutrientLabel>
                <BarContainer>
                    {animate && <FilledBar width={percentage} />}
                    <OptimalLine position={optimalPosition} />
                    <OptimalLabel position={optimalPosition}>
                        맞춤 섭취량
                    </OptimalLabel>
                    <OptimalValue position={optimalPosition}>
                        {optimalIntake}g
                    </OptimalValue>
                    <ValueLabel>{Math.round(value)}g</ValueLabel>
                </BarContainer>
            </NutrientBar>
        );
    };

    const optimalIntakes = {
        carbo: 60,
        protein: 50,
        fat: 30,
    };

    return (
        <ChartContainer>
            {renderNutrientBar(
                "탄수화물",
                nutritionInfo.carbo,
                150,
                optimalIntakes.carbo
            )}
            {renderNutrientBar(
                "단백질",
                nutritionInfo.protein,
                150,
                optimalIntakes.protein
            )}
            {renderNutrientBar(
                "지방",
                nutritionInfo.fat,
                150,
                optimalIntakes.fat
            )}
        </ChartContainer>
    );
};

export default NutrientChart;
