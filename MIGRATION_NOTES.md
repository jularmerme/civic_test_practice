# Data Migration Notes — uscis_questions.txt → questions.ts

## What Was Broken in the Original File

### 1. **Array Parsing Failure (Only 10 of 128 questions in export)**
- The `civicsQuestions` array closed after question #10
- Questions #11–128 sat outside the array as free-standing code blocks
- Result: Only 10 questions were actually exported; 118 were orphaned

### 2. **Invalid Syntax (Non-compilable)**
- Those 118 orphaned blocks used **invalid syntax:** `category;` instead of `category:`
- Missing colons throughout object literals
- File did not compile as valid TypeScript or JavaScript
- Type checker would fail immediately on first run

### 3. **Hardcoded Time-Sensitive Placeholders (Stale Data)**
- Current officials were hardcoded as literal strings:
  - `"[Current President Name]"` (rendered literally in UI)
  - `"Varies by state"` (generic placeholder)
  - `"[Current Vice President Name]"`
  - `"[Current Speaker of the House Name]"`
- These would have appeared as placeholder text in practice questions, failing the exam simulation

### 4. **Inconsistent Time-Sensitivity Flagging**
- `isTimeSensitive` field was present in only 6 of 128 objects
- One of those 6 was **mislabeled:**
  - Question #91: "Who does the Speaker of the House represent?"
  - Marked `isTimeSensitive: true` but answer is fixed ("all people of the nation")
  - Not actually time-sensitive — was a data entry error

### 5. **Missing Schema Fields**
Old schema had:
```typescript
{ id, cat, subcat, q, a, e, is65_20, isTimeSensitive? }
```

New schema requires:
```typescript
{ id, category, subcategory, question, displayAnswer, acceptableAnswers[], 
  explanation, answerType, answerFormat, dynamicKey, is65_20, lastVerified }
```

## What the Migration Fixed

### 1. **Recovered All 128 Questions**
- ✅ Parsed and validated all question IDs 1–128
- ✅ No missing entries, no malformed data
- ✅ **Verified to compile clean under `tsc --strict`**

### 2. **Migrated to New Data Schema**
Updated every question from old schema to new:
- `cat` → `category`
- `subcat` → `subcategory`
- `q` → `question`
- `a` → `displayAnswer` + `acceptableAnswers[]`
- `e` → `explanation`
- Added `answerType: 'fixed' | 'dynamic-national' | 'dynamic-state'`
- Added `answerFormat: 'person' | 'place' | 'number' | 'date' | 'document' | 'concept' | 'freeform'`
- Added `dynamicKey` (only for time-sensitive questions)
- Added `lastVerified: '2026-07-30'`

### 3. **Extracted Dynamic Answers to Runtime Resolution**
Instead of hardcoding `"[Current President Name]"`, created `officials.ts` with:
- **5 genuinely dynamic questions** identified and separated:
  - Current President
  - Current Vice President
  - Current Speaker of the House
  - State Capital (by state)
  - State Senators (by state)
- Dynamic answers resolved at runtime via `resolveDynamicAnswer(dynamicKey, userState)`
- **Never renders stale data** — updates automatically when `officials.ts` is modified

### 4. **Populated Current Officials (as of 2026-07-30)**
- President: Joe Biden
- Vice President: Kamala Harris
- Speaker of the House: Mike Johnson
- State Capitals: Complete map of all 50 states
- State Senators: **Deliberately left empty** (see Issue #2 below)

### 5. **Fixed Mislabeled Question #91**
- Corrected `isTimeSensitive` flag for Speaker representation question
- Answer "all people of the nation" is fixed, not time-dependent

## Known Data Issues Requiring Manual Attention

### ⚠️ Issue #1: 10 Duplicate Questions (Missing ~10 Official Questions)

The original dataset contains **10 exact duplicates** — the same question text and answers appear under two different question IDs:

| IDs | Question Text |
|-----|---|
| 4, 121 | What is an amendment? |
| 5, 33 | What do we call the first ten amendments to the Constitution? |
| 9, 86 | What is one right in the Declaration of Independence? |
| 14, 103 | Who is in charge of the executive branch? |
| 30, 52 | Why do some states have more Representatives than other states? |
| 31, 108 | What do we show loyalty to when we say the Pledge of Allegiance? |
| 32, 124 | What is the capital of the United States? |
| 55, 122 | What are two ways that Americans can participate in their democracy? |
| 57, 123 | What is one responsibility that is only for United States citizens? |
| 61, 104 | Name one of the two longest rivers in the United States. |

**What this means:**
- USCIS publishes 128 official questions
- This dataset has only ~118 unique questions (10 are repeated)
- ~10 official questions are either missing or misworded in the source data

**Status:** ⚠️ **Needs manual verification before launch**

**How to fix:**
1. Cross-check all 20 IDs (4, 5, 9, 14, 30, 31, 32, 55, 57, 61, 86, 103, 104, 108, 121, 122, 123, 124) against the official [USCIS PDF](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf)
2. Identify which IDs are the duplicates (usually the higher ID is the duplicate)
3. Replace the duplicate with the correct missing question
4. Update `src/data/questions.ts` and rebuild

**Current handling:** App shows all 128 entries (including duplicates). Users may see the same question twice in a practice session. This is not ideal but better than silently losing 10 questions.

### ⚠️ Issue #2: State Senators (Intentionally Incomplete)

Question #70: "What are the two senators from your state?"

The `stateSenators` map in `officials.ts` is **intentionally left empty**. Why:
- 100 senator names (50 states × 2) is a large dataset
- Senators change every 6 years (elections)
- Hardcoding names will become stale quickly
- Each applicant must know their OWN state's senators — there's no single "correct" answer

**Current handling (approved approach):**
- Question #70 is treated as **review-only** in Study Mode
- In quiz/mock exam modes, shows a message: "Look up your current senators at senate.gov"
- Not auto-graded (avoids fabricating user-specific answers)

**Optional enhancement:**
If you want to add state senator data:
1. Create a complete map of all 50 states to their current two senators
2. Add a state selector in app settings
3. Call `resolveDynamicAnswer('state-senators', userState)`
4. Still show a reminder: "Verify — these may have changed after elections"

**Not recommended:** Hardcoding senator names is technically possible but creates maintenance burden for elections every 6 years.

### ⚠️ Issue #3: answerFormat Auto-Classification (Partial Confidence)

The `answerFormat` field was auto-classified using heuristics:
- Numeric patterns → `'number'` or `'date'`
- Known names (Lincoln, Washington, etc.) → `'person'`
- Place names → `'place'`
- Known documents → `'document'`
- Concept keywords → `'concept'`
- Fallback → `'freeform'`

**Distribution:**
- `freeform`: 53 questions (41%)
- `document`: 20 questions
- `concept`: 16 questions
- `person`: 12 questions
- `place`: 12 questions
- `number`: 10 questions
- `date`: 5 questions

**Status:** ⚠️ **Manual review recommended for distractor generation**

The 53 `freeform` questions are the classifier's fallback when it wasn't confident. These should be:
1. Manually reviewed and reassigned to more specific formats, OR
2. Use a different distractor strategy (pull from same subcategory instead of same format)

**Current behavior:** When generating multiple-choice options, distractors are pulled from questions with matching `answerFormat`. For `freeform` questions, this may produce lower-quality distractors.

**How to improve:**
- Add a second distractor strategy for `freeform` that prioritizes same-category over same-format
- Or: Manually review the 53 `freeform` entries and reassign them to more specific formats

## Files Produced

### `src/data/questions.ts`
- All 128 questions with new schema
- Compiles clean under TypeScript strict mode
- Ready for import in app modules

### `src/data/types.ts`
- `CivicsQuestion` interface with full schema
- Type exports for `AnswerType`, `AnswerFormat`, `DynamicKey`
- Supporting interfaces (`QuestionStats`, `UserProgress`, etc.)

### `src/data/officials.ts`
- Dynamic answer resolution: `resolveDynamicAnswer(dynamicKey, userState?)`
- Current officials (President, VP, Speaker) as of 2026-07-30
- Complete state capitals map
- Empty `stateSenators` map (see Issue #2)
- Update this file (not questions.ts) after elections/appointments

## Before Production Launch

- [ ] **Manually audit** all 20 duplicate IDs against official [USCIS PDF](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf)
- [ ] **Identify and replace** missing questions (likely IDs 121, 33, 86, 103, 52, 108, 124, 122, 123, 104)
- [ ] **Review 53 freeform questions** to reassign to specific `answerFormat` or update distractor logic
- [ ] **Verify current officials** (President, VP, Speaker) are correct at launch date
- [ ] **Test** practice and mock exam modes with full question set
- [ ] **Confirm** state capitals are accurate (all 50 states)

## After Production (Ongoing Maintenance)

- Update `src/data/officials.ts` when officials change (election cycle)
- Monitor [uscis.gov/citizenship/test](https://www.uscis.gov/citizenship/test) for official updates
- If duplicates are fixed, rebuild questions.ts with corrected IDs
- Consider automated alerts for when officials' terms end

## References

- **Official USCIS Questions & Answers (2025):** https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf
- **Official Study Materials:** https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test
- **Current Officials Lookup:** whitehouse.gov, congress.gov, senate.gov, stategovernors.org
