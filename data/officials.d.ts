/**
 * Runtime resolver for dynamic (time-sensitive) answers
 * Questions about current President, VP, Speaker, state capital, and state senators
 * are resolved at runtime so they stay correct after elections without code changes
 */
import type { DynamicKey } from '../types/index';
declare const CURRENT_OFFICIALS: {
    president: string;
    vp: string;
    speaker: string;
    stateCapitals: Map<string, string>;
    stateSenators: Map<string, string[]>;
};
/**
 * Resolve a dynamic answer based on the key and optional user state
 * @param dynamicKey The type of dynamic answer to resolve
 * @param userState The user's state (required for state-specific answers)
 * @returns The resolved answer string, or undefined if not found
 */
export declare function resolveDynamicAnswer(dynamicKey: DynamicKey, userState?: string): string | undefined;
/**
 * Update the current President (for testing or after an election)
 */
export declare function updateOfficials(updates: Partial<typeof CURRENT_OFFICIALS>): void;
declare const _default: {
    resolveDynamicAnswer: typeof resolveDynamicAnswer;
    updateOfficials: typeof updateOfficials;
};
export default _default;
//# sourceMappingURL=officials.d.ts.map