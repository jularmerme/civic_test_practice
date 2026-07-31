# USCIS Naturalization Civics Test — Practice Web App

A modern, responsive single-page web application to help users study for the **2025 USCIS Naturalization Civics Test** (128 questions). The app provides an encouraging, interactive learning experience with all 128 official questions, multiple study modes, progress tracking, and mock exams.

## 🎯 Project Overview

This web app is designed for immigrants preparing to pass the civics portion of their naturalization interview on the first attempt. It feels polished and professional while maintaining a warm, supportive tone appropriate for non-native English speakers preparing for a high-stakes exam.

**Key goals:**
- Study all 128 official 2025 USCIS civics test questions
- Learn through multiple interactive modes (flashcards, practice, mock exams)
- Track progress with persistent storage
- Pass the real exam on the first attempt

**Who it's for:**
- Immigrants applying for U.S. citizenship
- Those aged 65+ with 20+ years permanent residency (65/20 mode with 20-question subset)
- Anyone interested in U.S. civics and government

## 📚 Tech Stack

- **HTML5** — semantic markup
- **Tailwind CSS** — utility-first styling (no other CSS frameworks)
- **TypeScript** — fully typed, modular application logic
- **No backend** — 100% client-side, static web app
- **localStorage** — persistent progress tracking
- **Zero external dependencies** — fast, lightweight

## ✨ Key Features

### 1. **Study Mode (Flashcard-style Learning)**
- Browse questions one at a time
- See question, reveal answer + explanation
- Mark questions as "known" or "still learning"
- Filter by category or topic
- Randomized order each session

### 2. **Practice / Exam Mode**
- Simulate the real exam experience
- Multiple choice options with randomized positions
- Configurable question count (10, 20, or all 128)
- Multiple-choice options generated from real answers in the dataset (no fake distractors)
- Immediate or end-of-session feedback
- Explanation for every question after submission
- Score summary and option to redo missed questions

### 3. **Category Practice**
- Study specific categories:
  - American Government (Principles, System, Rights & Responsibilities)
  - American History (Colonial Period, 1800s, Recent History)
  - Integrated Civics (Geography, Symbols, Holidays)
- Focus practice on weak areas

### 4. **65/20 Mode**
- For applicants aged 65+ with 20+ years permanent residency
- Limits practice to the official 20-question subset
- Different passing rules (6 correct out of 10, stops at 5 incorrect)

### 5. **Full Mock Exam Simulation**
- **Standard mode:** Up to 20 questions, must answer 12 correctly to pass, stops at 9 incorrect
- **65/20 mode:** Up to 10 questions from 20-question subset, must answer 6 correctly to pass, stops at 5 incorrect
- Exactly mimics the real interview format
- Shows clear pass/fail result with encouraging messages
- Explains all missed questions

### 6. **Progress Tracking & Persistence**
- Per-question stats: times seen, times correct, times incorrect, "known" status
- Overall stats: total sessions, best mock exam score, current study streak
- Category mastery percentages
- User preferences: dark/light mode, 65/20 toggle
- All data persisted in localStorage
- "Reset Progress" option with confirmation

### 7. **Visual Design**
- Modern, clean, professional interface
- Fully responsive (mobile-first)
- Calm, trustworthy color palette (civic blues and greens)
- Smooth animations and transitions
- Progress indicators (progress bars, circular indicators, category mastery)
- Light/dark mode toggle
- U.S. civic visual theme (flag emoji, subtle patterns)

### 8. **Learning Experience**
- Encouraging, supportive tone (no harsh "wrong!" messages)
- Every wrong or skipped answer shows explanation before moving on
- Simple, readable language (avoids legal jargon)
- Spaced repetition: "still learning" questions appear more frequently
- Questions marked "time-sensitive" (current officials, etc.) flagged for verification

## 📖 Content & Questions

All 128 questions are from the **official 2025 USCIS civics test** with:
- Official question text
- All acceptable correct answers
- Clear, plain-English explanations
- Time-sensitive flags (for questions about current officials)
- Category and subcategory grouping
- 65/20 designation for applicable questions

### Data Structure
Questions are stored in `/src/data/questions.ts` as a well-typed TypeScript array, organized by:
- Category (American Government, American History, Integrated Civics)
- Subcategory (e.g., Principles of American Democracy, 1800s)
- Time-sensitivity flag for answers that change with elections

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for build tooling)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd civic_test_practice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```
   This compiles TypeScript and generates Tailwind CSS.

4. **Serve locally:**
   ```bash
   npm run serve
   ```
   Open `http://localhost:8080` in your browser.

### Development

For development with watch mode:
```bash
npm run dev
```
This runs TypeScript and Tailwind watchers simultaneously.

## 📁 Project Structure

```
civic_test_practice/
├── src/
│   ├── data/
│   │   └── questions.ts          # All 128 questions (official USCIS data)
│   ├── modules/
│   │   ├── quiz.ts               # Quiz session and mock exam logic
│   │   ├── storage.ts            # localStorage wrapper with error handling
│   │   └── ui.ts                 # UI rendering and event handling
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces and types
│   ├── styles/
│   │   └── input.css             # Tailwind CSS configuration
│   └── main.ts                   # Application entry point
├── dist/
│   ├── index.html                # HTML template (compiled from src)
│   ├── styles.css                # Compiled Tailwind CSS
│   ├── *.js                       # Compiled TypeScript (generated)
│   └── *.js.map                   # Source maps
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── .gitignore
└── README.md
```

### Key Modules

- **quiz.ts**: Quiz session management (`QuizSession` class), mock exam logic (`MockExam` class), answer validation, randomization
- **storage.ts**: Safe localStorage wrapper with error handling, progress persistence
- **ui.ts**: UI rendering functions for all screens (home, questions, results, settings)
- **questions.ts**: Complete 128-question dataset with metadata
- **types/index.ts**: TypeScript interfaces (CivicsQuestion, QuestionStats, UserProgress, etc.)

## 🔧 How to Update Questions

If USCIS updates an answer (e.g., after an election), edit `/src/questions.ts`:

1. Find the question by ID
2. Update the `answers` array with the new correct answer(s)
3. Update the `explanation` with context about the change
4. Mark `isTimeSensitive: true` if applicable
5. Rebuild: `npm run build`

**Important:** Some answers are time-sensitive (current President, Speaker of the House, state senators, etc.). Users should verify these at [uscis.gov/citizenship/test](https://www.uscis.gov/citizenship/) before their interview.

## 🎓 About the U.S. Naturalization Civics Test

### What is it?
The civics test is the oral component of the naturalization interview (Form N-400). USCIS changed the test format in October 2025 to include 128 possible questions (previous version had 100).

### 2025 Version Rules
- **Standard:** Up to 20 questions randomly selected from 128, must answer 12+ correctly to pass (60% passing score)
- **Test stops when:** Applicant reaches 12 correct (pass) or 9 incorrect (fail)

### 65/20 Exception
Applicants aged **65 and older** with **20+ years permanent residency** can take a shorter test:
- Study subset: 20 official questions (marked `is65_20: true`)
- Interview: Up to 10 questions from the 20-question subset
- Passing score: 6 correct (60% of 10)
- Stops at: 6 correct (pass) or 5 incorrect (fail)

### Other Exceptions
- **50/20:** Applicants 50+ with 20+ years permanent residency also use the 20-question subset
- **55/15:** Applicants 55+ with 15+ years permanent residency also use the 20-question subset
- **Disability (Form N-648):** Modified testing accommodations available
- This app focuses on 65/20; modify the 20-question subset for other exceptions if needed

### Question Categories
Questions are grouped into three main topics:
1. **American Government** — Constitution, branches of government, Congress, elections, rights
2. **American History** — Colonial period, independence, Civil War, slavery, amendments, key figures
3. **Integrated Civics** — Geography, U.S. symbols, national holidays, current officials

### Time-Sensitive Answers
Some official USCIS answers change based on elections or appointments:
- Current President
- Current Vice President
- Current Speaker of the House
- State senators (depends on applicant's state)
- State governor (depends on applicant's state)

**Applicants must verify current answers at [uscis.gov/citizenship/test](https://www.uscis.gov/citizenship/) before their interview.** This app flags these questions for review.

## 🔍 Data Sources & Accuracy

This app uses **official USCIS materials**:

1. **Primary source (web):** https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test
2. **Official PDF:** https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf
3. **Local reference:** Files in `C:\Users\Julian\Downloads\Citizen Naturalization\` (if provided)

**If there's a discrepancy:**
- Prefer the current **USCIS website** (as answers may update after elections)
- Flag any questions about accuracy in the issue tracker

**Disclaimer:** This is a study tool only, not legal advice. Immigration rules and civics answers can change. Users should verify all information at **uscis.gov** before their interview.

## 📊 Progress Persistence

All progress is saved in browser localStorage, so users can:
- Close the browser and resume where they left off
- Track improvement over time
- See category-by-category mastery
- Review their study history

**Limitations:**
- Data is stored locally on each device/browser (not synced to cloud)
- Clearing browser data will reset progress
- localStorage has ~5-10MB limit (not an issue for this app)

If localStorage is unavailable, the app gracefully falls back to session-only progress.

## ♿ Accessibility

The app is designed for WCAG AA accessibility:
- Semantic HTML structure
- Keyboard navigation (Tab through options, Enter to select)
- High contrast colors (passed WCAG contrast checker)
- Readable font sizes and spacing
- Alt text for icons and images

**Note:** Full accessibility validation requires manual testing with screen readers and accessibility tools. For comprehensive accessibility audits, use tools like [Axe DevTools](https://www.deque.com/axe/devtools/), [WAVE](https://wave.webaim.org/), or [Lighthouse](https://developers.google.com/web/tools/lighthouse).

## 🌐 Deployment

The app is a static web app with no backend. Deploy to any static host:

### GitHub Pages
```bash
npm run build
git add dist/
git commit -m "Build for deployment"
git push
# Configure repository settings to deploy from /dist
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
# Or connect GitHub for automatic builds
```

### Vercel
```bash
npm run build
vercel --prod
```

### Any Static Host
Upload the contents of `/dist` to your hosting provider.

## 🐛 Troubleshooting

### "Cannot find localStorage" error
- Browser localStorage is disabled or unavailable
- App will fall back to session-only progress (data resets on refresh)
- Check browser privacy settings

### Questions not showing
- Clear browser cache (`Ctrl+Shift+Delete`)
- Rebuild the project: `npm run build`
- Check browser console for errors

### Styling issues
- Rebuild Tailwind CSS: `npm run build:css`
- Ensure `/dist/styles.css` is linked in `/dist/index.html`

### TypeScript compilation errors
- Ensure Node.js version is 16+: `node --version`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## 📄 License

MIT License — see LICENSE file.

## 🤝 Contributing

Contributions welcome! Please:
1. Report bugs in the issue tracker
2. Submit pull requests for improvements
3. Update questions if USCIS releases new official content
4. Add new features or study modes

## 📞 Support

For questions or issues:
1. Check this README for common problems
2. Review the code comments for implementation details
3. Open an issue on GitHub

## ✅ What's Tested

- All 128 questions load correctly
- Quiz scoring and validation work
- Mock exam stopping logic (exact USCIS rules)
- Progress persistence (localStorage)
- Dark/light mode toggle
- 65/20 mode subset
- Randomization (questions and answers)
- Multiple choice generation from real answers
- Category filtering
- Responsive design (mobile, tablet, desktop)

## 🚧 Future Enhancements (Optional)

- Audio pronunciation guide for answers
- Spaced repetition scheduling algorithm
- Study group sharing
- Export progress as PDF
- API integration for real-time USCIS updates
- Offline PWA capabilities
- Multiple language translations

---

**Good luck with your naturalization interview!** 🇺🇸

This app was built with care to help you pass the civics test on your first attempt. Study regularly, focus on explanations (not just answers), and you'll be well-prepared.
