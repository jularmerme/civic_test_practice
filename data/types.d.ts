export type QuestionCategory = 'American Government' | 'American History' | 'Integrated Civics';
/**
 * fixed            — answer never changes (e.g. "How many amendments?")
 * dynamic-national — depends on who currently holds a national office
 *                    (President, Vice President, Speaker of the House)
 * dynamic-state    — depends on the applicant's own state
 *                    (state capital, the applicant's two senators)
 */
export type AnswerType = 'fixed' | 'dynamic-national' | 'dynamic-state';
/**
 * Groups questions by the *shape* of their correct answer, so the
 * multiple-choice generator can pull distractors of the same shape
 * (e.g. never offer "50" as a wrong answer to a question whose
 * correct answer is a person's name).
 */
export type AnswerFormat = 'person' | 'place' | 'number' | 'date' | 'document' | 'concept' | 'freeform';
export type DynamicKey = 'currentPresident' | 'currentVicePresident' | 'currentSpeaker' | 'stateCapital' | 'stateSenators';
export interface CivicsQuestion {
    /** 1–128, matches official USCIS numbering */
    id: number;
    category: QuestionCategory;
    subcategory: string;
    question: string;
    /**
     * The single canonical answer shown as the correct multiple-choice
     * option. Empty string when answerType !== 'fixed' — resolve those
     * at runtime via `dynamicKey` and officials.ts instead.
     */
    displayAnswer: string;
    /**
     * All USCIS-accepted variants of the answer (includes displayAnswer).
     * Empty for dynamic questions — see displayAnswer above.
     */
    acceptableAnswers: string[];
    explanation: string;
    answerType: AnswerType;
    answerFormat: AnswerFormat;
    /** Present only when answerType !== 'fixed'. */
    dynamicKey?: DynamicKey;
    /** Part of the shorter 20-question set for 65/20 applicants. */
    is65_20: boolean;
    /** ISO date this question's answer was last checked against uscis.gov. */
    lastVerified: string;
}
//# sourceMappingURL=types.d.ts.map