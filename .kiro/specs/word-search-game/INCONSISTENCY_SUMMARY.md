# Specification Inconsistencies - Summary Report

**Generated:** 2026-02-08  
**Status:** Requires Action

## Critical Inconsistencies Requiring Updates

### 1. ❌ Button Bar Removal (HIGH PRIORITY)

**Problem**: Requirements 11.1-11.4 describe a button bar UI that doesn't exist in implementation.

**Decision Record**: 001-remove-button-bar.md

**What Needs Updating**:
- ✅ `requirements.md` - Requirement 11.1, 11.2, 11.3, 11.4
- ✅ `design.md` - HomeScreen component description  
- ✅ `tasks.md` - Task 15.4 description, Task 16.4 (ButtonBar component)

**Current vs Actual**:
- **Requirements say**: "button bar at the top with two buttons" (high scores + theme switcher)
- **Implementation has**: Theme switcher in top right corner, no button bar

---

### 2. ❌ Word List Count (MEDIUM PRIORITY)

**Problem**: Requirements specify 500+ words per category, implementation has 150 words per category.

**What Needs Updating**:
- ✅ `requirements.md` - Requirement 1.4
- ✅ Create decision record OR expand word lists

**Current vs Actual**:
- **Requirements say**: "at least 500 words per category"
- **Implementation has**: Exactly 150 words per category (verified via jq)

**Options**:
1. Update requirement to "at least 150 words per category" (MVP approach)
2. Expand word lists to 500+ words
3. Document as intentional MVP decision

---

### 3. ❌ Tailwind CSS v4 (MEDIUM PRIORITY)

**Problem**: Requirements specify Tailwind CSS v4, but implementation uses inline styles.

**What Needs Updating**:
- ✅ `requirements.md` - Requirement 13.5
- ✅ `design.md` - Technology Stack section
- ✅ Create decision record OR fix Tailwind integration

**Current vs Actual**:
- **Requirements say**: "SHALL use Tailwind CSS v4 for styling"
- **Implementation has**: Inline styles (per IMPLEMENTATION_NOTES.md: "Tailwind CSS v4 not loading properly in beta")

**Options**:
1. Fix Tailwind CSS v4 integration
2. Update requirements to allow inline styles
3. Document as temporary workaround with plan to fix

---

### 4. ✅ Grid Size Maximum (RESOLVED)

**Status**: Already fixed via Decision Record 002
- Requirements updated: 12x12 → 20x20
- Design updated: 12x12 → 20x20
- Tasks updated with note

---

## Recommended Action Plan

### Phase 1: Update Requirements for Button Bar (Immediate)
1. Update Requirement 11.1-11.4 to remove button bar references
2. Describe actual layout: theme switcher in top right corner
3. Update design document HomeScreen description
4. Update tasks 15.4 and 16.4

### Phase 2: Decide on Word Count (This Sprint)
**Option A (Recommended)**: Update requirement to 150+ words
- Faster, MVP-friendly
- Create decision record explaining MVP approach
- Can expand later

**Option B**: Expand word lists to 500+
- More work, but meets original requirement
- Better long-term solution

### Phase 3: Decide on Styling (This Sprint)
**Option A**: Fix Tailwind CSS v4
- Investigate why it's not loading
- Fix configuration
- Update implementation

**Option B (Recommended)**: Document inline styles as acceptable
- Create decision record
- Update requirement 13.5
- Faster path to completion

---

## Files That Need Updates

### Requirements Document
- [ ] Requirement 1.4 (word count)
- [ ] Requirement 11.1 (button bar → actual layout)
- [ ] Requirement 11.2 (high scores button → navigation method)
- [ ] Requirement 11.3 (theme switcher in button bar → top right corner)
- [ ] Requirement 11.4 (references to button bar)
- [ ] Requirement 13.5 (Tailwind CSS v4 → actual styling approach)

### Design Document
- [ ] Technology Stack section (Tailwind CSS)
- [ ] HomeScreen component description (button bar)
- [ ] Any other button bar references

### Tasks Document
- [ ] Task 15.4 (HomeScreen layout description)
- [ ] Task 16.4 (ButtonBar component - mark obsolete or remove)

### Decision Records to Create
- [ ] 003-word-list-count.md (if choosing 150 words)
- [ ] 004-inline-styles.md (if choosing inline styles over Tailwind)

---

## Verification Checklist

After updates, verify:
- [ ] All requirements match implementation
- [ ] Design document matches requirements
- [ ] Tasks match design document
- [ ] Decision records exist for all intentional deviations
- [ ] No orphaned references to removed features (button bar)
- [ ] Implementation notes are consistent with requirements

