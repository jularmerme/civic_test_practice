const STORAGE_KEY_PREFIX = 'civics_app_';
/**
 * Safe localStorage wrapper with error handling
 */
class StorageManager {
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch {
            return false;
        }
    }
    get(key, defaultValue) {
        if (!this.isAvailable()) {
            return defaultValue;
        }
        try {
            const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
            if (!item)
                return defaultValue;
            return JSON.parse(item);
        }
        catch (error) {
            console.warn(`Error reading from storage key "${key}":`, error);
            return defaultValue;
        }
    }
    set(key, value) {
        if (!this.isAvailable()) {
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
            return true;
        }
        catch (error) {
            console.warn(`Error writing to storage key "${key}":`, error);
            return false;
        }
    }
    delete(key) {
        if (!this.isAvailable()) {
            return false;
        }
        try {
            localStorage.removeItem(STORAGE_KEY_PREFIX + key);
            return true;
        }
        catch (error) {
            console.warn(`Error deleting storage key "${key}":`, error);
            return false;
        }
    }
    // Preferences
    getPreferences() {
        return this.get('preferences', {
            darkMode: false,
            use65_20Mode: false,
            immediateFeeback: true,
        });
    }
    setPreferences(prefs) {
        return this.set('preferences', prefs);
    }
    // Question Stats
    getQuestionStats(questionId) {
        return this.get(`question_${questionId}`, {
            timesSeen: 0,
            timesCorrect: 0,
            timesIncorrect: 0,
            isKnown: false,
        });
    }
    setQuestionStats(questionId, stats) {
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
    setOverallStats(stats) {
        return this.set('overall_stats', stats);
    }
    // Category Mastery
    getCategoryMastery(category) {
        return this.get(`category_${category}`, 0);
    }
    setCategoryMastery(category, percentage) {
        return this.set(`category_${category}`, percentage);
    }
    // Session History
    addSessionResult(result) {
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
        }
        catch (error) {
            console.warn('Error saving session result:', error);
            return false;
        }
    }
    getSessionHistory() {
        return this.get('session_history', []);
    }
    // Complete Reset
    resetAllData() {
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
        }
        catch (error) {
            console.warn('Error resetting storage:', error);
            return false;
        }
    }
    // Check if storage is available
    isLocalStorageAvailable() {
        return this.isAvailable();
    }
}
window.storage = new StorageManager();
//# sourceMappingURL=storage.js.map