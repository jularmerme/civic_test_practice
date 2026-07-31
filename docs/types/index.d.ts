export type AnswerType = 'fixed' | 'dynamic-national' | 'dynamic-state';
export type AnswerFormat = 'person' | 'place' | 'number' | 'date' | 'document' | 'concept' | 'freeform';
export type DynamicKey = 'current-president' | 'current-vp' | 'current-speaker' | 'state-capital' | 'state-senators' | undefined;
export interface CivicsQuestion {
    id: number;
    category: QuestionCategory;
    subcategory: string;
    question: string;
    displayAnswer: string;
    acceptableAnswers: string[];
    explanation: string;
    answerType: AnswerType;
    answerFormat: AnswerFormat;
    dynamicKey: DynamicKey;
    is65_20: boolean;
    lastVerified: string;
}
export type QuestionCategory = 'American Government' | 'American History' | 'Integrated Civics';
export interface QuestionStats {
    timesSeen: number;
    timesCorrect: number;
    timesIncorrect: number;
    isKnown: boolean;
    lastAttemptDate?: number;
}
export interface UserProgress {
    questionStats: Map<number, QuestionStats>;
    totalSessions: number;
    bestMockScore: number;
    currentStreak: number;
    lastSessionDate?: number;
    categoryMastery: Map<string, number>;
    preferences: UserPreferences;
}
export interface UserPreferences {
    darkMode: boolean;
    use65_20Mode: boolean;
    immediateFeeback: boolean;
}
export interface PracticeSession {
    sessionId: string;
    mode: 'study' | 'practice' | 'mock' | 'category';
    categoryFilter?: QuestionCategory;
    questions: CivicsQuestion[];
    currentQuestionIndex: number;
    answers: Map<number, string>;
    startTime: number;
    endTime?: number;
    score?: number;
    passed?: boolean;
    correctCount?: number;
    incorrectCount?: number;
}
export interface MockExamResult {
    sessionId: string;
    totalAsked: number;
    correctAnswers: number;
    incorrectAnswers: number;
    passed: boolean;
    questions: {
        id: number;
        answered: string;
        isCorrect: boolean;
    }[];
    duration: number;
    timestamp: number;
}
//# sourceMappingURL=index.d.ts.map