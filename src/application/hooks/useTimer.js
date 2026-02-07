import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useTimer hook
 * Manages countdown timer logic with setInterval
 */
export function useTimer() {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const durationRef = useRef(null);
  const onExpireRef = useRef(null);

  /**
   * Start the timer
   * @param {number} durationSeconds - Timer duration in seconds
   * @param {Function} onExpire - Callback when timer expires (optional)
   */
  const start = useCallback((durationSeconds, onExpire = null) => {
    // Clear any existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up timer state
    startTimeRef.current = Date.now();
    durationRef.current = durationSeconds;
    onExpireRef.current = onExpire;
    setTimeRemaining(durationSeconds);
    setIsRunning(true);
    setIsExpired(false);

    // Start interval
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, durationRef.current - elapsed);

      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setIsExpired(true);

        // Call onExpire callback if provided
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    }, 1000);
  }, []);

  /**
   * Stop the timer
   */
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  /**
   * Reset the timer
   */
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeRemaining(null);
    setIsRunning(false);
    setIsExpired(false);
    startTimeRef.current = null;
    durationRef.current = null;
    onExpireRef.current = null;
  }, []);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, []);

  /**
   * Resume the timer
   */
  const resume = useCallback(() => {
    if (timeRemaining === null || timeRemaining === 0 || isRunning) {
      return;
    }

    // Update start time to account for paused duration
    startTimeRef.current = Date.now();
    durationRef.current = timeRemaining;
    setIsRunning(true);

    // Start interval
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, durationRef.current - elapsed);

      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setIsExpired(true);

        // Call onExpire callback if provided
        if (onExpireRef.current) {
          onExpireRef.current();
        }
      }
    }, 1000);
  }, [timeRemaining, isRunning]);

  /**
   * Format time as MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = useCallback((seconds) => {
    if (seconds === null) return '--:--';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    timeRemaining,
    isRunning,
    isExpired,

    // Actions
    start,
    stop,
    reset,
    pause,
    resume,

    // Utilities
    formatTime,
    formattedTime: formatTime(timeRemaining),
  };
}
