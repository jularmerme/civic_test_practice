/**
 * UI rendering and event handling
 */
export declare class UI {
    private appContainer;
    private currentPage;
    constructor(containerId: string);
    /**
     * Render the home/dashboard screen
     */
    renderHome(options: {
        questionsStudied: number;
        currentStreak: number;
        lastScore: number;
        categoryStats: Array<{
            name: string;
            percentage: number;
        }>;
        onStartPractice: () => void;
        onTakeMockExam: () => void;
        onStudyByCategory: () => void;
        onReviewMissed: () => void;
        onSettings: () => void;
    }): void;
    /**
     * Render a question in study/practice mode
     */
    renderQuestion(options: {
        questionNumber: number;
        totalQuestions: number;
        question: string;
        explanation?: string;
        isAnswered: boolean;
        userAnswer?: string;
        correctAnswers?: string[];
        multipleChoice?: string[];
        onAnswer: (answer: string) => void;
        onNext: () => void;
        onPrevious: () => void;
        onMarkKnown?: () => void;
        onMarkLearning?: () => void;
        canGoBack: boolean;
        showExplanation: boolean;
    }): void;
    /**
     * Render mock exam results
     */
    renderMockExamResults(options: {
        passed: boolean;
        score: number;
        correctAnswers: number;
        totalAsked: number;
        details: Array<any>;
        onRetry: () => void;
        onHome: () => void;
    }): void;
    /**
     * Hide loading screen
     */
    hideLoading(): void;
    /**
     * Render settings page
     */
    renderSettings(options: {
        darkMode: boolean;
        use65_20: boolean;
        immediateFeeback: boolean;
        onToggleDarkMode: (enabled: boolean) => void;
        onToggle65_20: (enabled: boolean) => void;
        onToggleImmediateFeeback: (enabled: boolean) => void;
        onResetProgress: () => void;
        onBack: () => void;
    }): void;
}
//# sourceMappingURL=ui.d.ts.map