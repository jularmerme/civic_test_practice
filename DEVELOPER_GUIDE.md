# Developer Guide

## Quick Start

```bash
# Install dependencies
npm install

# Build TypeScript + Tailwind CSS
npm run build

# Serve locally at http://localhost:8080
npm run serve

# Development mode (watch TS + CSS)
npm run dev
```

---

## Architecture

### Data Flow
```
questions.ts (128 official USCIS questions)
    ↓
quiz.ts (QuizSession, MockExam classes)
    ↓
ui.ts (Renders Study/Practice/Results screens)
    ↓
storage.ts (Persists progress to localStorage)
```

### Key Classes

**QuizSession** — Standard practice session
- `new QuizSession(questions[])`
- `submitAnswer(questionId, answer)` — validates against acceptableAnswers[]
- `getResults()` — full breakdown (correct/incorrect/skipped)
- `getScore()` — percentage

**MockExam** — USCIS-format exam
- `new MockExam(use65_20?, questions?)`
- `submitAnswer(qId, answer)` — returns `{ passed, finished, result }`
- Implements exact USCIS rules:
  - Standard: 20 asked, 12 to pass, 9 wrong limit
  - 65/20: 10 asked, 6 to pass, 5 wrong limit

**generateMultipleChoiceOptions(question, allQuestions)** — MC generator
- Pulls correct answer from question.displayAnswer
- Generates 3 distractors matching question.answerFormat
- Randomizes order each time (correct answer never same position)

### Types

See `src/types/index.ts`:
- `CivicsQuestion` — full question schema
- `AnswerType` = 'fixed' | 'dynamic-national' | 'dynamic-state'
- `AnswerFormat` = 'person' | 'place' | 'number' | 'date' | 'document' | 'concept' | 'freeform'
- `DynamicKey` = 'current-president' | 'current-vp' | ... | undefined
- `QuestionStats`, `UserProgress`, `PracticeSession`, `MockExamResult`

---

## Common Tasks

### Add a New Study Mode

1. **In quiz.ts:** Create a new session class if needed
   ```typescript
   export class CustomSession {
     constructor(questions: CivicsQuestion[]) { ... }
     // Implement required methods
   }
   ```

2. **In ui.ts:** Add UI rendering function
   ```typescript
   function showCustomMode() {
     const session = new CustomSession(questions);
     // Render UI, handle events
   }
   ```

3. **In main.ts:** Wire up the entry point
   ```typescript
   startCustomMode() {
     this.showCustomMode();
   }
   ```

### Update Current Officials (After Election)

1. Open `src/data/officials.ts`
2. Update `CURRENT_OFFICIALS` object:
   ```typescript
   const CURRENT_OFFICIALS = {
     president: "New Person Name",    // Update here
     vp: "New VP Name",
     speaker: "New Speaker Name",
     // ... state capitals ...
   };
   ```
3. Rebuild: `npm run build`
4. No changes needed to questions.ts — it auto-uses the new value

### Fix a Question

1. Open `src/data/questions.ts`
2. Find question by ID
3. Update fields:
   ```typescript
   {
     id: 4,
     question: "...",
     displayAnswer: "...",           // Update if needed
     acceptableAnswers: ["...", "..."],  // Update variants
     explanation: "...",             // Update explanation
     answerType: "fixed",
     // ...
   }
   ```
4. Rebuild: `npm run build`

### Add State Senator Data (Optional)

1. Open `src/data/officials.ts`
2. Populate `stateSenators` map:
   ```typescript
   stateSenators: new Map<string, string[]>([
     ["California", ["Dianne Feinstein", "Barbara Boxer"]],
     // ... all 50 states ...
   ]),
   ```
3. In UI, add state selector (Settings or during quiz)
4. When resolving Q#70, pass userState:
   ```typescript
   const answer = resolveDynamicAnswer("state-senators", userState);
   ```

### Improve answerFormat Classification

Current: 53 questions marked 'freeform' (fallback category)

Option A: Manual reassignment
- Review the 53 entries in questions.ts
- Assign more specific format (person, place, number, etc.)
- Update `answerFormat` field

Option B: Update MC generator logic
- Modify `generateMultipleChoiceOptions()` to use smart fallback:
  ```typescript
  // For freeform, prefer same-subcategory distractors
  if (question.answerFormat === 'freeform') {
    // Pull distractors from same subcategory
  }
  ```

---

## Testing

### Unit: Answer Validation
```typescript
const q = civicsQuestions[0];
const session = new QuizSession([q]);
session.submitAnswer(q.id, "the Constitution");  // Should match acceptableAnswers[0]
console.log(session.getResults().correct);  // Should be 1
```

### Integration: Mock Exam Rules
```typescript
// Standard: 20 asked, 12 to pass, 9 fail
const exam = new MockExam(false);
// Submit 9 correct, 9 wrong → should be finished, failed

// 65/20: 10 asked, 6 to pass, 5 fail
const exam65 = new MockExam(true);
// Submit 6 correct → should be finished, passed
```

### E2E: Full Session
```typescript
// Load app, click Practice Mode, answer 10 questions,
// check score displayed and stats persisted to localStorage
```

---

## File Structure

```
src/
├── data/
│   ├── questions.ts         # 128 USCIS questions
│   ├── officials.ts         # Dynamic answer resolution
│   └── types.ts             # [old, now in types/index.ts]
├── modules/
│   ├── quiz.ts              # QuizSession, MockExam classes
│   ├── storage.ts           # localStorage wrapper
│   └── ui.ts                # Render functions
├── types/
│   └── index.ts             # TypeScript interfaces
├── styles/
│   └── input.css            # Tailwind CSS input
└── main.ts                  # App entry point

dist/
├── index.html               # Compiled HTML
├── styles.css               # Compiled Tailwind CSS
├── *.js                     # Compiled TypeScript
└── *.js.map                 # Source maps

package.json                 # Build scripts
tsconfig.json               # TypeScript config
tailwind.config.ts          # Tailwind config
```

---

## Build Scripts

| Script | Purpose |
|--------|---------|
| `npm run build:css` | Compile Tailwind CSS only |
| `npm run build:ts` | Compile TypeScript only |
| `npm run build` | Both (called before deploy) |
| `npm run watch:css` | Watch Tailwind CSS files |
| `npm run watch:ts` | Watch TypeScript files |
| `npm run dev` | Watch both (runs in parallel) |
| `npm run serve` | Start dev server on :8080 |

---

## Debugging

### Console Errors

**"Cannot find module 'questions'"**
- Run `npm run build:ts` to compile TypeScript
- Check tsconfig.json includes src/**/*.ts

**"civicsQuestions is undefined"**
- questions.ts not loaded or compiled
- Check dist/*.js files exist
- Try rebuilding: `npm run build`

**"localStorage is not available"**
- Browser has privacy mode enabled or localStorage disabled
- App should gracefully fall back to session-only
- Check storage.ts try/catch blocks

### Storage Issues

```typescript
// Check what's stored
console.log(localStorage.getItem('user_progress'));

// Clear all progress
localStorage.clear();

// Reset specific data
localStorage.removeItem('question_stats');
```

### Answer Validation Issues

```typescript
// Debug why answer isn't matching
const question = civicsQuestions[0];
const userAnswer = "the Constitution";
const matches = question.acceptableAnswers.some(
  a => a.toLowerCase().trim() === userAnswer.toLowerCase().trim()
);
console.log(matches);  // Should be true
```

---

## Performance Tips

1. **Randomization:** Fisher-Yates shuffle in `shuffleArray()` is O(n)
   - Fine for 128 questions
   - But for 1000+ items, consider memoization

2. **Storage:** localStorage ~5-10MB limit
   - Current app ~50KB (questions) + ~10KB (progress)
   - Plenty of headroom; no optimization needed yet

3. **CSS:** Tailwind is configured for production
   - Only used classes compiled into dist/styles.css
   - ~50KB minified (acceptable)

---

## Maintenance Calendar

| When | Task |
|------|------|
| After federal election | Update President, VP, Speaker in officials.ts |
| After House election | Update Speaker in officials.ts |
| After Senate election | Update Senators (if added) in officials.ts |
| Annually | Check USCIS test updates at uscis.gov/citizenship/test |
| Before major release | Audit all 128 questions against official PDF |

---

## Related Files

- **README.md** — User-facing setup & feature guide
- **MIGRATION_NOTES.md** — Technical data migration & known issues
- **IMPLEMENTATION_STATUS.md** — Feature completion checklist
- **DESIGN_SYSTEM.md** (if exists) — Color palette, typography, spacing rules

---

## Support

For questions about the codebase:
1. Check code comments (each module has brief docstrings)
2. Review MIGRATION_NOTES.md for data layer details
3. Check types/index.ts for interface definitions
4. Open GitHub issues for bugs
