import { civicsQuestions, shuffleArray } from '../data/questions';
import { resolveDynamicAnswer } from '../data/officials';
import { storage } from './storage';
/**
 * Quiz session management and scoring logic
 */
export class QuizSession {
    constructor(questions) {
        this.currentIndex = 0;
        this.answers = new Map();
        this.questions = shuffleArray(questions);
        this.sessionId = `session_${Date.now()}`;
        this.startTime = Date.now();
    }
    getCurrentQuestion() {
        if (this.currentIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentIndex];
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getTotalQuestions() {
        return this.questions.length;
    }
    submitAnswer(questionId, answer) {
        this.answers.set(questionId, answer);
        const question = this.questions.find((q) => q.id === questionId);
        if (question) {
            this.updateQuestionStats(question, answer);
        }
    }
    nextQuestion() {
        this.currentIndex++;
        return this.currentIndex < this.questions.length;
    }
    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }
    getAnswer(questionId) {
        return this.answers.get(questionId);
    }
    getResults() {
        const results = {
            correct: 0,
            incorrect: 0,
            skipped: 0,
            details: [],
        };
        this.questions.forEach((question) => {
            const userAnswer = this.answers.get(question.id);
            if (!userAnswer) {
                results.skipped++;
            }
            else if (this.isAnswerCorrect(question, userAnswer)) {
                results.correct++;
            }
            else {
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
    getScore() {
        const results = this.getResults();
        const total = results.correct + results.incorrect + results.skipped;
        return total > 0 ? Math.round((results.correct / total) * 100) : 0;
    }
    isAnswerCorrect(question, userAnswer) {
        const normalizedUser = userAnswer.toLowerCase().trim();
        // Check against acceptableAnswers for proper validation
        return question.acceptableAnswers.some((answer) => answer.toLowerCase().trim() === normalizedUser);
    }
    updateQuestionStats(question, answer) {
        const stats = storage.getQuestionStats(question.id);
        stats.timesSeen++;
        if (this.isAnswerCorrect(question, answer)) {
            stats.timesCorrect++;
            if (stats.timesCorrect >= 3) {
                stats.isKnown = true;
            }
        }
        else {
            stats.timesIncorrect++;
            stats.isKnown = false;
        }
        stats.lastAttemptDate = Date.now();
        storage.setQuestionStats(question.id, stats);
    }
    getSessionId() {
        return this.sessionId;
    }
    getDuration() {
        return Date.now() - this.startTime;
    }
}
/**
 * Mock exam simulation following official USCIS rules
 */
export class MockExam {
    constructor(use65_20 = false, questions) {
        this.asked = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.currentQuestionIndex = 0;
        this.questionResults = [];
        this.use65_20 = use65_20;
        if (questions) {
            this.questions = shuffleArray(questions);
        }
        else if (use65_20) {
            this.questions = shuffleArray(civicsQuestions.filter((q) => q.is65_20));
        }
        else {
            this.questions = shuffleArray(civicsQuestions);
        }
        // 65/20 rules: up to 10 questions from 20-question subset, need 6 correct, fail at 5 incorrect
        // Standard rules: up to 20 questions from 128, need 12 correct, fail at 9 incorrect
        if (use65_20) {
            this.MAX_QUESTIONS = 10;
            this.CORRECT_NEEDED = 6;
            this.INCORRECT_LIMIT = 5;
        }
        else {
            this.MAX_QUESTIONS = 20;
            this.CORRECT_NEEDED = 12;
            this.INCORRECT_LIMIT = 9;
        }
        this.sessionId = `mock_${Date.now()}`;
        this.startTime = Date.now();
    }
    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentQuestionIndex];
    }
    submitAnswer(questionId, answer) {
        const question = this.questions[this.currentQuestionIndex];
        if (question.id !== questionId) {
            throw new Error('Question ID mismatch');
        }
        this.asked++;
        const isCorrect = this.isAnswerCorrect(question, answer);
        if (isCorrect) {
            this.correctAnswers++;
        }
        else {
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
    getResult() {
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
    getProgress() {
        return {
            asked: this.asked,
            correct: this.correctAnswers,
            incorrect: this.incorrectAnswers,
            remaining: Math.max(0, this.MAX_QUESTIONS - this.asked),
            maxQuestions: this.MAX_QUESTIONS,
        };
    }
    getCorrectAnswer(question) {
        // For dynamic questions, resolve the answer at runtime
        if (question.answerType !== 'fixed' && question.dynamicKey) {
            const resolved = resolveDynamicAnswer(question.dynamicKey);
            return resolved || question.displayAnswer;
        }
        return question.displayAnswer;
    }
    isAnswerCorrect(question, userAnswer) {
        const normalizedUser = userAnswer.toLowerCase().trim();
        // Check against acceptableAnswers for proper validation
        return question.acceptableAnswers.some((answer) => answer.toLowerCase().trim() === normalizedUser);
    }
}
/**
 * Helper to generate multiple choice options with type-matching distractors
 */
export function generateMultipleChoiceOptions(question, allQuestions) {
    // For dynamic questions, resolve the correct answer first
    const correctAnswer = question.answerType !== 'fixed' && question.dynamicKey
        ? resolveDynamicAnswer(question.dynamicKey) || question.displayAnswer
        : question.displayAnswer;
    // Get other answers from the same question as options
    const otherAnswers = new Set();
    // Add acceptable answers from this question (if any besides displayAnswer)
    question.acceptableAnswers
        .filter((a) => a.toLowerCase() !== correctAnswer.toLowerCase())
        .forEach((a) => otherAnswers.add(a));
    // Generate distractors from other questions with matching answerFormat
    const matchingFormat = allQuestions.filter((q) => q.id !== question.id && q.answerFormat === question.answerFormat);
    matchingFormat.forEach((q) => {
        if (otherAnswers.size >= 3)
            return;
        const distractor = q.displayAnswer;
        if (distractor && distractor.toLowerCase() !== correctAnswer.toLowerCase()) {
            otherAnswers.add(distractor);
        }
    });
    // If still not enough, try same category
    if (otherAnswers.size < 3) {
        const sameCategoryQuestions = allQuestions.filter((q) => q.id !== question.id && q.category === question.category);
        sameCategoryQuestions.forEach((q) => {
            if (otherAnswers.size >= 3)
                return;
            const distractor = q.displayAnswer;
            if (distractor &&
                distractor.toLowerCase() !== correctAnswer.toLowerCase() &&
                !otherAnswers.has(distractor)) {
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
        const genericDistractions = {
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
//# sourceMappingURL=quiz.js.map