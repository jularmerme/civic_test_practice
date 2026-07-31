# Component Reference - Premium Design Elements

Quick copy-paste reference for all premium components used in this project.

## Color Palette

```css
:root {
  --dark-navy: #1e3a5f;
  --gold: #b8860b;
  --accent-gold: #d4a574;
  --sage-green: #6b9080;
  --light-cream: #f5f1ed;
  --error-red: #dc2626;
  --success-green: #065f46;
}
```

---

## 🔘 Buttons

### Primary Button (Gold)
```html
<button class="btn-gold">Next Question →</button>
```

```css
.btn-gold {
  background-color: #b8860b;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-gold:hover {
  background-color: #9a6f0c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

.btn-gold:active {
  transform: translateY(0);
}
```

### Outline Button
```html
<button class="btn-outline">Review Missed (3)</button>
```

```css
.btn-outline {
  border: 2px solid #1e3a5f;
  color: #1e3a5f;
  background: transparent;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background-color: #1e3a5f;
  color: white;
}
```

---

## 📊 Circular Progress

### Large Circle (Score Display)
```html
<div class="circle-progress">
  <div class="circle-progress-text">
    <div class="percentage">85%</div>
    <div class="label">17 / 20 CORRECT</div>
  </div>
</div>
```

```css
.circle-progress {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #6b9080 0deg,
    #6b9080 306deg,
    #e5e7eb 306deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.circle-progress::before {
  content: '';
  position: absolute;
  inset: 8px;
  background: #f5f1ed;
  border-radius: 50%;
}

.circle-progress-text {
  position: relative;
  z-index: 10;
  text-align: center;
}

.circle-progress-text .percentage {
  font-size: 48px;
  font-weight: 700;
  color: #6b9080;
}

.circle-progress-text .label {
  font-size: 12px;
  color: #1e3a5f;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
}
```

### Seal Badge (Pass/Fail)
```html
<div class="seal-badge">
  <div>
    <div style="font-size: 48px; margin-bottom: 4px;">✓</div>
    <div class="seal-badge-text">PASSED</div>
    <div class="seal-badge-subtext">civics mock exam</div>
  </div>
</div>
```

```css
.seal-badge {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid #1e3a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.seal-badge-text {
  text-align: center;
  font-weight: 700;
  color: #1e3a5f;
  font-size: 24px;
  margin-bottom: 4px;
}

.seal-badge-subtext {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b9080;
}
```

---

## 📈 Progress Bars

### Category Progress
```html
<div class="progress-bar-container">
  <div class="progress-bar-label">American Government</div>
  <div class="progress-bar-fill">
    <div class="progress-bar-inner" style="width: 92%;"></div>
  </div>
  <div class="progress-bar-percentage">92%</div>
</div>
```

```css
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.progress-bar-label {
  min-width: 150px;
  font-weight: 600;
  color: #1e3a5f;
}

.progress-bar-fill {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background: linear-gradient(to right, #6b9080, #d4a574);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-bar-percentage {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #6b9080;
}
```

---

## 🃏 Answer Cards

### Multiple Choice Option
```html
<button class="answer-card" onclick="selectAnswer(this)">
  <div class="answer-letter">A</div>
  <div class="answer-text">The Revolutionary War</div>
</button>
```

```css
.answer-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
}

.answer-card:hover {
  border-color: #d4a574;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.2);
}

.answer-card.selected {
  border-color: #6b9080;
  background: #f0f4f3;
}

.answer-card.correct {
  border-color: #6b9080;
  background: #e8f4f1;
  border-left: 4px solid #6b9080;
}

.answer-card.incorrect {
  border-color: #dc2626;
  background: #fee2e2;
  border-left: 4px solid #dc2626;
}

.answer-letter {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1e3a5f;
  flex-shrink: 0;
}

.answer-card.selected .answer-letter {
  background: #6b9080;
  color: white;
}

.answer-text {
  flex: 1;
  font-weight: 500;
  color: #1e3a5f;
}

.answer-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #6b9080;
  color: white;
}
```

---

## 💬 Explanation Box

```html
<div class="explanation-box">
  <h4>Why this is correct</h4>
  <p>Other accepted answers include the Mexican-American War, the Civil War, and the Spanish-American War. The War of 1812 is remembered as the conflict that produced "The Star-Spangled Banner."</p>
</div>
```

```css
.explanation-box {
  border-left: 4px solid #6b9080;
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  margin-top: 16px;
}

.explanation-box h4 {
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 8px;
  font-size: 16px;
}

.explanation-box p {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}
```

---

## 📊 Stat Cards

```html
<div class="stat-card">
  <div class="stat-value">62/128</div>
  <div class="stat-label">Questions Mastered</div>
</div>
```

```css
.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}
```

---

## 🏷️ Badges & Labels

### Question Category Badge
```html
<div class="question-badge">AMERICAN HISTORY - THE 1800S</div>
```

```css
.question-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b8860b;
  margin-bottom: 12px;
}
```

### Result Badge (Correct/Incorrect)
```html
<span class="result-badge correct">CORRECT</span>
<span class="result-badge incorrect">INCORRECT</span>
```

```css
.result-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border-radius: 4px;
}

.result-badge.correct {
  background: #e8f4f1;
  color: #065f46;
}

.result-badge.incorrect {
  background: #fee2e2;
  color: #991b1b;
}
```

---

## 🎯 Question Review Item

```html
<div class="question-review">
  <h3>Who was President during World War I?</h3>
  <div class="review-answer incorrect">
    ● You answered: Theodore Roosevelt
  </div>
  <div class="review-answer correct">
    ● Correct answer: (Woodrow) Wilson
  </div>
  <div class="review-category">Recent American History</div>
</div>
```

```css
.question-review {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  margin-top: 16px;
}

.question-review h3 {
  color: #1e3a5f;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
}

.review-answer {
  margin: 12px 0;
  padding: 8px;
  border-left: 3px solid;
  font-size: 14px;
  line-height: 1.5;
}

.review-answer.correct {
  border-color: #6b9080;
  background: #e8f4f1;
  color: #065f46;
}

.review-answer.incorrect {
  border-color: #dc2626;
  background: #fee2e2;
  color: #991b1b;
}

.review-category {
  text-align: right;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}
```

---

## 🎨 Usage Tips

### 1. **Consistency**
Always use variables for colors:
```css
/* ❌ Avoid */
color: #b8860b;

/* ✅ Do this */
color: var(--gold);
```

### 2. **States**
Always add hover/active states:
```css
.btn-gold {
  transition: all 0.3s ease;
}

.btn-gold:hover {
  transform: translateY(-2px);
}

.btn-gold:active {
  transform: translateY(0);
}
```

### 3. **Shadows**
Use subtle shadows:
```css
/* ❌ Heavy shadow = cheap look */
box-shadow: 0 20px 40px rgba(0,0,0,0.3);

/* ✅ Soft shadow = premium look */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
```

### 4. **Spacing**
Stick to your spacing grid (4px base):
```css
padding: 16px;   /* 4 units */
gap: 12px;       /* 3 units */
margin: 24px;    /* 6 units */
```

---

## 📱 Responsive Adjustments

```css
/* Mobile-first base */
.answer-card {
  padding: 12px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .answer-card {
    padding: 16px;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .circle-progress {
    width: 240px;
    height: 240px;
  }
}
```

---

## ✨ Animation Timing

```css
/* Quick feedback (button clicks) */
transition: all 0.2s ease;

/* Smooth transitions (hover states) */
transition: all 0.3s ease;

/* Longer animations (page transitions) */
transition: all 0.5s ease;

/* Progress bars */
transition: width 0.5s ease;
```

---

## 🎯 Dark Mode (Optional)

If you want to support dark mode, add:

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #f5f1ed;
  }

  .answer-card {
    background: #2d2d2d;
    border-color: #404040;
  }

  .answer-card:hover {
    border-color: var(--gold);
  }
}
```

---

This reference provides everything you need to build premium interfaces. Copy, paste, and customize! 🚀
