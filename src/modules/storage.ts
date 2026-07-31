import { UserProgress, QuestionStats, UserPreferences } from '../types';

const STORAGE_KEY_PREFIX = 'civics_app_';

/**
 * Safe localStorage wrapper with error handling
 */
class StorageManager {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading from storage key "${key}":`, error);
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to storage key "${key}":`, error);
      return false;
    }
  }

  private delete(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + key);
      return true;
    } catch (error) {
      console.warn(`Error deleting storage key "${key}":`, error);
      return false;
    }
  }

  // Preferences
  getPreferences(): UserPreferences {
    return this.get('preferences', {
      darkMode: false,
      use65_20Mode: false,
      immediateFeeback: true,
    });
  }

  setPreferences(prefs: UserPreferences): boolean {
    return this.set('preferences', prefs);
  }

  // Question Stats
  getQuestionStats(questionId: number): QuestionStats {
    return this.get(`question_${questionId}`, {
      timesSeen: 0,
      timesCorrect: 0,
      timesIncorrect: 0,
      isKnown: false,
    });
  }

  setQuestionStats(questionId: number, stats: QuestionStats): boolean {
    return this.set(`question_${questionId}`, stats);
  }

  // Overall Progress
  getOverallStats() {
    return this.get('overall_stats', {
      totalSessions: 0,
      bestMockScore: 0,
      currentStreak: 0,
      lastSessionDate: 0,
    });
  }

  setOverallStats(stats: {
    totalSessions: number;
    bestMockScore: number;
    currentStreak: number;
    lastSessionDate?: number;
  }): boolean {
    return this.set('overall_stats', stats);
  }

  // Category Mastery
  getCategoryMastery(category: string): number {
    return this.get(`category_${category}`, 0);
  }

  setCategoryMastery(category: string, percentage: number): boolean {
    return this.set(`category_${category}`, percentage);
  }

  // Session History
  addSessionResult(result: any): boolean {
    try {
      const history = this.get('session_history', []);
      history.push({
        ...result,
        timestamp: Date.now(),
      });
      // Keep only last 50 sessions
      if (history.length > 50) {
        history.shift();
      }
      return this.set('session_history', history);
    } catch (error) {
      console.warn('Error saving session result:', error);
      return false;
    }
  }

  getSessionHistory() {
    return this.get('session_history', []);
  }

  // Complete Reset
  resetAllData(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Error resetting storage:', error);
      return false;
    }
  }

  // Check if storage is available
  isLocalStorageAvailable(): boolean {
    return this.isAvailable();
  }
}

export const storage = new StorageManager();
