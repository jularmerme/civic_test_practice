import { CivicsQuestion, MockExamResult } from '../types';
/**
 * Quiz session management and scoring logic
 */
export declare class QuizSession {
    private questions;
    private currentIndex;
    private answers;
    private sessionId;
    private startTime;
    constructor(questions: CivicsQuestion[]);
    getCurrentQuestion(): CivicsQuestion | null;
    getCurrentIndex(): number;
    getTotalQuestions(): number;
    submitAnswer(questionId: number, answer: string): void;
    nextQuestion(): boolean;
    previousQuestion(): boolean;
    getAnswer(questionId: number): string | undefined;
    getResults(): {
        correct: number;
        incorrect: number;
        skipped: number;
        details: any[];
    };
    getScore(): number;
    private isAnswerCorrect;
    private updateQuestionStats;
    getSessionId(): string;
    getDuration(): number;
}
/**
 * Mock exam simulation following official USCIS rules
 */
export declare class MockExam {
    private questions;
    private sessionId;
    private startTime;
    private asked;
    private correctAnswers;
    private incorrectAnswers;
    private currentQuestionIndex;
    private questionResults;
    private use65_20;
    private MAX_QUESTIONS;
    private CORRECT_NEEDED;
    private INCORRECT_LIMIT;
    constructor(use65_20?: boolean, questions?: CivicsQuestion[]);
    getCurrentQuestion(): CivicsQuestion | null;
    submitAnswer(questionId: number, answer: string): {
        passed: boolean;
        finished: boolean;
        result: string;
    };
    getResult(): MockExamResult;
    getProgress(): {
        asked: number;
        correct: number;
        incorrect: number;
        remaining: number;
        maxQuestions: number;
    };
    private getCorrectAnswer;
    private isAnswerCorrect;
}
/**
 * Helper to generate multiple choice options with type-matching distractors
 */
export declare function generateMultipleChoiceOptions(question: CivicsQuestion, allQuestions: CivicsQuestion[]): string[];
//# sourceMappingURL=quiz.d.ts.map