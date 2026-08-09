// Complete USCIS Civics Test App

// Storage
class Storage {
  get(key, def) {
    try {
      return JSON.parse(localStorage.getItem(key)) || def;
    } catch {
      return def;
    }
  }
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }
}

const store = new Storage();

// App
class App {
  constructor() {
    this.prefs = store.get('prefs', { darkMode: false, use65_20: false, state: 'CA' });
    this.stats = store.get('stats', {});
    this.session = null;
    this.allQuestions = civicsQuestions;
    this.init();
  }

  escapeHtml(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  }

  init() {
    this.applyPrefs();
    // Don't try to hide loading - it doesn't exist in new HTML
    this.showHome();
  }

  applyPrefs() {
    if (this.prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  showHome() {
    const studied = Object.keys(this.stats).length;
    document.getElementById('app').innerHTML = `
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="seal">
            <div class="seal-star"></div>
          </div>
          <div class="logo">RATIFY</div>
        </div>
        <div class="nav-links">
          <button class="nav-link" onclick="app.alert('Study mode coming soon')">Study</button>
          <button class="nav-link" onclick="app.alert('Practice mode coming soon')">Practice</button>
          <button class="nav-link active">Mock Exam</button>
          <button class="nav-link" onclick="app.alert('Progress coming soon')">Progress</button>
        </div>
        <div class="header-right">
          <button class="dark-mode-toggle" onclick="app.toggleDarkMode()">🌙</button>
          <select class="lang-select">
            <option>EN ▾</option>
            <option>ES</option>
            <option>FR</option>
          </select>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-content">
          <h3>2025 CIVICS TEST · ALL 128 OFFICIAL QUESTIONS</h3>
          <h1>Walk into your interview already knowing the answers.</h1>
          <p>Every 2025 USCIS civics question, explained in plain English — plus realistic mock interviews that stop exactly like the real one.</p>
          <div class="cta-buttons">
            <button class="btn-primary" onclick="app.startPractice()">Start Practice Session</button>
            <button class="btn-secondary" onclick="app.startMock()">Take Mock Exam</button>
          </div>
        </div>
        <div class="stamp-container">
          <div class="stamp">
            <div style="position: absolute; top: 20px; font-size: 12.5px; letter-spacing: 3px; color: var(--dark-navy); font-weight: 700; width: 100%; text-align: center;">
              UNITED STATES OF AMERICA
            </div>
            <div class="stamp-content">
              <div class="stamp-number">128</div>
              <div class="stamp-label">QUESTIONS</div>
            </div>
            <div style="position: absolute; bottom: 20px; font-size: 12.5px; letter-spacing: 3px; color: var(--dark-navy); font-weight: 700; width: 100%; text-align: center;">
              CIVICS · HISTORY · GOV
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-label">QUESTIONS MASTERED</div>
          <div class="stat-value">${studied}<span class="fraction">/128</span></div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: ${(studied / 128) * 100}%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-label">PRACTICE SESSIONS</div>
          <div class="stat-value">—<span class="fraction"> sessions</span></div>
          <div class="stat-description">Start a practice session today</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">LAST SESSION</div>
          <div class="stat-value">—</div>
          <div class="stat-description">No sessions yet</div>
        </div>

        <div class="stat-card wide">
          <div class="stat-label">FOCUS AREA</div>
          <div style="font-family: 'Source Serif 4', Georgia, serif; font-size: 22px; font-weight: 700; color: var(--dark-navy); margin-bottom: 4px;">—</div>
          <div style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Complete practice sessions to see focus area</div>
        </div>
      </div>

      <!-- Modes Section -->
      <div class="modes-section">
        <h2 class="section-title">Choose how you want to study</h2>
        <div class="modes-grid">
          <!-- Study Mode -->
          <div class="mode-card" onclick="app.startStudy()">
            <div class="mode-icon">📚</div>
            <h3 class="mode-title">Study Mode</h3>
            <p class="mode-description">Flip through cards, reveal answers and explanations</p>
            <a href="#" class="mode-link">Browse questions →</a>
          </div>

          <!-- Practice Mode -->
          <div class="mode-card" onclick="app.startPractice()">
            <div class="mode-icon">⭕</div>
            <h3 class="mode-title">Practice Mode</h3>
            <p class="mode-description">Multiple-choice sessions, shuffled every time</p>
            <a href="#" class="mode-link">Start a session →</a>
          </div>

          <!-- Category -->
          <div class="mode-card" onclick="app.alert('Category mode coming soon')">
            <div class="mode-icon">📁</div>
            <h3 class="mode-title">By Category</h3>
            <p class="mode-description">Government, History, or Integrated Civics</p>
            <a href="#" class="mode-link">Pick a topic →</a>
          </div>

          <!-- 65/20 Mode -->
          <div class="mode-card" onclick="app.alert('65/20 mode coming soon')">
            <div class="mode-icon">⏱️</div>
            <h3 class="mode-title">65/20 Mode</h3>
            <p class="mode-description">The shorter 20-question set</p>
            <a href="#" class="mode-link">Switch mode →</a>
          </div>

          <!-- Mock Exam Featured -->
          <div class="mode-card featured" onclick="app.startMock()">
            <div class="mode-icon">✓</div>
            <h3 class="mode-title">Mock Exam</h3>
            <p class="mode-description">The real format: 20 asked, 12 to pass</p>
            <button class="featured-btn">Begin Exam →</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Ratify is an independent study tool — not affiliated with or endorsed by USCIS.</p>
        <p>Question data sourced from uscis.gov. Always verify current answers before your interview.</p>
      </div>
    `;
  }

  notify(msg) {
    window.alert(msg);
  }

  async startStudy() {
    // Load questions from new exams schema
    const exam = await examsLoader.getExam('220-1201');
    if (!exam) {
      this.notify('Failed to load exam questions');
      return;
    }
    
    const questionBank = exam.questionBank;
    const selectedQuestions = examsLoader.getRandomQuestions(10, questionBank);
    
    // Shuffle options within each question
    const questionsWithShuffledOptions = selectedQuestions.map(q => examsLoader.shuffleQuestion(q));
    
    this.session = { 
      type: 'study', 
      questions: questionsWithShuffledOptions, 
      current: 0, 
      answers: {} 
    };
    this.showQuestion();
  }

  async startPractice() {
    // Load questions from new exams schema
    const exam = await examsLoader.getExam('220-1201');
    if (!exam) {
      this.notify('Failed to load exam questions');
      return;
    }
    
    const questionBank = exam.questionBank;
    const selectedQuestions = examsLoader.getRandomQuestions(20, questionBank);
    
    // Shuffle options within each question
    const questionsWithShuffledOptions = selectedQuestions.map(q => examsLoader.shuffleQuestion(q));
    
    this.session = { 
      type: 'practice', 
      questions: questionsWithShuffledOptions, 
      current: 0, 
      correct: 0, 
      incorrect: 0, 
      answers: {}, 
      score: null 
    };
    this.showQuestion();
  }

  async startMock() {
    // Load questions from new exams schema
    const exam = await examsLoader.getExam('220-1201');
    if (!exam) {
      this.notify('Failed to load exam questions');
      return;
    }
    
    const questionBank = exam.questionBank;
    const selectedQuestions = examsLoader.getRandomQuestions(20, questionBank);
    
    // Shuffle options within each question
    const questionsWithShuffledOptions = selectedQuestions.map(q => examsLoader.shuffleQuestion(q));
    
    this.session = { 
      type: 'mock', 
      questions: questionsWithShuffledOptions, 
      current: 0, 
      correct: 0, 
      incorrect: 0, 
      answers: {}, 
      score: null 
    };
    this.showQuestion();
  }

  // Helper: Check if question was already used (by ID)
  isQuestionUsed(questionId, answeredQuestions) {
    return Object.keys(answeredQuestions).includes(String(questionId));
  }

  showResults() {
    const s = this.session;
    const percentage = Math.round((s.correct / s.questions.length) * 100);
    const passed = s.correct >= Math.ceil(s.questions.length * 0.6);

    // Calculate category scores based on actual answers
    const categoryScores = {};
    for (const q of s.questions) {
      const cat = q.category;
      if (!categoryScores[cat]) {
        categoryScores[cat] = { total: 0, correct: 0, name: cat };
      }
      categoryScores[cat].total++;
      if (s.answers[q.id] && q.acceptableAnswers && q.acceptableAnswers.includes(s.answers[q.id])) {
        categoryScores[cat].correct++;
      }
    }

    // Convert to array and calculate percentages
    const categoryScoresArray = Object.values(categoryScores).map(cat => ({
      name: cat.name,
      percentage: cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0
    }));

    // Get missed questions - filter for questions where user answer is not in acceptableAnswers
    const missedQuestions = s.questions
      .filter(q => {
        return !s.answers[q.id] || !q.acceptableAnswers || !q.acceptableAnswers.includes(s.answers[q.id]);
      })
      .map(q => ({
        question: q.question,
        userAnswer: s.answers[q.id] || 'Not answered',
        correctAnswer: q.displayAnswer || q.acceptableAnswers[0],
        category: q.subcategory
      }));

    document.getElementById('app').innerHTML = `
      <style>
        .results-page {
          background-color: #FAF7F0;
          min-height: 100vh;
        }

        .results-header {
          background-color: #1B2A4A;
          padding: 24px 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .results-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .seal-small {
          width: 28px;
          height: 28px;
          border: 2px solid #C9973F;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .seal-small-star {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 6px solid #C9973F;
        }

        .results-header-logo {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          color: #FAF7F0;
          letter-spacing: 1.5px;
        }

        .results-back-link {
          color: #D8DEE9;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .results-back-link:hover {
          color: #FAF7F0;
        }

        .results-content {
          padding: 80px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .certificate-section {
          text-align: center;
          margin-bottom: 80px;
        }

        .result-badge {
          width: 180px;
          height: 180px;
          border: 4px solid #1B2A4A;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px;
          background: linear-gradient(135deg, #FAF7F0 0%, #F3ECDC 100%);
          box-shadow: 0 12px 40px rgba(27, 42, 74, 0.15);
          animation: badge-pulse 2s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .badge-icon {
          font-size: 72px;
          line-height: 1;
          margin-bottom: 8px;
        }

        .badge-status {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 16px;
          font-weight: 700;
          color: #1B2A4A;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .result-title {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 34px;
          font-weight: 600;
          color: #1B2A4A;
          margin-bottom: 12px;
        }

        .result-subtitle {
          font-size: 17px;
          color: #5C6B7A;
          margin-bottom: 48px;
        }

        .score-ring-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 48px;
        }

        .score-ring {
          width: 200px;
          height: 200px;
          margin: 0 auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-ring-svg {
          width: 100%;
          height: 100%;
        }

        .score-percentage {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 30px;
          font-weight: 700;
          color: #1B2A4A;
          position: absolute;
          text-align: center;
        }

        .score-label {
          font-size: 12.5px;
          color: #5C6B7A;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-align: center;
          margin-top: 16px;
        }

        .button-group {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-bottom: 80px;
        }

        .btn-review {
          border: 1.5px solid #1B2A4A;
          background: transparent;
          color: #1B2A4A;
          padding: 16px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .btn-review:hover {
          background: #1B2A4A;
          color: #FAF7F0;
        }

        .btn-retake {
          background: #C9973F;
          color: #1B2A4A;
          padding: 16px 32px;
          border-radius: 10px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .btn-retake:hover {
          background: #B8863A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 151, 63, 0.2);
        }

        .category-section {
          margin-bottom: 80px;
        }

        .section-title {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: #1B2A4A;
          margin-bottom: 24px;
        }

        .category-card {
          background: white;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(27, 42, 74, 0.1);
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .category-item:last-child {
          margin-bottom: 0;
        }

        .category-name {
          font-size: 14px;
          font-weight: 700;
          color: #1B2A4A;
          min-width: 200px;
        }

        .category-bar {
          flex: 1;
          height: 8px;
          background: #EDE6D6;
          border-radius: 4px;
          overflow: hidden;
        }

        .category-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .category-percentage {
          font-size: 14px;
          font-weight: 700;
          min-width: 50px;
          text-align: right;
        }

        .missed-section {
          margin-top: 80px;
        }

        .missed-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(27, 42, 74, 0.1);
          margin-bottom: 24px;
        }

        .missed-title {
          font-size: 16px;
          font-weight: 700;
          color: #1B2A4A;
          margin-bottom: 16px;
        }

        .missed-answer {
          font-size: 13px;
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .missed-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .missed-dot.wrong {
          background: #B85C4A;
        }

        .missed-dot.correct {
          background: #6B9080;
        }

        .missed-text {
          flex: 1;
        }

        .missed-text.wrong {
          color: #B85C4A;
        }

        .missed-text.correct {
          color: #6B9080;
        }

        .missed-category {
          font-size: 13px;
          color: #5C6B7A;
          text-align: right;
        }
      </style>

      <div class="results-page">
        <div class="results-header">
          <div class="results-header-left">
            <div class="seal-small">
              <div class="seal-small-star"></div>
            </div>
            <div class="results-header-logo">RATIFY</div>
          </div>
          <a onclick="app.showHome(); return false;" class="results-back-link">← Back to Dashboard</a>
        </div>

        <div class="results-content">
          <!-- Certificate Section -->
          <div class="certificate-section">
            <div class="result-badge">
              <div class="badge-icon">${passed ? '🥇' : '🎯'}</div>
              <div class="badge-status">${passed ? 'PASSED' : 'KEEP TRYING'}</div>
            </div>
            <h1 class="result-title">${passed ? "You're ready!" : "Keep practicing."}</h1>
            <p class="result-subtitle">${s.correct} of ${s.questions.length} correct — ${passed ? 'the officer would have stopped at question ' + s.correct : 'you need ' + (Math.ceil(s.questions.length * 0.6) - s.correct) + ' more correct'}.</p>

            <!-- Score Ring -->
            <div class="score-ring-container">
              <div class="score-ring">
                <svg viewBox="0 0 200 200" class="score-ring-svg">
                  <circle cx="100" cy="100" r="76" fill="none" stroke="#EDE6D6" stroke-width="14"/>
                  <circle cx="100" cy="100" r="76" fill="none" stroke="#6B9080" stroke-width="14" stroke-linecap="round" 
                    stroke-dasharray="${(percentage / 100) * 477} 477" transform="rotate(-90 100 100)"/>
                </svg>
                <div class="score-percentage">${percentage}%</div>
              </div>
              <div class="score-label">${s.correct} / ${s.questions.length} CORRECT</div>
            </div>

            <!-- Action Buttons -->
            <div class="button-group">
              <button class="btn-review" onclick="alert('Review mode coming soon')">Review Missed (${s.incorrect})</button>
              <button class="btn-retake" onclick="app.startMock()">Retake Mock Exam</button>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="category-section">
            <h2 class="section-title">How you did, by category</h2>
            <div class="category-card">
              ${categoryScoresArray.map((cat, idx) => `
                <div class="category-item">
                  <div class="category-name">${cat.name}</div>
                  <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${cat.percentage}%; background: ${idx === 1 ? '#C9973F' : '#6B9080'};"></div>
                  </div>
                  <div class="category-percentage" style="color: ${idx === 1 ? '#C9973F' : '#6B9080'};">${cat.percentage}%</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Missed Questions -->
          <div class="missed-section">
            <h2 class="section-title">Questions to review</h2>
            ${missedQuestions.map((q, idx) => `
              <div class="missed-card">
                <div class="missed-title">${q.question}</div>
                <div class="missed-answer">
                  <div class="missed-dot wrong"></div>
                  <div class="missed-text wrong">You answered: ${q.userAnswer}</div>
                </div>
                <div class="missed-answer">
                  <div class="missed-dot correct"></div>
                  <div class="missed-text correct">Correct answer: ${q.correctAnswer}</div>
                </div>
                <div class="missed-category">${q.category}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  showQuestion() {
    const s = this.session;
    const q = s.questions[s.current];
    const answered = s.answers[q.id];
    
    // Calculate correct/incorrect counts
    const correctCount = Object.values(s.answers).filter((a, i) => {
      const question = s.questions.find(qq => s.answers[qq.id] === a);
      // Check if the answer is in acceptableAnswers array
      return question && question.acceptableAnswers && question.acceptableAnswers.includes(a);
    }).length;
    const incorrectCount = Object.keys(s.answers).length - correctCount;  // Only count answered questions

    // Generate answer options with letters
    const answerLetters = ['A', 'B', 'C', 'D'];
    
    // Use pre-built options from the new schema
    const shuffledAnswers = q.options || [];

    document.getElementById('app').innerHTML = `
      <style>
        .question-page {
          background-color: #FAF7F0;
          min-height: 100vh;
        }

        .question-header {
          background-color: #1B2A4A;
          padding: 24px 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .exit-btn {
          background: none;
          border: none;
          color: #D8DEE9;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .progress-track {
          flex: 1;
          height: 10px;
          background: #28395F;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #C9973F;
          border-radius: 5px;
          transition: width 0.5s ease;
        }

        .question-counter {
          color: #D8DEE9;
          font-size: 12.5px;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .question-tally {
          display: flex;
          align-items: center;
          gap: 24px;
          color: #D8DEE9;
          font-size: 14px;
        }

        .tally-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .tally-dot.correct {
          background: #6B9080;
        }

        .tally-dot.incorrect {
          background: #B85C4A;
        }

        .question-content {
          padding: 80px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .question-category {
          color: #C9973F;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 32px;
          text-align: center;
        }

        .question-text {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 32px;
          font-weight: 600;
          color: #1B2A4A;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 48px;
        }

        .answers-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .answer-option {
          background: white;
          border: 1.5px solid #E4DDD0;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .answer-option:hover:not(.answer-locked) {
          border-color: #C9973F;
          box-shadow: 0 4px 12px rgba(201, 151, 63, 0.1);
        }

        .answer-option.answer-locked {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .answer-option.selected {
          border-color: #6B9080;
          background: #EAF1EC;
          box-shadow: 0 0 0 0.5px #6B9080 inset;
        }

        .answer-letter {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F3ECDC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #1B2A4A;
          flex-shrink: 0;
          font-size: 14px;
        }

        .answer-option.selected .answer-letter {
          background: #6B9080;
          color: white;
        }

        .answer-text {
          flex: 1;
          font-size: 16px;
          color: #1B2A4A;
          text-align: left;
          font-weight: 600;
        }

        .answer-option.selected .answer-text {
          font-weight: 600;
        }

        .answer-badge {
          font-size: 13px;
          font-weight: 700;
          color: #6B9080;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .explanation {
          background: white;
          border-left: 6px solid #6B9080;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 6px 20px rgba(27, 42, 74, 0.1);
          margin-top: 48px;
          margin-bottom: 32px;
        }

        .explanation h4 {
          font-size: 15px;
          font-weight: 700;
          color: #1B2A4A;
          margin-bottom: 16px;
        }

        .explanation p {
          font-size: 14px;
          color: #5C6B7A;
          line-height: 1.6;
        }

        .question-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skip-btn {
          background: none;
          border: none;
          color: #5C6B7A;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .next-btn {
          background: #C9973F;
          color: #1B2A4A;
          border: none;
          padding: 16px 32px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Public Sans', Arial, sans-serif;
        }

        .next-btn:hover {
          background: #B8863A;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 151, 63, 0.2);
        }
      </style>

      <div class="question-page">
        <div class="question-header">
          <button class="exit-btn" onclick="if(confirm('Exit session?')) app.showHome()">
            ✕ Exit session
          </button>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${((s.current + 1) / s.questions.length) * 100}%"></div>
          </div>
          <div class="question-counter">QUESTION ${s.current + 1} OF ${s.questions.length}</div>
          <div class="question-tally">
            <span><span class="tally-dot correct"></span> ${correctCount} correct</span>
            <span><span class="tally-dot incorrect"></span> ${incorrectCount} missed</span>
          </div>
        </div>

        <div class="question-content">
          <div class="question-category">${this.escapeHtml(q.subcategory.toUpperCase())}</div>
          <div class="question-text">${this.escapeHtml(q.question)}</div>

          <div class="answers-container">
            ${shuffledAnswers.map((ans, idx) => {
              const isCorrect = examsLoader.isAnswerCorrect(q, ans);
              const isSelected = answered === ans;
              return `
              <button
                class="answer-option ${isSelected ? 'selected' : ''} ${isSelected && !isCorrect ? 'incorrect' : ''} ${answered ? 'answer-locked' : ''}"
                data-action="answer"
                data-answer-id="${idx}"
                onclick="${answered ? 'return false;' : `app.handleAnswerClick(${idx})`}"
                style="${isSelected && !isCorrect ? 'border-color: #B85C4A; background: #F5E6E3;' : ''}"
              >
                <div class="answer-letter" style="${isSelected && !isCorrect ? 'background: #B85C4A; color: white;' : ''}">${isSelected ? (isCorrect ? '✓' : '✕') : answerLetters[idx]}</div>
                <div class="answer-text">${this.escapeHtml(ans)}</div>
                ${isSelected && isCorrect ? '<div class="answer-badge">CORRECT</div>' : ''}
                ${isSelected && !isCorrect ? '<div class="answer-badge" style="color: #B85C4A;">INCORRECT</div>' : ''}
              </button>
            `;
            }).join('')}
          </div>

          ${answered ? `
            <div class="explanation" style="${!examsLoader.isAnswerCorrect(q, answered) ? 'border-left-color: #B85C4A;' : ''}">
              <h4>${examsLoader.isAnswerCorrect(q, answered) ? 'Great job!' : 'Not quite right'}</h4>
              <p>${this.escapeHtml(q.explanation)}</p>
              ${!examsLoader.isAnswerCorrect(q, answered) ? `<p style="margin-top: 16px; color: #B85C4A;"><strong>Correct answer:</strong> ${this.escapeHtml(q.correctAnswer[0])}</p>` : ''}
            </div>
          ` : ''}

          <div class="question-footer">
            <button class="skip-btn" onclick="app.next()">Skip question</button>
            <button class="next-btn" onclick="app.next()">Next Question →</button>
          </div>
        </div>
      </div>
    `;
  }

  answer(ans) {
    const q = this.session.questions[this.session.current];
    this.session.answers[q.id] = ans;
    
    // Check if answer is correct using the new schema
    const isCorrect = examsLoader.isAnswerCorrect(q, ans);
    
    // Track correct/incorrect for mock exams
    if (this.session.type === 'mock') {
      if (isCorrect) {
        this.session.correct = (this.session.correct || 0) + 1;
      } else {
        this.session.incorrect = (this.session.incorrect || 0) + 1;
      }
      
      // Early stop logic for mock exams: 12 correct = pass, 9 incorrect = fail
      const PASS_AT = 12, FAIL_AT = 9;
      if (this.session.correct >= PASS_AT || this.session.incorrect >= FAIL_AT) {
        // Mark session as ended early
        this.session.current = this.session.questions.length - 1;
      }
    }
    
    this.stats[q.id] = (this.stats[q.id] || 0) + 1;
    store.set('stats', this.stats);
    this.showQuestion();
  }

  handleAnswerClick(answerIdx) {
    const s = this.session;
    const q = s.questions[s.current];
    if (!s.answers || !s.answers[q.id]) {
      // Get the actual answer text from the rendered buttons
      const buttons = document.querySelectorAll('.answer-option');
      if (buttons[answerIdx]) {
        const answerText = buttons[answerIdx].querySelector('.answer-text').textContent;
        this.answer(answerText);
      }
    }
  }

  next() {
    if (this.session.current < this.session.questions.length - 1) {
      this.session.current++;
      this.showQuestion();
    } else {
      // Calculate score before showing results
      this.session.correct = Object.keys(this.session.answers).filter(id => {
        const q = this.session.questions.find(q => q.id == id);
        return q && examsLoader.isAnswerCorrect(q, this.session.answers[id]);
      }).length;
      this.session.incorrect = this.session.questions.length - this.session.correct;
      this.showResults();
    }
  }

  skipQuestion() {
    this.next();
  }

  prev() {
    if (this.session.current > 0) {
      this.session.current--;
      this.showQuestion();
    }
  }

  showSettings() {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen bg-white dark:bg-slate-950">
        <header class="bg-white dark:bg-slate-800 shadow sticky top-0">
          <div class="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onclick="app.showHome()" class="text-2xl">←</button>
            <h1 class="text-2xl font-bold text-blue-700 dark:text-blue-300">Settings</h1>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-8">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Appearance</h2>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" ${this.prefs.darkMode ? 'checked' : ''} onchange="app.toggleDark(this.checked)" class="w-4 h-4" />
              <span class="font-medium">Dark Mode</span>
            </label>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Test Settings</h2>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" ${this.prefs.use65_20 ? 'checked' : ''} onchange="app.toggle65(this.checked)" class="w-4 h-4" />
              <span class="font-medium">65/20 Mode</span>
            </label>
          </div>

          <div class="bg-red-50 dark:bg-red-900 rounded-lg shadow p-6">
            <h2 class="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
            <button onclick="if(confirm('Reset all progress?')) { app.reset(); }" class="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700">🗑️ Reset Progress</button>
          </div>
        </main>
      </div>
    `;
  }

  toggleDarkMode() {
    this.prefs.darkMode = !this.prefs.darkMode;
    store.set('prefs', this.prefs);
    this.applyPrefs();
  }

  toggleDarkFromSettings(checked) {
    this.prefs.darkMode = !!checked;
    store.set('prefs', this.prefs);
    this.applyPrefs();
    this.showSettings();
  }

  toggle65(checked) {
    this.prefs.use65_20 = checked;
    store.set('prefs', this.prefs);
  }

  setUserState(state) {
    this.prefs.state = state;
    store.set('prefs', this.prefs);
  }

  reset() {
    localStorage.clear();
    this.stats = {};
    this.showHome();
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
});
