import { QuestionStats, UserPreferences } from '../types';
/**
 * Safe localStorage wrapper with error handling
 */
declare class StorageManager {
    private isAvailable;
    private get;
    private set;
    private delete;
    getPreferences(): UserPreferences;
    setPreferences(prefs: UserPreferences): boolean;
    getQuestionStats(questionId: number): QuestionStats;
    setQuestionStats(questionId: number, stats: QuestionStats): boolean;
    getOverallStats(): {
        totalSessions: number;
        bestMockScore: number;
        currentStreak: number;
        lastSessionDate: number;
    };
    setOverallStats(stats: {
        totalSessions: number;
        bestMockScore: number;
        currentStreak: number;
        lastSessionDate?: number;
    }): boolean;
    getCategoryMastery(category: string): number;
    setCategoryMastery(category: string, percentage: number): boolean;
    addSessionResult(result: any): boolean;
    getSessionHistory(): never[];
    resetAllData(): boolean;
    isLocalStorageAvailable(): boolean;
}
export declare const storage: StorageManager;
export {};
//# sourceMappingURL=storage.d.ts.map