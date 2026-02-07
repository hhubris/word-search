import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer.js';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with null time remaining', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.timeRemaining).toBeNull();
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isExpired).toBe(false);
    });

    it('should format null time as --:--', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formattedTime).toBe('--:--');
    });
  });

  describe('start', () => {
    it('should start timer with specified duration', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(60);
      });

      expect(result.current.timeRemaining).toBe(60);
      expect(result.current.isRunning).toBe(true);
      expect(result.current.isExpired).toBe(false);
    });

    it('should countdown every second', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      expect(result.current.timeRemaining).toBe(10);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeRemaining).toBe(9);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeRemaining).toBe(8);
    });

    it('should stop at zero', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(3);
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isExpired).toBe(true);
    });

    it('should call onExpire callback when timer expires', () => {
      const { result } = renderHook(() => useTimer());
      const onExpire = vi.fn();

      act(() => {
        result.current.start(2, onExpire);
      });

      expect(onExpire).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onExpire).toHaveBeenCalledTimes(1);
    });

    it('should clear existing timer when starting new one', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.timeRemaining).toBe(7);

      act(() => {
        result.current.start(5);
      });

      expect(result.current.timeRemaining).toBe(5);
      expect(result.current.isExpired).toBe(false);
    });
  });

  describe('stop', () => {
    it('should stop the timer', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeRemaining).toBe(8);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Time should not change after stop
      expect(result.current.timeRemaining).toBe(8);
    });

    it('should not call onExpire after stop', () => {
      const { result } = renderHook(() => useTimer());
      const onExpire = vi.fn();

      act(() => {
        result.current.start(3, onExpire);
      });

      act(() => {
        result.current.stop();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onExpire).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset timer to initial state', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.timeRemaining).toBeNull();
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isExpired).toBe(false);
    });

    it('should stop countdown after reset', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        result.current.reset();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeRemaining).toBeNull();
    });
  });

  describe('pause and resume', () => {
    it('should pause the timer', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeRemaining).toBe(8);

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Time should not change while paused
      expect(result.current.timeRemaining).toBe(8);
    });

    it('should resume the timer from paused state', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.pause();
      });

      expect(result.current.timeRemaining).toBe(8);

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.timeRemaining).toBe(6);
    });

    it('should not resume if timer is already running', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      const wasRunning = result.current.isRunning;

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(wasRunning);
    });

    it('should not resume if time is zero', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(1);
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeRemaining).toBe(0);

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('formatTime', () => {
    it('should format seconds as MM:SS', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formatTime(0)).toBe('00:00');
      expect(result.current.formatTime(30)).toBe('00:30');
      expect(result.current.formatTime(60)).toBe('01:00');
      expect(result.current.formatTime(90)).toBe('01:30');
      expect(result.current.formatTime(300)).toBe('05:00');
      expect(result.current.formatTime(599)).toBe('09:59');
    });

    it('should format null as --:--', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formatTime(null)).toBe('--:--');
    });

    it('should update formattedTime as timer counts down', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(65);
      });

      expect(result.current.formattedTime).toBe('01:05');

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(result.current.formattedTime).toBe('00:59');
    });
  });

  describe('cleanup', () => {
    it('should clear interval on unmount', () => {
      const { result, unmount } = renderHook(() => useTimer());

      act(() => {
        result.current.start(10);
      });

      expect(result.current.isRunning).toBe(true);

      unmount();

      // Verify no errors occur after unmount
      act(() => {
        vi.advanceTimersByTime(2000);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle very short durations', () => {
      const { result } = renderHook(() => useTimer());
      const onExpire = vi.fn();

      act(() => {
        result.current.start(1, onExpire);
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.isExpired).toBe(true);
      expect(onExpire).toHaveBeenCalled();
    });

    it('should handle long durations', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(3600); // 1 hour
      });

      expect(result.current.formattedTime).toBe('60:00');

      act(() => {
        vi.advanceTimersByTime(60000); // 1 minute
      });

      expect(result.current.formattedTime).toBe('59:00');
    });

    it('should not go below zero', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start(2);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.timeRemaining).not.toBeLessThan(0);
    });
  });
});
