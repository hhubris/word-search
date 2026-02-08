# Decision Record: Increase Maximum Grid Size from 12x12 to 20x20

**Date:** 2026-02-08  
**Status:** Accepted  
**Decision Maker:** Development Team

## Context

The original requirements specified a maximum grid size of 12x12 for word search puzzles (Requirement 3.6). During implementation and testing, it became apparent that this constraint was too restrictive for generating quality puzzles, especially for higher difficulty levels with more words (16 words for Hard difficulty).

The `@blex41/word-search` library was integrated to handle puzzle generation, and testing revealed that:
- 12x12 grids often failed to accommodate all required words with proper spacing
- Word placement algorithms needed more room to ensure at least 50% word intersection
- Larger grids provided better puzzle quality and reduced generation failures

## Decision

We decided to increase the maximum grid size from 12x12 to 20x20 and update the design document and requirements to reflect this change.

## Rationale

1. **Puzzle Generation Success**: Larger grids significantly improve the success rate of puzzle generation, especially for Hard difficulty with 16 words
2. **Word Intersection Requirements**: Meeting the 50% word intersection requirement (Requirement 3.4) is more achievable with additional space
3. **User Experience**: Larger grids don't negatively impact gameplay and can actually provide a better experience with more varied word placements
4. **Performance**: 20x20 grids remain performant in the browser with no noticeable lag
5. **Implementation Reality**: The code was already implemented with a 20x20 cap, and testing confirmed this works well

## Consequences

### Positive
- Higher puzzle generation success rate
- Better word placement variety
- Easier to meet word intersection requirements
- More room for longer words
- Reduced need for puzzle regeneration attempts

### Negative
- Slightly larger visual footprint on screen (mitigated by responsive design)
- Minor increase in memory usage (negligible for modern browsers)
- Deviation from original specification (documented here)

## Implementation

The implementation in `PuzzleGeneratorService.js` already uses 20x20 as the maximum:

```javascript
calculateGridSize(words) {
  const longestWord = Math.max(...words.map(w => w.length));
  const wordCount = words.length;
  
  let size;
  if (wordCount <= 8) {
    size = Math.max(10, longestWord + 2);
  } else if (wordCount <= 12) {
    size = Math.max(12, longestWord + 3);
  } else {
    size = Math.max(14, longestWord + 4);
  }
  
  return Math.min(20, size); // Cap at 20 for performance
}
```

## Files Affected

- `.kiro/specs/word-search-game/requirements.md` - Update Requirement 3.6 and 3.7
- `.kiro/specs/word-search-game/design.md` - Update Property 5 description
- `.kiro/specs/word-search-game/tasks.md` - Update task 3.6 description
- `src/domain/services/PuzzleGeneratorService.js` - Already implemented with 20x20 max

## Related Requirements

- Requirement 3.6: Grid size constraint
- Requirement 3.7: Puzzle regeneration on size violation
- Property 5: Grid Size Constraint validation
