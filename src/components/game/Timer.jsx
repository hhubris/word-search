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

  // Determine color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 30) return '#ef4444'; // Red for last 30 seconds
    if (timeRemaining <= 60) return '#f59e0b'; // Orange for last minute
    return '#3b82f6'; // Blue for normal
  };

  return (
    <div style={styles.container}>
      <div style={styles.label}>Time Remaining</div>
      <div 
        style={{
          ...styles.time,
          color: getTimerColor(),
        }}
      >
        {formattedTime || '--:--'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.7,
  },
  time: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    transition: 'color 0.3s ease',
  },
};
