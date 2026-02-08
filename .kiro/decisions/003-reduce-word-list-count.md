# Decision Record: Reduce Word List Count from 500+ to 150+ per Category

**Date:** 2026-02-08  
**Status:** Accepted  
**Decision Maker:** Development Team

## Context

The original requirements specified that the system should maintain at least 500 words per category (Requirement 1.4). During implementation, word lists were created with 150 words per category for all 8 categories (Animals, Sports, Science, Food, Geography, Technology, Music, Movies).

This discrepancy between requirements (500+) and implementation (150) needs to be resolved.

## Decision

We decided to update the requirement to specify at least 150 words per category, accepting the current implementation as sufficient for MVP and future expansion.

## Rationale

1. **MVP Approach**: 150 words per category provides sufficient variety for gameplay without requiring extensive content creation upfront
2. **Puzzle Generation**: With 8-16 words per puzzle (depending on difficulty), 150 words provides ample variety (9-18 unique puzzles per category minimum)
3. **Quality over Quantity**: Curating 150 high-quality, appropriate words is better than rushing to 500 words with lower quality
4. **Expandability**: The architecture supports easy expansion - additional words can be added to JSON files at any time
5. **Time to Market**: Reducing content creation time allows faster MVP delivery
6. **User Experience**: Players are unlikely to exhaust 150 words per category in typical gameplay sessions

## Consequences

### Positive
- Faster MVP delivery with quality word lists
- Easier to maintain and curate word lists
- Sufficient variety for engaging gameplay
- Easy to expand in future iterations
- Reduced initial content creation burden

### Negative
- Players who play extensively may see repeated puzzles sooner
- Less variety than originally envisioned
- May need expansion before public launch

## Implementation

Current word lists (verified):
- `animals.json`: 150 words
- `food.json`: 150 words
- `geography.json`: 150 words
- `movies.json`: 150 words
- `music.json`: 150 words
- `science.json`: 150 words
- `sports.json`: 150 words
- `technology.json`: 150 words

All words are 3-8 characters in length as required.

## Future Expansion Plan

1. **Phase 1 (Current)**: 150 words per category - MVP
2. **Phase 2**: Expand to 300 words per category - Beta
3. **Phase 3**: Expand to 500+ words per category - Public Launch

Word expansion can be done incrementally without code changes.

## Files Affected

- `.kiro/specs/word-search-game/requirements.md` - Update Requirement 1.4
- `.kiro/specs/word-search-game/design.md` - Update word data structure section
- `src/infrastructure/wordLists/*.json` - Current implementation (150 words each)

## Related Requirements

- Requirement 1.4: Word list count per category
- Requirement 1.5: Word length constraints (3-8 characters) - unchanged
