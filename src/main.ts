import { civicsQuestions, get65_20Questions } from './data/questions';
import { storage } from './modules/storage';
import { UI } from './modules/ui';
import { QuizSession, MockExam } from './modules/quiz';

/**
 * Main application class
 */
class CivicsTestApp {
  private ui: UI;
  private currentPage: string = 'home';
  private currentSession: QuizSession | MockExam | null = null;

  constructor() {
    this.ui = new UI('app');
    this.initializeApp();
  }

  /**
   * Initialize the application
   */
  private async initializeApp(): Promise<void> {
    try {
      // Apply saved preferences
      const prefs = storage.getPreferences();
      this.applyPreferences(prefs);

      // Hide loading screen
      this.ui.hideLoading();

      // Show home page
      this.showHome();
    } catch (error) {
      console.error('Error initializing app:', error);
      alert('An error occurred while loading the app. Please refresh.');
    }
  }

  /**
   * Show home/dashboard page
   */
  private showHome(): void {
    const stats = storage.getOverallStats();
    const prefs = storage.getPreferences();

    // Calculate questions studied
    let questionsStudied = 0;
    civicsQuestions.forEach((q) => {
      const qStats = storage.getQuestionStats(q.id);
      if (qStats.timesSeen > 0) questionsStudied++;
    });

    // Calculate category stats
    const categories = ['American Government', 'American History', 'Integrated Civics'];
    const categoryStats = categories.map((cat) => {
      const categoryQuestions = civicsQuestions.filter((q) => q.category === cat);
      let correctCount = 0;

      categoryQuestions.forEach((q) => {
        const qStats = storage.getQuestionStats(q.id);
        if (qStats.timesCorrect > 0) correctCount++;
      });

      const percentage = categoryQuestions.length > 0
        ? Math.round((correctCount / categoryQuestions.length) * 100)
        : 0;

      return { name: cat, percentage };
    });

    this.ui.renderHome({
      questionsStudied,
      currentStreak: stats.currentStreak || 0,
      lastScore: stats.bestMockScore || 0,
      categoryStats,
      onStartPractice: () => this.startPracticeSession(),
      onTakeMockExam: () => this.startMockExam(),
      onStudyByCategory: () => this.showCategorySelection(),
      onReviewMissed: () => this.reviewMissedQuestions(),
      onSettings: () => this.showSettings(),
    });

    this.currentPage = 'home';
  }

  /**
   * Start a practice session
   */
  private startPracticeSession(): void {
    const prefs = storage.getPreferences();
    const questions = prefs.use65_20 ? get65_20Questions() : civicsQuestions;

    // Randomly select 20 questions
    const selectedQuestions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(20, questions.length));

    this.currentSession = new QuizSession(selectedQuestions);
    this.showQuestion();
  }

  /**
   * Start a mock exam
   */
  private startMockExam(): void {
    const prefs = storage.getPreferences();
    this.currentSession = new MockExam(prefs.use65_20);
    this.showMockExamQuestion();
  }

  /**
   * Display the next question
   */
  private showQuestion(): void {
    if (!(this.currentSession instanceof QuizSession)) {
      return;
    }

    const question = this.currentSession.getCurrentQuestion();
    const index = this.currentSession.getCurrentIndex();
    const total = this.currentSession.getTotalQuestions();
    const userAnswer = this.currentSession.getAnswer(question!.id);

    const prefs = storage.getPreferences();

    this.ui.renderQuestion({
      questionNumber: index + 1,
      totalQuestions: total,
      question: question!.question,
      explanation: question!.explanation,
      isAnswered: !!userAnswer,
      userAnswer,
      correctAnswers: question!.answers,
      multipleChoice: this.generateMultipleChoice(question!),
      onAnswer: (answer) => this.handleAnswer(question!.id, answer),
      onNext: () => this.nextQuestion(),
      onPrevious: () => this.previousQuestion(),
      canGoBack: index > 0,
      showExplanation: prefs.immediateFeeback && !!userAnswer,
    });
  }

  /**
   * Show mock exam question
   */
  private showMockExamQuestion(): void {
    if (!(this.currentSession instanceof MockExam)) {
      return;
    }

    const question = this.currentSession.getCurrentQuestion();

    if (!question) {
      const result = this.currentSession.getResult();
      this.showMockExamResults(result);
      return;
    }

    const progress = this.currentSession.getProgress();

    this.ui.renderQuestion({
      questionNumber: progress.asked + 1,
      totalQuestions: progress.maxQuestions,
      question: question.question,
      multipleChoice: this.generateMultipleChoice(question),
      isAnswered: false,
      onAnswer: (answer) => this.handleMockExamAnswer(question.id, answer),
      onNext: () => {}, // Not used in mock exam
      onPrevious: () => {}, // Not used in mock exam
      canGoBack: false,
      showExplanation: false,
    });
  }

  /**
   * Generate multiple choice options for a question
   */
  private generateMultipleChoice(question: any): string[] {
    const correctAnswer = question.answers[0];
    const options = [correctAnswer];

    // Add other answers from the same question
    for (let i = 1; i < question.answers.length && options.length < 4; i++) {
      options.push(question.answers[i]);
    }

    // Add distractors from other questions
    for (const q of civicsQuestions) {
      if (q.id !== question.id && options.length < 4) {
        for (const answer of q.answers) {
          if (!options.includes(answer) && options.length < 4) {
            options.push(answer);
          }
        }
      }
    }

    // Shuffle
    return options.sort(() => Math.random() - 0.5);
  }

  /**
   * Handle an answer submission
   */
  private handleAnswer(questionId: number, answer: string): void {
    if (!(this.currentSession instanceof QuizSession)) {
      return;
    }

    this.currentSession.submitAnswer(questionId, answer);
    this.showQuestion();
  }

  /**
   * Handle mock exam answer
   */
  private handleMockExamAnswer(questionId: number, answer: string): void {
    if (!(this.currentSession instanceof MockExam)) {
      return;
    }

    const { finished, result } = this.currentSession.submitAnswer(questionId, answer);

    if (finished) {
      const examResult = this.currentSession.getResult();
      storage.addSessionResult(examResult);
      this.showMockExamResults(examResult);
    } else {
      this.showMockExamQuestion();
    }
  }

  /**
   * Move to next question
   */
  private nextQuestion(): void {
    if (!(this.currentSession instanceof QuizSession)) {
      return;
    }

    const hasNext = this.currentSession.nextQuestion();
    if (hasNext) {
      this.showQuestion();
    } else {
      this.showSessionResults();
    }
  }

  /**
   * Move to previous question
   */
  private previousQuestion(): void {
    if (!(this.currentSession instanceof QuizSession)) {
      return;
    }

    this.currentSession.previousQuestion();
    this.showQuestion();
  }

  /**
   * Show session results
   */
  private showSessionResults(): void {
    if (!(this.currentSession instanceof QuizSession)) {
      return;
    }

    const results = this.currentSession.getResults();
    const score = this.currentSession.getScore();

    this.ui.renderMockExamResults({
      passed: score >= 60,
      score,
      correctAnswers: results.correct,
      totalAsked: results.correct + results.incorrect,
      details: results.details,
      onRetry: () => this.startPracticeSession(),
      onHome: () => this.showHome(),
    });
  }

  /**
   * Show mock exam results
   */
  private showMockExamResults(result: any): void {
    this.ui.renderMockExamResults({
      passed: result.passed,
      score: Math.round((result.correctAnswers / result.totalAsked) * 100),
      correctAnswers: result.correctAnswers,
      totalAsked: result.totalAsked,
      details: result.questions,
      onRetry: () => this.startMockExam(),
      onHome: () => this.showHome(),
    });
  }

  /**
   * Show category selection
   */
  private showCategorySelection(): void {
    // For now, just go back to home
    // Full implementation would show category picker
    this.showHome();
  }

  /**
   * Review missed questions
   */
  private reviewMissedQuestions(): void {
    // Find all questions with incorrect answers
    const missedQuestions = civicsQuestions.filter((q) => {
      const stats = storage.getQuestionStats(q.id);
      return stats.timesIncorrect > 0;
    });

    if (missedQuestions.length === 0) {
      alert('Great job! You haven\'t missed any questions yet.');
      return;
    }

    this.currentSession = new QuizSession(missedQuestions);
    this.showQuestion();
  }

  /**
   * Show settings page
   */
  private showSettings(): void {
    const prefs = storage.getPreferences();

    this.ui.renderSettings({
      darkMode: prefs.darkMode,
      use65_20: prefs.use65_20Mode,
      immediateFeeback: prefs.immediateFeeback,
      onToggleDarkMode: (enabled) => this.toggleDarkMode(enabled),
      onToggle65_20: (enabled) => this.toggle65_20Mode(enabled),
      onToggleImmediateFeeback: (enabled) => this.toggleImmediateFeeback(enabled),
      onResetProgress: () => this.resetProgress(),
      onBack: () => this.showHome(),
    });
  }

  /**
   * Toggle dark mode
   */
  private toggleDarkMode(enabled: boolean): void {
    const prefs = storage.getPreferences();
    prefs.darkMode = enabled;
    storage.setPreferences(prefs);
    this.applyPreferences(prefs);
  }

  /**
   * Toggle 65/20 mode
   */
  private toggle65_20Mode(enabled: boolean): void {
    const prefs = storage.getPreferences();
    prefs.use65_20Mode = enabled;
    storage.setPreferences(prefs);
  }

  /**
   * Toggle immediate feedback
   */
  private toggleImmediateFeeback(enabled: boolean): void {
    const prefs = storage.getPreferences();
    prefs.immediateFeeback = enabled;
    storage.setPreferences(prefs);
  }

  /**
   * Reset all progress
   */
  private resetProgress(): void {
    storage.resetAllData();
    this.showHome();
  }

  /**
   * Apply preferences to the DOM
   */
  private applyPreferences(prefs: any): void {
    if (prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CivicsTestApp();
});
