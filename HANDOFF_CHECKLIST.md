# Refactor Handoff — Next Developer Checklist

## What Was Done This Phase ✅

- [x] Created `dist/data/dynamicAnswers.json` (310 lines, all 50 states + officials)
- [x] Created `dist/data/questionUtils.js` (150+ lines, all helpers)
- [x] Fixed bug 1.1 (infinite alert recursion)
- [x] Fixed bug 1.2 (toggleDark split methods)
- [x] Fixed bug 1.5 (XSS escapeHtml)
- [x] Fixed bug 1.6 (removed fake dashboard stats)
- [x] Fixed bug 1.10 (mock exam early-stop logic)
- [x] Updated index.html to load questionUtils.js
- [x] Added dark mode CSS variables (html.dark)
- [x] Created scripts/validate-questions.js
- [x] Added prefs.state field for dynamic state questions
- [x] Created REFACTOR_STATUS.md, REFACTOR_WORK_SUMMARY.md, HANDOFF_CHECKLIST.md

---

## What Needs to Be Done (Next Priority Order)

### 🚨 BLOCKING (don't ship without these)

#### 1. Bug 1.3/1.4: Dark mode CSS rules
**Time: 30 min**
- [ ] Test dark mode toggle works on home page
- [ ] Verify all 6 views (home, study, practice, mock, results, settings) switch to dark theme
- [ ] Check colors are readable (enough contrast)
- [ ] Verify card backgrounds, text colors, shadows all visible

**How to test:**
```bash
npm run build && npm run serve
# Click 🌙 button → check all views
# Check color contrast with WebAIM
```

#### 2. Bug 1.7: Dynamic question resolution
**Time: 45 min**
- [ ] Import `resolveQuestion` from questionUtils.js into app.js
- [ ] Call `resolveQuestion()` on all dynamic questions before MC generation
- [ ] Test question #65 (President) shows current name
- [ ] Test question #62 (state capital) shows correct capital based on prefs.state
- [ ] Test question #70 (state senators) shows correct senators

**How to test:**
```bash
# In browser console:
console.log(civicsQuestions[64])  // Q65, check if resolved
# Practice mode → navigate to Q65 → verify displays "Joseph R. Biden Jr."
```

#### 3. Bug 1.4: Settings page (restyle + state selector)
**Time: 1 hour**
- [ ] Remove all Tailwind classes from showSettings() HTML
- [ ] Restyle with RATIFY CSS variables (use existing `.header`, `.stat-card` patterns)
- [ ] Add state dropdown (all 50 states + DC)
- [ ] Wire state selector to `setUserState()` method
- [ ] Test state selection saves to localStorage
- [ ] Test Q62 updates when state changes

#### 4. Bug 1.13: Extract CSS to external file
**Time: 1 hour**
- [ ] Create `dist/styles/app.css`
- [ ] Copy all `<style>` content from showQuestion() into CSS file
- [ ] Copy all `<style>` content from showResults() into CSS file
- [ ] Link stylesheet in index.html `<head>`
- [ ] Remove `<style>` blocks from app.js
- [ ] Test: no visual regressions

---

### 🔴 HIGH PRIORITY (breaks features, do next)

#### 5. Bug 1.9: Study flashcard mode
**Time: 1 hour**
- [ ] Separate Study UI from MC mode
- [ ] Show: question → [tap to reveal] → answer + explanation → prev/next
- [ ] Remove multiple choice from Study
- [ ] Test Study mode: card flips correctly

#### 6. Bug 1.8: Fix countCorrect()
**Time: 15 min**
- [ ] Replace current countCorrect logic with `countCorrect()` from questionUtils.js
- [ ] Ensure mock exam scoring is accurate

#### 7. Bug 1.14: Fix nested HTML
**Time: 20 min**
- [ ] Replace nested divs/buttons with single button per card
- [ ] Remove `href="#"` from links
- [ ] Use `data-action` attributes instead of inline onclick where possible

---

### 🟡 MEDIUM PRIORITY (performance + polish)

#### 8. Integrate 65/20 mode
**Time: 30 min**
- [ ] Wire 65/20 toggle to use `get65_20Questions()`
- [ ] Verify 65/20 pool has ≥20 questions (use validate-questions.js)
- [ ] Show pool size in UI when 65/20 mode selected
- [ ] Test mock exam uses correct pool

#### 9. Settings page: Add prefs.lang field
**Time: 20 min**
- [ ] Add language dropdown (EN, ES, FR placeholders)
- [ ] Wire to `prefs.lang`
- [ ] (Actual translations not needed yet, just framework)

#### 10. Performance: Extract questions.js → questions.json
**Time: 1 hour**
- [ ] Convert questions.js to JSON array
- [ ] Create lazy loader in app.js to fetch on first session start
- [ ] Remove blocking `<script src="./data/questions.js">` from HTML
- [ ] Test homepage loads instantly

---

## Files to Know

### Data Files
- `dist/data/dynamicAnswers.json` ← National + state officials (update when they change)
- `dist/data/questionUtils.js` ← All helpers (don't modify unless fixing bugs)
- `dist/data/questions.js` ← 128 questions (read-only, controlled by spec)
- `scripts/validate-questions.js` ← Run before shipping

### App Files  
- `dist/app.js` ← Main app logic (most fixes here)
- `dist/index.html` ← HTML structure + CSS variables
- `dist/styles/app.css` ← (To be created) Extracted CSS

### Documentation
- `REFACTOR_STATUS.md` ← Current status tracking
- `REFACTOR_WORK_SUMMARY.md` ← Technical details of what was done
- `HANDOFF_CHECKLIST.md` ← This file

---

## Testing Checklist (For Each Fix)

After completing each section above, run:

```bash
npm run build
npm run serve
node scripts/validate-questions.js
```

Then in browser (http://localhost:8080):
- [ ] No console errors (F12 → Console)
- [ ] Home page loads correctly
- [ ] All 6 mode cards visible
- [ ] Dark mode toggle works (🌙 button)
- [ ] Practice mode: questions display, answers selectable
- [ ] Mock exam: stops at 12 correct or 9 incorrect
- [ ] Results page: shows correct score
- [ ] Settings page: state selector, dark mode, reset buttons all visible
- [ ] Mobile responsive (375px width): no layout breaking

---

## How to Run Validation

```bash
# Before shipping, always run:
node scripts/validate-questions.js

# Expected output:
# ✅ All checks passed!
#    • 128 questions, IDs 1-128 unique
#    • Fixed questions have answers
#    • Dynamic questions properly structured
#    • 65/20 pool: XX questions
#    • National officials: current
#    • dynamicAnswers.json: up to date
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/ratify-refactor

# As you complete each section:
git add dist/app.js dist/index.html
git commit -m "Fix bug X.Y: [description]"

# Before merge, run validation
node scripts/validate-questions.js
npm run build

# All tests pass?
git push origin feature/ratify-refactor
# Create PR for review
```

---

## Known Limitations (Not Bugs)

- Study mode: Currently also uses 10 questions like practice (OK, just not MC)
- Category mode: Button says "coming soon" (not in scope)
- 65/20 Mode: Button exists but may not be wired (wire it in task #8)
- Language selector: UI exists, translations not implemented (framework only)
- State selectors: None exist yet; create them in task #3 (Settings)

---

## Questions?

- **Data structure:** See `REFACTOR_WORK_SUMMARY.md` → "Architecture Changes"
- **Bug details:** See `REFACTOR_STATUS.md` → individual bug descriptions
- **Helper functions:** See `dist/data/questionUtils.js` → all documented inline
- **Validation logic:** See `scripts/validate-questions.js` → checks listed

---

## Success Criteria (You're Done When...)

- [ ] All 5 BLOCKING tasks completed
- [ ] All 3 HIGH tasks completed
- [ ] `node scripts/validate-questions.js` passes
- [ ] No console errors in any view
- [ ] Dark mode works on all views
- [ ] Mock exam stops early correctly
- [ ] Q62, Q65, Q70, etc. resolve with correct data
- [ ] Lighthouse mobile: Performance ≥90, A11y ≥95, SEO ≥90
- [ ] All 128 questions have working MC options with proper distractors

---

**Status:** Ready for next developer  
**Phase:** Data infrastructure complete; critical bug fixes in progress  
**Estimated time to complete:** 5-8 hours total  
**Blocker count:** 4 blocking issues → 0

Good luck! 🚀
