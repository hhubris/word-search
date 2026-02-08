# Specification Inconsistencies Analysis

**Date:** 2026-02-08  
**Status:** Identified - Needs Resolution

## Summary

This document identifies inconsistencies between the requirements, design documents, and actual implementation that need to be resolved.

## Inconsistencies Found

### 1. Button Bar Removal (Decision 001)

**Issue**: Requirements and design still reference a button bar that was removed from implementation.

**Affected Documents**:
- `requirements.md` - Requirement 11.1, 11.2, 11.3, 11.4
- `design.md` - HomeScreen component description
- `tasks.md` - Task 15.4, Task 16.4

**Current Requirements State**:
- Requirement 11.1: "WHEN the home screen displays, THE Game_System SHALL show a button bar at the top with two buttons"
- Requirement 11.2: "THE Game_System SHALL display the first button as a high scores navigation button"
- Requirement 11.3: "THE Game_System SHALL display the second button as a theme switcher button"
- Requirement 11.4: References "button bar"

**Actual Implementation** (per Decision 001):
- No button bar component
- Theme switcher placed in top right corner of each screen
- High scores navigation handled differently

**Recommendation**:
Update requirements to reflect that:
- Theme switcher is positioned in top right corner (not in a button bar)
- Remove references to "button bar" 
- Update requirement 11.1-11.3 to describe actual layout
- Update task 16.4 to remove ButtonBar component creation (or mark as obsolete)

### 2. Grid Size Maximum (Decision 002)

**Status**: ✅ RESOLVED
- Requirements updated to 20x20
- Design updated to 20x20
- Tasks updated with note
- Decision record created

### 3. Word List Count

**Issue**: Requirements specify 500+ words per category, but implementation notes say 150 words per category.

**Affected Documents**:
- `requirements.md` - Requirement 1.4
- `IMPLEMENTATION_NOTES.md` - Word Lists section

**Current Requirement**:
- Requirement 1.4: "THE Game_System SHALL maintain at least 500 words per category"

**Actual Implementation**:
- 150 words per category (per IMPLEMENTATION_NOTES.md)

**Recommendation**:
Either:
- A) Update requirement to 150+ words (MVP approach)
- B) Expand word lists to 500+ words
- C) Create decision record documenting why 150 is acceptable

### 4. Tailwind CSS v4

**Issue**: Design specifies Tailwind CSS v4, but implementation notes say it's not loading properly and inline styles are used instead.

**Affected Documents**:
- `design.md` - Technology Stack section
- `requirements.md` - Requirement 13.5
- `IMPLEMENTATION_NOTES.md` - Technology Stack section

**Current Specification**:
- Requirement 13.5: "THE Game_System SHALL use Tailwind CSS v4 for styling"

**Actual Implementation**:
- Inline styles used (Tailwind CSS v4 not loading properly in beta)

**Recommendation**:
Either:
- A) Fix Tailwind CSS v4 integration
- B) Update requirements to reflect inline styles approach
- C) Create decision record documenting styling approach

### 5. High Scores Navigation Button

**Issue**: Requirement 11.2 mentions a high scores navigation button, but Decision 001 removed the button bar. Unclear how high scores navigation works now.

**Affected Documents**:
- `requirements.md` - Requirement 11.2
- `design.md` - HomeScreen component

**Recommendation**:
Clarify in requirements how users navigate to high scores screen if button bar was removed.

### 6. Theme Switcher Placement

**Issue**: Requirements say theme switcher is in button bar (11.3), but Decision 001 says it's in top right corner.

**Affected Documents**:
- `requirements.md` - Requirement 11.3
- `design.md` - HomeScreen component

**Recommendation**:
Update requirements to specify theme switcher is positioned in top right corner of each screen.

## Proposed Actions

### High Priority (Affects Core Requirements)
1. ✅ Update Requirement 11 (Home Screen Layout) to remove button bar references
2. ✅ Update design document HomeScreen description
3. ✅ Update tasks 15.4 and 16.4 to reflect actual implementation

### Medium Priority (Affects Implementation Details)
4. Decide on word list count (150 vs 500) and update accordingly
5. Decide on styling approach (Tailwind vs inline) and document

### Low Priority (Documentation)
6. Update IMPLEMENTATION_NOTES.md to reflect any requirement changes
7. Consider creating additional decision records for word count and styling

## Notes

- Decision records should be created for any intentional deviations from original requirements
- Requirements should be the source of truth - if implementation differs, either fix implementation or update requirements with justification
- Design document should match requirements
- Tasks should match design document
