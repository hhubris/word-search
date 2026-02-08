/**
 * Timer Component
 * Displays countdown timer in MM:SS format
 * 
 * Requirements: 5.3, 7.2, 7.3, 7.4
 */
export function Timer({ timeRemaining, formattedTime }) {
  // If no time remaining (null), don't display timer
  if (timeRemaining === null) {
    return null;
  }

  // Determine color class based on remaining time
  const getTimerColorClass = () => {
    if (timeRemaining <= 30) return 'text-timer-critical'; // Red for last 30 seconds
    if (timeRemaining <= 60) return 'text-timer-warning'; // Orange for last minute
    return 'text-timer-normal'; // Blue for normal
  };

  return (
    <div className="flex flex-col items-center p-4 gap-2">
      <div className="text-sm font-medium uppercase tracking-wide opacity-70">Time Remaining</div>
      <div className={`text-4xl font-bold font-mono transition-colors duration-300 ${getTimerColorClass()}`}>
        {formattedTime || '--:--'}
      </div>
    </div>
  );
}
