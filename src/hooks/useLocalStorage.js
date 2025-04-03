// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      setValue(storedValue ? JSON.parse(storedValue) : initialValue);
    }
  }, [key, initialValue]);

  const setStoredValue = (newValue) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    }
  };

  return [value, setStoredValue];
};