import { CivicsQuestion, MockExamResult } from '../types';
import { civicsQuestions, shuffleArray } from '../data/questions';
import { resolveDynamicAnswer } from '../data/officials';
import { storage } from './storage';

/**
 * Quiz session management and scoring logic
 */
export class QuizSession {
  private questions: CivicsQuestion[];
  private currentIndex: number = 0;
  private answers: Map<number, string> = new Map();
  private sessionId: string;
  private startTime: number;

  constructor(questions: CivicsQuestion[]) {
    this.questions = shuffleArray(questions);
    this.sessionId = `session_${Date.now()}`;
    this.startTime = Date.now();
  }

  getCurrentQuestion(): CivicsQuestion | null {
    if (this.currentIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentIndex];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  submitAnswer(questionId: number, answer: string): void {
    this.answers.set(questionId, answer);
    const question = this.questions.find((q) => q.id === questionId);
    if (question) {
      this.updateQuestionStats(question, answer);
    }
  }

  nextQuestion(): boolean {
    this.currentIndex++;
    return this.currentIndex < this.questions.length;
  }

  previousQuestion(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  getAnswer(questionId: number): string | undefined {
    return this.answers.get(questionId);
  }

  getResults() {
    const results = {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      details: [] as any[],
    };

    this.questions.forEach((question) => {
      const userAnswer = this.answers.get(question.id);

      if (!userAnswer) {
        results.skipped++;
      } else if (this.isAnswerCorrect(question, userAnswer)) {
        results.correct++;
      } else {
        results.incorrect++;
      }

      results.details.push({
        id: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.displayAnswer,
        acceptableAnswers: question.acceptableAnswers,
        isCorrect: userAnswer
          ? this.isAnswerCorrect(question, userAnswer)
          : false,
        explanation: question.explanation,
      });
    });

    return results;
  }

  getScore(): number {
    const results = this.getResults();
    const total = results.correct + results.incorrect + results.skipped;
    return total > 0 ? Math.round((results.correct / total) * 100) : 0;
  }

  private isAnswerCorrect(
    question: CivicsQuestion,
    userAnswer: string
  ): boolean {
    const normalizedUser = userAnswer.toLowerCase().trim();
    // Check against acceptableAnswers for proper validation
    return question.acceptableAnswers.some(
      (answer) => answer.toLowerCase().trim() === normalizedUser
    );
  }

  private updateQuestionStats(
    question: CivicsQuestion,
    answer: string
  ): void {
    const stats = storage.getQuestionStats(question.id);
    stats.timesSeen++;

    if (this.isAnswerCorrect(question, answer)) {
      stats.timesCorrect++;
      if (stats.timesCorrect >= 3) {
        stats.isKnown = true;
      }
    } else {
      stats.timesIncorrect++;
      stats.isKnown = false;
    }

    stats.lastAttemptDate = Date.now();
    storage.setQuestionStats(question.id, stats);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * Mock exam simulation following official USCIS rules
 */
export class MockExam {
  private questions: CivicsQuestion[];
  private sessionId: string;
  private startTime: number;
  private asked: number = 0;
  private correctAnswers: number = 0;
  private incorrectAnswers: number = 0;
  private currentQuestionIndex: number = 0;
  private questionResults: any[] = [];
  private use65_20: boolean;
  private MAX_QUESTIONS: number;
  private CORRECT_NEEDED: number;
  private INCORRECT_LIMIT: number;

  constructor(use65_20: boolean = false, questions?: CivicsQuestion[]) {
    this.use65_20 = use65_20;

    if (questions) {
      this.questions = shuffleArray(questions);
    } else if (use65_20) {
      this.questions = shuffleArray(
        civicsQuestions.filter((q) => q.is65_20)
      );
    } else {
      this.questions = shuffleArray(civicsQuestions);
    }

    // 65/20 rules: up to 10 questions from 20-question subset, need 6 correct, fail at 5 incorrect
    // Standard rules: up to 20 questions from 128, need 12 correct, fail at 9 incorrect
    if (use65_20) {
      this.MAX_QUESTIONS = 10;
      this.CORRECT_NEEDED = 6;
      this.INCORRECT_LIMIT = 5;
    } else {
      this.MAX_QUESTIONS = 20;
      this.CORRECT_NEEDED = 12;
      this.INCORRECT_LIMIT = 9;
    }

    this.sessionId = `mock_${Date.now()}`;
    this.startTime = Date.now();
  }

  getCurrentQuestion(): CivicsQuestion | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  submitAnswer(
    questionId: number,
    answer: string
  ): { passed: boolean; finished: boolean; result: string } {
    const question = this.questions[this.currentQuestionIndex];

    if (question.id !== questionId) {
      throw new Error('Question ID mismatch');
    }

    this.asked++;
    const isCorrect = this.isAnswerCorrect(question, answer);

    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    const correctAnswer = this.getCorrectAnswer(question);
    this.questionResults.push({
      id: question.id,
      question: question.question,
      userAnswer: answer,
      isCorrect,
      correctAnswer: correctAnswer,
      acceptableAnswers: question.acceptableAnswers,
      explanation: question.explanation,
    });

    let finished = false;
    let passed = false;
    let result = '';

    // Check passing condition
    if (this.correctAnswers >= this.CORRECT_NEEDED) {
      finished = true;
      passed = true;
      result = `Congratulations! You passed with ${this.correctAnswers} correct answers. The passing score is ${this.CORRECT_NEEDED} correct.`;
    }
    // Check failing condition
    else if (this.incorrectAnswers > this.INCORRECT_LIMIT) {
      finished = true;
      passed = false;
      result = `You did not pass. You answered ${this.incorrectAnswers} questions incorrectly (limit is ${this.INCORRECT_LIMIT}). You got ${this.correctAnswers} out of ${this.asked} questions correct.`;
    }
    // Check if all questions asked
    else if (this.asked >= this.MAX_QUESTIONS) {
      finished = true;
      passed = false;
      result = `Test ended. You answered ${this.correctAnswers} out of ${this.asked} questions correctly. You needed ${this.CORRECT_NEEDED} to pass.`;
    }

    if (!finished) {
      this.currentQuestionIndex++;
    }

    return { passed, finished, result };
  }

  getResult(): MockExamResult {
    return {
      sessionId: this.sessionId,
      totalAsked: this.asked,
      correctAnswers: this.correctAnswers,
      incorrectAnswers: this.incorrectAnswers,
      passed: this.correctAnswers >= this.CORRECT_NEEDED,
      questions: this.questionResults,
      duration: Date.now() - this.startTime,
      timestamp: Date.now(),
    };
  }

  getProgress(): {
    asked: number;
    correct: number;
    incorrect: number;
    remaining: number;
    maxQuestions: number;
  } {
    return {
      asked: this.asked,
      correct: this.correctAnswers,
      incorrect: this.incorrectAnswers,
      remaining: Math.max(0, this.MAX_QUESTIONS - this.asked),
      maxQuestions: this.MAX_QUESTIONS,
    };
  }

  private getCorrectAnswer(question: CivicsQuestion): string {
    // For dynamic questions, resolve the answer at runtime
    if (question.answerType !== 'fixed' && question.dynamicKey) {
      const resolved = resolveDynamicAnswer(question.dynamicKey);
      return resolved || question.displayAnswer;
    }
    return question.displayAnswer;
  }

  private isAnswerCorrect(
    question: CivicsQuestion,
    userAnswer: string
  ): boolean {
    const normalizedUser = userAnswer.toLowerCase().trim();
    // Check against acceptableAnswers for proper validation
    return question.acceptableAnswers.some(
      (answer) => answer.toLowerCase().trim() === normalizedUser
    );
  }
}

/**
 * Helper to generate multiple choice options with type-matching distractors
 */
export function generateMultipleChoiceOptions(
  question: CivicsQuestion,
  allQuestions: CivicsQuestion[]
): string[] {
  // For dynamic questions, resolve the correct answer first
  const correctAnswer = question.answerType !== 'fixed' && question.dynamicKey
    ? resolveDynamicAnswer(question.dynamicKey) || question.displayAnswer
    : question.displayAnswer;

  // Get other answers from the same question as options
  const otherAnswers = new Set<string>();

  // Add acceptable answers from this question (if any besides displayAnswer)
  question.acceptableAnswers
    .filter((a) => a.toLowerCase() !== correctAnswer.toLowerCase())
    .forEach((a) => otherAnswers.add(a));

  // Generate distractors from other questions with matching answerFormat
  const matchingFormat = allQuestions.filter(
    (q) => q.id !== question.id && q.answerFormat === question.answerFormat
  );

  matchingFormat.forEach((q) => {
    if (otherAnswers.size >= 3) return;
    const distractor = q.displayAnswer;
    if (distractor && distractor.toLowerCase() !== correctAnswer.toLowerCase()) {
      otherAnswers.add(distractor);
    }
  });

  // If still not enough, try same category
  if (otherAnswers.size < 3) {
    const sameCategoryQuestions = allQuestions.filter(
      (q) => q.id !== question.id && q.category === question.category
    );
    sameCategoryQuestions.forEach((q) => {
      if (otherAnswers.size >= 3) return;
      const distractor = q.displayAnswer;
      if (
        distractor &&
        distractor.toLowerCase() !== correctAnswer.toLowerCase() &&
        !otherAnswers.has(distractor)
      ) {
        otherAnswers.add(distractor);
      }
    });
  }

  // Ensure we have exactly 4 options
  const options = [correctAnswer];
  otherAnswers.forEach((answer) => {
    if (options.length < 4) {
      options.push(answer);
    }
  });

  // If we still don't have 4 options, fill with generic distractors based on format
  if (options.length < 4) {
    const genericDistractions: Record<string, string[]> = {
      person: ['John Smith', 'Thomas Jefferson', 'Abraham Lincoln', 'George Washington'],
      place: ['New York', 'California', 'Texas', 'Florida'],
      number: ['50', '100', '435', '27'],
      date: ['1776', '1787', '1865', '1920'],
      document: ['The Constitution', 'The Declaration', 'The Bill of Rights', 'The Federalist'],
      concept: ['democracy', 'republic', 'freedom', 'rights'],
      freeform: ['The federal government', 'The state government', 'The judicial system', 'The legislative branch'],
    };
    const distractors = genericDistractions[question.answerFormat] || genericDistractions.freeform;
    distractors.forEach((distractor) => {
      if (options.length < 4 && !options.includes(distractor)) {
        options.push(distractor);
      }
    });
  }

  // Shuffle the options so correct answer isn't always first
  return shuffleArray(options);
}
