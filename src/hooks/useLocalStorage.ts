import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadValue = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    };

    loadValue();

    // Listen for changes from other components in the same window
    const handleStorageChange = (e: any) => {
      if (e.detail && e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    // Also listen for changes from other tabs
    const handleCrossTabChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('local-storage-update', handleStorageChange);
    window.addEventListener('storage', handleCrossTabChange);
    return () => {
      window.removeEventListener('local-storage-update', handleStorageChange);
      window.removeEventListener('storage', handleCrossTabChange);
    };
  }, [key]);

  // Use a ref to keep track of the current value for the setValue closure
  const valueRef = useRef<T>(storedValue);
  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(valueRef.current) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Notify other instances in the same window
        window.dispatchEvent(new CustomEvent('local-storage-update', { 
          detail: { key, value: valueToStore } 
        }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Return initialValue if not mounted to ensure hydration match
  // This is the most explicit way to fix hydration errors in Next.js
  return [mounted ? storedValue : initialValue, setValue];
}