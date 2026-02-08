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
    <div className="flex flex-col p-5 min-w-[200px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Words to Find</h2>
      <ul className="list-none p-0 m-0">
        {sortedWords.map((word) => {
          const isFound = foundSet.has(word.id);
          return (
            <li
              key={word.id}
              className={`text-lg px-3 py-2 mb-1 rounded transition-all duration-200 ${
                isFound ? 'line-through opacity-50 text-gray-500' : ''
              }`}
            >
              {word.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
