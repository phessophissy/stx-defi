'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 500,
  options?: UseDebounceOptions
): (...args: Parameters<T>) => void {
  const { leading = false } = options ?? {};
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLeading, setIsLeading] = useState(true);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (leading && isLeading) {
        callback(...args);
        setIsLeading(false);
      }

      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        if (!leading) {
          callback(...args);
        }
        setIsLeading(true);
      }, delay);

      setTimer(newTimer);
    },
    [callback, delay, leading, timer, isLeading]
  );

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return debouncedCallback;
}
