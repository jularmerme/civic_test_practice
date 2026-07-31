# RATIFY Refactor — In Progress

## Completed ✅

1. **dynamicAnswers.json** — Created with all 50 states + DC + national officials
2. **questionUtils.js** — All helper functions:
   - `resolveQuestion()` — resolves dynamic Q's with state context
   - `normalizeAnswer()` — case/punctuation/article insensitive matching
   - `isAnswerCorrect()` — validates user answers
   - `escapeHtml()` — XSS prevention
   - `shuffleArray()` — Fisher-Yates shuffle
   - `getRandomQuestions()` — deduped by normalized text
   - `generateDistractors()` — uses `answerFormat` from schema
   - `countCorrect()` — accurate scoring by question ID
   - `buildMultipleChoice()` — 1 correct + 3 distractors

3. **app.js critical bug fixes:**
   - ✅ 1.1: `alert()` → `notify()` (prevents infinite recursion)
   - ✅ 1.2: `toggleDark()` split → `toggleDarkMode()` + `toggleDarkFromSettings()`
   - ✅ 1.5: `escapeHtml()` method added; answer text escaped
   - ✅ Added `prefs.state` for dynamic state questions
   - ✅ Updated header button to use new `toggleDarkMode()`

## Remaining Critical Fixes (Priority Order)

### BLOCKING (ship breaks without these)
- [ ] 1.3: Add dark theme CSS variables to index.html (`.dark` mode currently has no rules)
- [ ] 1.4: Restyle Settings with RATIFY CSS (currently uses Tailwind classes that don't exist)
- [ ] 1.6: Remove fake dashboard stats → show real data from storage or empty states
- [ ] 1.7: Implement `resolveQuestion()` calls before any MC generation
- [ ] 1.10: Implement mock exam early-stop logic (12 correct = pass, 9 incorrect = fail)

### HIGH (breaks features)
- [ ] 1.8: Fix `countCorrect()` — use new implementation from questionUtils.js
- [ ] 1.9: Implement Study flashcard mode (separate from MC)
- [ ] 1.13: Extract all CSS from JS strings to `/styles/` directory
- [ ] 1.14: Fix nested HTML (div onclick with button inside)
- [ ] 1.12: Replace biased shuffle with `shuffleArray()` from questionUtils.js

### MEDIUM (performance/UX)
- [ ] Extract questions.js → questions.json (lazy load)
- [ ] Move helpers to data/questionUtils.js
- [ ] Add dark theme CSS rules to index.html
- [ ] Add state selector to Settings
- [ ] Add 65/20 questions validation (min 20 for mock exams)
- [ ] Implement validation script: validate-questions.js

### LOW (polish)
- [ ] 1.15: i18n framework for language selector
- [ ] 1.16: Track mastery properly (attempts/correct/ratio)
- [ ] Add preconnect/font optimization
- [ ] Semantic HTML + ARIA labels

---

## What NOT to Touch
- Visual brand (colors, fonts, layout)
- All 6 study modes (Study, Practice, Category, 65/20, Mock Std, Mock 65/20)
- Dashboard stat cards (keep shell, populate with real data)
- Stamp animation, sticky header

---

## Next: Critical Path to Shippable

1. **Dynamic question resolution** (1.7)
   - Load dynamicAnswers.json
   - Call `resolveQuestion()` before showing MC questions
   - Test with question #65 (President)

2. **Fix scoring** (1.8, 1.10)
   - Replace `countCorrect()` implementation
   - Add early-stop logic for mock exams
   - Test 20 question mock exam stops at 12 correct

3. **Remove fake stats** (1.6)
   - Delete hardcoded dashboard numbers
   - Show real counts from `this.stats` or "—"

4. **Extract CSS** (1.13)
   - Create `/styles/app.css`
   - Move all `<style>` from JS into CSS
   - Update HTML to link stylesheet

5. **Dark mode CSS** (1.3)
   - Add `.dark` selector with full theme overrides
   - Test dark mode from home button

---

## Files Created
- ✅ `dist/data/dynamicAnswers.json` (310 lines, all 50 states + national)
- ✅ `dist/data/questionUtils.js` (150+ lines, all helpers)
- ✅ `dist/app.js` (partial fixes applied)

## Files to Create
- `dist/styles/app.css` (extract from app.js inline styles)
- `scripts/validate-questions.js` (validate schema)

## Files to Modify
- `dist/app.js` (ongoing — most critical fixes remain)
- `dist/index.html` (dark CSS, state selector, semantic HTML)
- `dist/data/questions.js` → `dist/data/questions.json` (after extract)

---

## Dependencies
- None added. Uses vanilla JS only.
- dynamicAnswers.json loaded async via fetch
- questionUtils.js imported via `<script>` before app.js

---

## Testing Checklist (for each fix)
- [ ] No console errors
- [ ] Question displays correctly
- [ ] Answer selection works
- [ ] Correct/incorrect feedback shows
- [ ] Scoring accurate
- [ ] Early-stop works (mock exams)
- [ ] Dark mode toggles all views
- [ ] Settings state selector saves
- [ ] 65/20 mode uses correct question pool
- [ ] Lighthouse mobile Performance ≥ 90, A11y ≥ 95
