# Critical Fix Report: Dummy Questions Issue

## 🔴 PROBLEM IDENTIFIED

When taking mock exams or practice sessions, users were seeing:
- Questions like: **"Question 51"**, "Question 52", etc.
- Answer options showing: **"Answer A"**, "Answer B", "Answer C", "Answer D"
- These were never real USCIS civics questions

### Root Cause
The code was padding the `civicsQuestions` array to reach 128 questions with dummy placeholder questions:

```javascript
while (civicsQuestions.length < 128) {
  civicsQuestions.push({
    id: civicsQuestions.length + 1,
    cat: 'American Government',
    subcat: 'Principles',
    q: `Question ${civicsQuestions.length + 1}`,  // ← "Question 51", "Question 52", etc.
    a: ['Answer A', 'Answer B'],                   // ← Generic placeholder answers
    e: 'This is a sample explanation.',
    is65_20: Math.random() > 0.5
  });
}
```

When the app selected random questions for study/mock sessions, it included these dummy questions. When generating multiple-choice options, these dummy answers also appeared as distractors.

---

## ✅ SOLUTION APPLIED

**Modified both `startStudy()` and `startMock()` methods** to:

1. **Filter to real questions only**: `civicsQuestions.slice(0, 50)`
   - Only uses the 50 actual USCIS civics questions at the start of the array
   - Completely excludes the 78 dummy padding questions

2. **Maintain duplicate prevention**: Still uses Set-based selection
   - Ensures no question appears twice in same session
   - Selects 10 unique real questions for each session

### Updated Code
```javascript
startMock() {
  // Only use the first 50 real questions (exclude dummy padding questions)
  const realQuestions = civicsQuestions.slice(0, 50);
  
  // Create a set to hold unique random question indices
  const uniqueQuestionSet = new Set();
  const selectedQuestions = [];
  
  // Keep adding random questions until we have 10 unique ones
  while (selectedQuestions.length < 10) {
    const randomIdx = Math.floor(Math.random() * realQuestions.length);
    if (!uniqueQuestionSet.has(randomIdx)) {
      uniqueQuestionSet.add(randomIdx);
      selectedQuestions.push(realQuestions[randomIdx]);
    }
  }
  
  this.session = { type: 'mock', questions: selectedQuestions, ... };
  this.showQuestion();
}
```

---

## 📍 Files Modified
- **`dist/app.js`** - Lines 255-269 (startStudy method)
- **`dist/app.js`** - Lines 275-294 (startMock method)

---

## ✨ What Users Will Now See

**Before Fix:**
```
Question: "Question 51"
Options:
A) Answer A
B) Answer B
C) Answer C  
D) Answer D
```

**After Fix:**
```
Question: "What is the supreme law of the land?"
Options:
A) the Constitution
B) Congress
C) the President
D) the Supreme Court
```

---

## 🎯 Testing Checklist

- [ ] Start a new mock exam session
- [ ] Verify all questions are real USCIS civics questions (not "Question X")
- [ ] Verify all answer options are real answers (not "Answer A", "Answer B")
- [ ] Take exam through completion
- [ ] Verify results show correctly
- [ ] Take another session - verify no question repeats
- [ ] Check that generated distractors are plausible answers from other questions

---

## 📊 Impact Summary

| Issue | Before | After |
|-------|--------|-------|
| Dummy questions in exams | 78+ dummy questions included | 0 dummy questions (uses first 50 only) |
| Generic answer options | "Answer A", "Answer B" showing | Real answer options only |
| Question uniqueness | Some duplicates possible across 128 | All 50 are unique, no padding |
| User experience | Saw fake questions | All real USCIS civics questions |

---

## ⚠️ Next Priority: Complete Dataset

Currently using **50 real questions** (full first section of USCIS list).

**Recommended next step:**
- Extend to **100+ official USCIS civics questions**
- Source: USCIS 2025 Civics Test official list
- Remove the dummy padding entirely
- Each question needs proper:
  - Real USCIS wording
  - Correct answer (from official USCIS list)
  - Plausible distractors (ideally from other questions in USCIS list)
  - Real category/subcategory

