import React, { createContext, useState, useContext } from 'react';

const CalorieContext = createContext();

export const CalorieProvider = ({ children }) => {
  const [totalCalories, setTotalCalories] = useState(0);

  return (
    <CalorieContext.Provider value={{ totalCalories, setTotalCalories }}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalorie = () => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }
  return context;
};