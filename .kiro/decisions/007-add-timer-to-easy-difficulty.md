# Decision Record: Add 12-Minute Timer to Easy Difficulty

**Date:** 2026-02-08  
**Status:** Accepted  
**Decision Maker:** Development Team

## Context

The original requirements specified that Easy difficulty should have no timer (Requirement 7.1: "SHALL not display or run a Timer"). This was intended to make Easy mode more accessible for beginners.

However, during implementation and testing, the team discovered that having no timer in Easy mode created inconsistencies in the scoring system. The scoring algorithm uses a time bonus component (remaining time × 10) that only applied to Medium and Hard difficulties, making score comparisons across difficulties less meaningful.

## Decision

We decided to add a 12-minute timer to Easy difficulty, changing it from "no timer" to "720 seconds (12 minutes)".

## Rationale

1. **Consistent Scoring**: All difficulties now use the same scoring formula with time bonus
2. **Square Root Scoring**: The 12-minute timer enables consistent square root scoring method across all modes
3. **Fair Comparison**: Players can now compare scores across difficulties more meaningfully
4. **Still Accessible**: 12 minutes is generous enough for beginners (4x longer than Hard mode)
5. **Progression Path**: Clear difficulty progression: 12min → 5min → 3min
6. **Implementation Simplicity**: Unified timer logic across all difficulties

## Timer Progression

- **Easy**: 12 minutes (720 seconds) - 4x Hard, 2.4x Medium
- **Medium**: 5 minutes (300 seconds) - 1.67x Hard
- **Hard**: 3 minutes (180 seconds) - Baseline

The timer progression provides a smooth difficulty curve while maintaining accessibility for beginners.

## Consequences

### Positive
- Consistent scoring algorithm across all difficulties
- Meaningful score comparisons between difficulties
- Simpler implementation (no special cases for Easy mode)
- Clear difficulty progression
- Still very accessible for beginners (12 minutes is generous)

### Negative
- Removes "no pressure" mode for absolute beginners
- Changes original requirement specification
- May intimidate some players who preferred no timer

## Implementation

**DifficultyConfig Update**:
```javascript
const DifficultyConfig = {
  EASY: { 
    wordCount: 8, 
    timerSeconds: 720,  // Changed from null to 720
    directions: ['RIGHT', 'DOWN'] 
  },
  MEDIUM: { wordCount: 12, timerSeconds: 300, directions: [...] },
  HARD: { wordCount: 16, timerSeconds: 180, directions: [...] }
};
```

**UI Description Update**:
- Old: "8 words, no timer, horizontal and vertical only"
- New: "8 words, 12 minute timer, horizontal and vertical only"

**Scoring Impact**:
Easy mode scores now include time bonus:
- Base score: words found × 100
- Time bonus: remaining seconds × 10
- Difficulty multiplier: 1x (Easy), 1.5x (Medium), 2x (Hard)

## Testing Impact

The following tests were updated to reflect the Easy mode timer:
- `GameSession.test.js` - Updated timer initialization tests
- `StartGameUseCase.test.js` - Updated game session creation tests
- `ScoringService.test.js` - Updated score calculation tests for Easy mode
- `DifficultySelector.test.jsx` - Updated difficulty description tests
- All tests passing after updates (530 tests)

## Files Affected

- `.kiro/specs/word-search-game/requirements.md` - Updated Requirements 2.2, 7.1
- `.kiro/specs/word-search-game/design.md` - Updated DifficultyConfig, Example 3
- `src/domain/value-objects/Difficulty.js` - Changed EASY timerSeconds from null to 720
- `src/components/home/DifficultySelector.jsx` - Updated description text
- Multiple test files - Updated to expect timer in Easy mode

## Related Requirements

- Requirement 2.2: Easy difficulty description
- Requirement 7.1: Timer initialization for Easy difficulty
- Requirement 8.1: Score calculation (now consistent across all difficulties)

## Future Considerations

- Consider adding a "Practice Mode" with no timer for absolute beginners
- Monitor user feedback on Easy mode timer
- Consider making timer optional in settings
