import React, { createContext, useContext, useState } from "react";

// Create the CalorieContext
const CalorieContext = createContext();

// Create a provider component
export function CalorieProvider({ children }) {
  const [totalCalories, setTotalCalories] = useState(0);

  return (
    <CalorieContext.Provider value={{ totalCalories, setTotalCalories }}>
      {children}
    </CalorieContext.Provider>
  );
}

// Custom hook to use the CalorieContext
export function useCalorie() {
  const context = useContext(CalorieContext);
  if (!context) {
    throw new Error("useCalorie must be used within a CalorieProvider");
  }
  return context;
}