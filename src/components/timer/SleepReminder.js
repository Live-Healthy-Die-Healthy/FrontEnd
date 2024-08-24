// src/components/SleepReminder.js
import React, { useState, useEffect } from 'react';

export default function SleepReminder({ isActive, onAlert }) {
  const [isSleepy, setIsSleepy] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Simulate a prompt asking if user is sleepy
      const timer = setTimeout(() => {
        if (confirm('졸리신가요?')) {
          setIsSleepy(true);
        } else {
          setIsSleepy(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  useEffect(() => {
    if (isSleepy) {
      onAlert();
    }
  }, [isSleepy]);

  return <div>{isSleepy ? '졸리다고 판단되었습니다. 15분 산책을 추천드립니다.' : ''}</div>;
}