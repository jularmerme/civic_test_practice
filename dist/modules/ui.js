/**
 * UI rendering and event handling
 */
class UI {
    constructor(containerId) {
        this.currentPage = 'home';
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }
        this.appContainer = container;
    }
    /**
     * Render the home/dashboard screen
     */
    renderHome(options) {
        this.appContainer.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-civic-blue-50 to-civic-green-50 dark:from-slate-900 dark:to-slate-800">
        <!-- Header -->
        <header class="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="text-3xl">🇺🇸</div>
              <h1 class="text-2xl font-bold text-civic-blue-700 dark:text-civic-blue-300">
                Civics Test
              </h1>
            </div>
            <button
              id="settings-btn"
              class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h2 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome to Your Civics Study Companion
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Prepare for the 2025 USCIS Naturalization Civics Test with our comprehensive study app. 
              Learn at your own pace with 128 official questions, interactive practice sessions, and mock exams.
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="card">
              <div class="text-3xl font-bold text-civic-blue-600 dark:text-civic-blue-400">${options.questionsStudied}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Questions Studied</div>
            </div>
            <div class="card">
              <div class="text-3xl font-bold text-civic-green-600 dark:text-civic-green-400">${options.currentStreak}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Day Streak</div>
            </div>
            <div class="card">
              <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">${options.lastScore}%</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Last Score</div>
            </div>
            <div class="card">
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">128</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Total Questions</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              id="practice-btn"
              class="btn-primary text-left p-6 h-24 flex flex-col justify-center rounded-lg"
            >
              <div class="text-xl font-bold mb-1">📝 Start Practice Session</div>
              <div class="text-sm opacity-90">Random questions with immediate feedback</div>
            </button>
            <button
              id="mock-exam-btn"
              class="btn-primary text-left p-6 h-24 flex flex-col justify-center rounded-lg"
            >
              <div class="text-xl font-bold mb-1">🎯 Take Full Mock Exam</div>
              <div class="text-sm opacity-90">Simulate the real interview format</div>
            </button>
            <button
              id="category-btn"
              class="btn-secondary text-left p-6 h-24 flex flex-col justify-center rounded-lg"
            >
              <div class="text-xl font-bold mb-1">📚 Study by Category</div>
              <div class="text-sm opacity-90">Focus on specific topics</div>
            </button>
            <button
              id="review-btn"
              class="btn-secondary text-left p-6 h-24 flex flex-col justify-center rounded-lg"
            >
              <div class="text-xl font-bold mb-1">📋 Review Missed Questions</div>
              <div class="text-sm opacity-90">Learn from your mistakes</div>
            </button>
          </div>

          <!-- Category Stats -->
          ${options.categoryStats.length > 0
            ? `
            <div class="card mb-8">
              <h3 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">Category Progress</h3>
              <div class="space-y-4">
                ${options.categoryStats
                .map((stat) => `
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="font-medium text-slate-700 dark:text-slate-300">${stat.name}</span>
                      <span class="text-sm text-slate-600 dark:text-slate-400">${stat.percentage}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${stat.percentage}%"></div>
                    </div>
                  </div>
                `)
                .join('')}
              </div>
            </div>
            `
            : ''}
        </main>
      </div>
    `;
        document.getElementById('settings-btn')?.addEventListener('click', options.onSettings);
        document.getElementById('practice-btn')?.addEventListener('click', options.onStartPractice);
        document.getElementById('mock-exam-btn')?.addEventListener('click', options.onTakeMockExam);
        document.getElementById('category-btn')?.addEventListener('click', options.onStudyByCategory);
        document.getElementById('review-btn')?.addEventListener('click', options.onReviewMissed);
    }
    /**
     * Render a question in study/practice mode
     */
    renderQuestion(options) {
        const revealedClass = options.showExplanation ? '' : 'hidden';
        const progressPercent = (options.questionNumber / options.totalQuestions) * 100;
        this.appContainer.innerHTML = `
      <div class="min-h-screen bg-white dark:bg-slate-950">
        <!-- Header with progress -->
        <header class="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center mb-4">
              <h1 class="text-2xl font-bold text-civic-blue-700 dark:text-civic-blue-300">Question ${options.questionNumber} of ${options.totalQuestions}</h1>
              <button id="close-btn" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">✕</button>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </header>

        <!-- Question Content -->
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Question -->
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">${options.question}</h2>

            ${options.multipleChoice
            ? `
              <div class="space-y-3">
                ${options.multipleChoice
                .map((option, index) => `
                  <button
                    class="w-full text-left p-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:border-civic-blue-500 dark:hover:border-civic-blue-400 transition-colors answer-option"
                    data-answer="${option}"
                  >
                    <span class="font-medium">${String.fromCharCode(65 + index)}.</span> ${option}
                  </button>
                `)
                .join('')}
              </div>
            `
            : `
              <textarea
                id="answer-input"
                class="input-field mb-4 h-24"
                placeholder="Type your answer here..."
              ></textarea>
              <button id="submit-answer-btn" class="btn-primary">Submit Answer</button>
            `}
          </div>

          <!-- Explanation (shown after answer) -->
          ${options.showExplanation
            ? `
            <div class="card ${options.isAnswered ? 'border-l-4 border-civic-blue-600' : ''} mb-8">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">Explanation</h3>
              <p class="text-slate-700 dark:text-slate-300">${options.explanation}</p>
              ${options.correctAnswers && options.correctAnswers.length > 0
                ? `
                <div class="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                  <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Correct Answer(s):</p>
                  <p class="text-civic-green-600 dark:text-civic-green-400 font-medium">${options.correctAnswers.join(', ')}</p>
                </div>
              `
                : ''}
            </div>
          `
            : ''}

          <!-- Navigation -->
          <div class="flex justify-between gap-4">
            <button
              id="previous-btn"
              class="btn-secondary flex-1"
              ${!options.canGoBack ? 'disabled' : ''}
            >
              ← Previous
            </button>
            <button id="next-btn" class="btn-primary flex-1">
              Next →
            </button>
          </div>
        </main>
      </div>
    `;
        // Event listeners
        document.querySelectorAll('.answer-option').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const answer = e.currentTarget.getAttribute('data-answer');
                if (answer) {
                    options.onAnswer(answer);
                }
            });
        });
        document.getElementById('next-btn')?.addEventListener('click', options.onNext);
        document.getElementById('previous-btn')?.addEventListener('click', options.onPrevious);
        document.getElementById('close-btn')?.addEventListener('click', () => {
            // Handle close
        });
    }
    /**
     * Render mock exam results
     */
    renderMockExamResults(options) {
        const passedClass = options.passed
            ? 'text-civic-green-600 dark:text-civic-green-400'
            : 'text-red-600 dark:text-red-400';
        this.appContainer.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-civic-blue-50 to-civic-green-50 dark:from-slate-900 dark:to-slate-800">
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Result Summary -->
          <div class="card mb-8 text-center">
            <div class="text-6xl mb-4">${options.passed ? '✅' : '❌'}</div>
            <h1 class="text-4xl font-bold ${passedClass} mb-4">
              ${options.passed ? 'Congratulations!' : 'Not Quite Yet'}
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-400 mb-6">
              ${options.passed ? 'You passed the mock exam!' : 'Keep practicing and you\'ll get there!'}
            </p>
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div>
                <div class="text-4xl font-bold text-civic-blue-600 dark:text-civic-blue-400">${options.correctAnswers}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Correct</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-amber-600 dark:text-amber-400">${options.totalAsked - options.correctAnswers}</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Incorrect</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-civic-green-600 dark:text-civic-green-400">${options.score}%</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Score</div>
              </div>
            </div>
            <p class="text-slate-600 dark:text-slate-400 mb-6">
              You need to answer at least 12 out of 20 questions correctly to pass the real exam.
            </p>
          </div>

          <!-- Details -->
          <div class="card mb-8">
            <h2 class="text-2xl font-bold mb-6">Review Your Answers</h2>
            <div class="space-y-4">
              ${options.details
            .map((detail, index) => `
                <div class="border-l-4 ${detail.isCorrect ? 'border-civic-green-500' : 'border-red-500'} pl-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-slate-900 dark:text-white">Q${index + 1}: ${detail.question}</h3>
                    <span class="text-sm font-medium ${detail.isCorrect ? 'text-civic-green-600' : 'text-red-600'}">
                      ${detail.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Your answer: ${detail.userAnswer || 'Not answered'}
                  </p>
                  <p class="text-sm text-slate-700 dark:text-slate-300">${detail.explanation}</p>
                </div>
              `)
            .join('')}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button id="retry-btn" class="btn-primary flex-1">
              🔄 Try Again
            </button>
            <button id="home-btn" class="btn-secondary flex-1">
              🏠 Back to Home
            </button>
          </div>
        </main>
      </div>
    `;
        document.getElementById('retry-btn')?.addEventListener('click', options.onRetry);
        document.getElementById('home-btn')?.addEventListener('click', options.onHome);
    }
    /**
     * Hide loading screen
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    /**
     * Render settings page
     */
    renderSettings(options) {
        this.appContainer.innerHTML = `
      <div class="min-h-screen bg-white dark:bg-slate-950">
        <header class="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
            <button id="back-btn" class="text-xl">←</button>
            <h1 class="text-2xl font-bold text-civic-blue-700 dark:text-civic-blue-300">Settings</h1>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Appearance -->
          <div class="card mb-6">
            <h2 class="text-xl font-bold mb-4">Appearance</h2>
            <div class="space-y-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  ${options.darkMode ? 'checked' : ''}
                  class="w-4 h-4"
                />
                <span>Dark Mode</span>
              </label>
            </div>
          </div>

          <!-- Test Settings -->
          <div class="card mb-6">
            <h2 class="text-xl font-bold mb-4">Test Settings</h2>
            <div class="space-y-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="65-20-toggle"
                  ${options.use65_20 ? 'checked' : ''}
                  class="w-4 h-4"
                />
                <div>
                  <span class="font-medium">Use 65/20 Mode</span>
                  <p class="text-sm text-slate-600 dark:text-slate-400">For applicants 65+ with 20+ years permanent residence</p>
                </div>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="immediate-feedback-toggle"
                  ${options.immediateFeeback ? 'checked' : ''}
                  class="w-4 h-4"
                />
                <div>
                  <span class="font-medium">Immediate Feedback</span>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Show answers after each question</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="card border-red-200 dark:border-red-900">
            <h2 class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
            <button id="reset-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              🗑️ Reset All Progress
            </button>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-3">
              This will permanently delete all your study progress, stats, and settings.
            </p>
          </div>
        </main>
      </div>
    `;
        document.getElementById('back-btn')?.addEventListener('click', options.onBack);
        document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
            options.onToggleDarkMode(e.target.checked);
        });
        document.getElementById('65-20-toggle')?.addEventListener('change', (e) => {
            options.onToggle65_20(e.target.checked);
        });
        document.getElementById('immediate-feedback-toggle')?.addEventListener('change', (e) => {
            options.onToggleImmediateFeeback(e.target.checked);
        });
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm('Are you sure? This cannot be undone.')) {
                options.onResetProgress();
            }
        });
    }
}
//# sourceMappingURL=ui.js.map
