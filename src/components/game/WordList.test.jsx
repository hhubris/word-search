import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordList } from './WordList.jsx';

describe('WordList', () => {
  const mockWords = [
    { id: '1', text: 'ZEBRA' },
    { id: '2', text: 'APPLE' },
    { id: '3', text: 'MONKEY' },
    { id: '4', text: 'BANANA' },
  ];

  describe('rendering', () => {
    it('should render all words', () => {
      render(<WordList words={mockWords} />);

      expect(screen.getByText('ZEBRA')).toBeInTheDocument();
      expect(screen.getByText('APPLE')).toBeInTheDocument();
      expect(screen.getByText('MONKEY')).toBeInTheDocument();
      expect(screen.getByText('BANANA')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<WordList words={mockWords} />);

      expect(screen.getByText('Words to Find')).toBeInTheDocument();
    });

    it('should render empty list when no words provided', () => {
      render(<WordList words={[]} />);

      expect(screen.getByText('Words to Find')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  describe('alphabetical sorting', () => {
    it('should display words in alphabetical order', () => {
      render(<WordList words={mockWords} />);

      const listItems = screen.getAllByRole('listitem');
      const texts = listItems.map((item) => item.textContent);

      expect(texts).toEqual(['APPLE', 'BANANA', 'MONKEY', 'ZEBRA']);
    });

    it('should maintain alphabetical order regardless of input order', () => {
      const shuffledWords = [
        { id: '3', text: 'MONKEY' },
        { id: '1', text: 'ZEBRA' },
        { id: '4', text: 'BANANA' },
        { id: '2', text: 'APPLE' },
      ];

      render(<WordList words={shuffledWords} />);

      const listItems = screen.getAllByRole('listitem');
      const texts = listItems.map((item) => item.textContent);

      expect(texts).toEqual(['APPLE', 'BANANA', 'MONKEY', 'ZEBRA']);
    });

    it('should handle case-insensitive sorting', () => {
      const mixedCaseWords = [
        { id: '1', text: 'zebra' },
        { id: '2', text: 'APPLE' },
        { id: '3', text: 'Monkey' },
        { id: '4', text: 'banana' },
      ];

      render(<WordList words={mixedCaseWords} />);

      const listItems = screen.getAllByRole('listitem');
      const texts = listItems.map((item) => item.textContent);

      expect(texts).toEqual(['APPLE', 'banana', 'Monkey', 'zebra']);
    });
  });

  describe('found words', () => {
    it('should cross out found words', () => {
      render(<WordList words={mockWords} foundWordIds={['2', '4']} />);

      const appleItem = screen.getByText('APPLE');
      const bananaItem = screen.getByText('BANANA');

      expect(appleItem).toHaveStyle({ textDecoration: 'line-through' });
      expect(bananaItem).toHaveStyle({ textDecoration: 'line-through' });
    });

    it('should not cross out words that are not found', () => {
      render(<WordList words={mockWords} foundWordIds={['2']} />);

      const zebraItem = screen.getByText('ZEBRA');
      const monkeyItem = screen.getByText('MONKEY');

      expect(zebraItem).not.toHaveStyle({ textDecoration: 'line-through' });
      expect(monkeyItem).not.toHaveStyle({ textDecoration: 'line-through' });
    });

    it('should handle empty foundWordIds array', () => {
      render(<WordList words={mockWords} foundWordIds={[]} />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).not.toHaveStyle({ textDecoration: 'line-through' });
      });
    });

    it('should handle undefined foundWordIds', () => {
      render(<WordList words={mockWords} />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).not.toHaveStyle({ textDecoration: 'line-through' });
      });
    });

    it('should update when foundWordIds changes', () => {
      const { rerender } = render(<WordList words={mockWords} foundWordIds={['2']} />);

      let appleItem = screen.getByText('APPLE');
      expect(appleItem).toHaveStyle({ textDecoration: 'line-through' });

      rerender(<WordList words={mockWords} foundWordIds={['2', '3']} />);

      appleItem = screen.getByText('APPLE');
      const monkeyItem = screen.getByText('MONKEY');

      expect(appleItem).toHaveStyle({ textDecoration: 'line-through' });
      expect(monkeyItem).toHaveStyle({ textDecoration: 'line-through' });
    });
  });

  describe('edge cases', () => {
    it('should handle single word', () => {
      const singleWord = [{ id: '1', text: 'WORD' }];
      render(<WordList words={singleWord} />);

      expect(screen.getByText('WORD')).toBeInTheDocument();
    });

    it('should handle words with same starting letter', () => {
      const sameStartWords = [
        { id: '1', text: 'APPLE' },
        { id: '2', text: 'APRICOT' },
        { id: '3', text: 'AVOCADO' },
      ];

      render(<WordList words={sameStartWords} />);

      const listItems = screen.getAllByRole('listitem');
      const texts = listItems.map((item) => item.textContent);

      expect(texts).toEqual(['APPLE', 'APRICOT', 'AVOCADO']);
    });

    it('should handle all words found', () => {
      const allFoundIds = mockWords.map((w) => w.id);
      render(<WordList words={mockWords} foundWordIds={allFoundIds} />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveStyle({ textDecoration: 'line-through' });
      });
    });
  });
});
