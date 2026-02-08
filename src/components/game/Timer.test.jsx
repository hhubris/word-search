import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from './Timer.jsx';
import * as fc from 'fast-check';

describe('Timer', () => {
  describe('rendering', () => {
    it('should render timer with formatted time', () => {
      render(<Timer timeRemaining={300} formattedTime="05:00" />);

      expect(screen.getByText('Time Remaining')).toBeInTheDocument();
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('should render timer with different time values', () => {
      render(<Timer timeRemaining={90} formattedTime="01:30" />);

      expect(screen.getByText('01:30')).toBeInTheDocument();
    });

    it('should not render when timeRemaining is null', () => {
      const { container } = render(<Timer timeRemaining={null} formattedTime="--:--" />);

      expect(container.firstChild).toBeNull();
    });

    it('should render placeholder when formattedTime is not provided', () => {
      render(<Timer timeRemaining={100} />);

      expect(screen.getByText('--:--')).toBeInTheDocument();
    });
  });

  describe('color coding', () => {
    it('should use blue color for normal time (> 60 seconds)', () => {
      render(<Timer timeRemaining={120} formattedTime="02:00" />);

      const timeElement = screen.getByText('02:00');
      expect(timeElement).toHaveStyle({ color: '#3b82f6' });
    });

    it('should use orange color for warning time (31-60 seconds)', () => {
      render(<Timer timeRemaining={45} formattedTime="00:45" />);

      const timeElement = screen.getByText('00:45');
      expect(timeElement).toHaveStyle({ color: '#f59e0b' });
    });

    it('should use red color for critical time (<= 30 seconds)', () => {
      render(<Timer timeRemaining={15} formattedTime="00:15" />);

      const timeElement = screen.getByText('00:15');
      expect(timeElement).toHaveStyle({ color: '#ef4444' });
    });

    it('should use red color at exactly 30 seconds', () => {
      render(<Timer timeRemaining={30} formattedTime="00:30" />);

      const timeElement = screen.getByText('00:30');
      expect(timeElement).toHaveStyle({ color: '#ef4444' });
    });

    it('should use orange color at exactly 60 seconds', () => {
      render(<Timer timeRemaining={60} formattedTime="01:00" />);

      const timeElement = screen.getByText('01:00');
      expect(timeElement).toHaveStyle({ color: '#f59e0b' });
    });
  });

  describe('time formatting', () => {
    it('should display zero time', () => {
      render(<Timer timeRemaining={0} formattedTime="00:00" />);

      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('should display single digit seconds with leading zero', () => {
      render(<Timer timeRemaining={5} formattedTime="00:05" />);

      expect(screen.getByText('00:05')).toBeInTheDocument();
    });

    it('should display double digit minutes', () => {
      render(<Timer timeRemaining={599} formattedTime="09:59" />);

      expect(screen.getByText('09:59')).toBeInTheDocument();
    });

    it('should display large time values', () => {
      render(<Timer timeRemaining={3600} formattedTime="60:00" />);

      expect(screen.getByText('60:00')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle timeRemaining of 0', () => {
      render(<Timer timeRemaining={0} formattedTime="00:00" />);

      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByText('00:00')).toHaveStyle({ color: '#ef4444' });
    });

    it('should handle very large time values', () => {
      render(<Timer timeRemaining={10000} formattedTime="166:40" />);

      expect(screen.getByText('166:40')).toBeInTheDocument();
      expect(screen.getByText('166:40')).toHaveStyle({ color: '#3b82f6' });
    });

    it('should handle timeRemaining of 1 second', () => {
      render(<Timer timeRemaining={1} formattedTime="00:01" />);

      expect(screen.getByText('00:01')).toBeInTheDocument();
      expect(screen.getByText('00:01')).toHaveStyle({ color: '#ef4444' });
    });
  });

  describe('display behavior', () => {
    it('should show label text', () => {
      render(<Timer timeRemaining={100} formattedTime="01:40" />);

      expect(screen.getByText('Time Remaining')).toBeInTheDocument();
    });

    it('should not render anything when timeRemaining is null', () => {
      const { container } = render(<Timer timeRemaining={null} formattedTime="05:00" />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Time Remaining')).not.toBeInTheDocument();
      expect(screen.queryByText('05:00')).not.toBeInTheDocument();
    });
  });

  describe('property-based tests', () => {
    // Feature: word-search-game, Property 6: Timer Display Based on Difficulty
    it('Property 6: timer should be displayed if and only if timeRemaining is not null', () => {
      fc.assert(
        fc.property(
          // Generate either null or a positive integer for time
          fc.option(fc.integer({ min: 0, max: 600 }), { nil: null }),
          (timeRemaining) => {
            // Format time for display
            const formattedTime = timeRemaining !== null
              ? `${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`
              : '--:--';

            const { container, unmount } = render(
              <Timer timeRemaining={timeRemaining} formattedTime={formattedTime} />
            );

            if (timeRemaining === null) {
              // Timer should not be displayed
              expect(container.firstChild).toBeNull();
              expect(screen.queryByText('Time Remaining')).not.toBeInTheDocument();
            } else {
              // Timer should be displayed
              expect(screen.getByText('Time Remaining')).toBeInTheDocument();
              expect(screen.getByText(formattedTime)).toBeInTheDocument();
            }

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 6: timer color should reflect remaining time thresholds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 600 }),
          (timeRemaining) => {
            const formattedTime = `${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`;

            const { unmount } = render(
              <Timer timeRemaining={timeRemaining} formattedTime={formattedTime} />
            );

            const timeElement = screen.getByText(formattedTime);

            // Verify color based on time remaining
            if (timeRemaining <= 30) {
              expect(timeElement).toHaveStyle({ color: '#ef4444' }); // Red
            } else if (timeRemaining <= 60) {
              expect(timeElement).toHaveStyle({ color: '#f59e0b' }); // Orange
            } else {
              expect(timeElement).toHaveStyle({ color: '#3b82f6' }); // Blue
            }

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
