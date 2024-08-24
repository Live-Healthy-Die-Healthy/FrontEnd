// src/Hooks/useCalorie.js
import { useContext } from 'react';
import { CalorieContext } from '../context/CalorieContext';

// useCalorie 훅을 정의합니다.
const useCalorie = () => {
  const context = useContext(CalorieContext);

  if (!context) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }

  return context;
};

export default useCalorie;