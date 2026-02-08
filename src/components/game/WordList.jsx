import { useMemo } from 'react';

/**
 * WordList Component
 * Displays words in alphabetical order and crosses out found words
 * 
 * Requirements: 5.2, 6.6
 */
export function WordList({ words, foundWordIds = [] }) {
  // Sort words alphabetically
  const sortedWords = useMemo(() => {
    return [...words].sort((a, b) => a.text.localeCompare(b.text));
  }, [words]);

  // Create a Set for O(1) lookup of found words
  const foundSet = useMemo(() => new Set(foundWordIds), [foundWordIds]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Words to Find</h2>
      <ul style={styles.list}>
        {sortedWords.map((word) => {
          const isFound = foundSet.has(word.id);
          return (
            <li
              key={word.id}
              style={{
                ...styles.listItem,
                ...(isFound ? styles.foundWord : {}),
              }}
            >
              {word.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    minWidth: '200px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: '1.125rem',
    padding: '8px 12px',
    marginBottom: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  foundWord: {
    textDecoration: 'line-through',
    opacity: 0.5,
    color: '#888',
  },
};
