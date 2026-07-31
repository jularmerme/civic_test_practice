/**
 * Complete dataset of 128 USCIS Civics Test questions — 2025 version
 * Source: https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test
 * PDF: https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf
 *
 * displayAnswer / acceptableAnswers are empty for dynamic questions (answerType !== 'fixed').
 * Those are resolved at runtime from officials.ts using `dynamicKey`. Never hardcode a name
 * for a dynamic question here — it WILL go stale.
 *
 * answerFormat was auto-classified from the source data as a first pass for distractor
 * generation. Review entries marked 'freeform' — the classifier defaults to this when it
 * can't confidently detect a person/place/number/date/document/concept pattern.
 */
import type { CivicsQuestion } from './types';
export declare const civicsQuestions: CivicsQuestion[];
export declare function getQuestionById(id: number): CivicsQuestion | undefined;
export declare function getQuestionsByCategory(category: string): CivicsQuestion[];
export declare function get65_20Questions(): CivicsQuestion[];
export declare function getDynamicQuestions(): CivicsQuestion[];
export declare function shuffleArray<T>(array: T[]): T[];
export declare function getRandomQuestions(count: number, questions?: CivicsQuestion[]): CivicsQuestion[];
//# sourceMappingURL=questions.d.ts.map