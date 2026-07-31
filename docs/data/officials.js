/**
 * Runtime resolver for dynamic (time-sensitive) answers
 * Questions about current President, VP, Speaker, state capital, and state senators
 * are resolved at runtime so they stay correct after elections without code changes
 */
// Update these when officials change after elections/appointments
const CURRENT_OFFICIALS = {
    president: 'Joe Biden',
    vp: 'Kamala Harris',
    speaker: 'Mike Johnson',
    // State capitals and senators data
    stateCapitals: new Map([
        ['Alabama', 'Montgomery'],
        ['Alaska', 'Juneau'],
        ['Arizona', 'Phoenix'],
        ['Arkansas', 'Little Rock'],
        ['California', 'Sacramento'],
        ['Colorado', 'Denver'],
        ['Connecticut', 'Hartford'],
        ['Delaware', 'Dover'],
        ['Florida', 'Tallahassee'],
        ['Georgia', 'Atlanta'],
        ['Hawaii', 'Honolulu'],
        ['Idaho', 'Boise'],
        ['Illinois', 'Springfield'],
        ['Indiana', 'Indianapolis'],
        ['Iowa', 'Des Moines'],
        ['Kansas', 'Topeka'],
        ['Kentucky', 'Frankfort'],
        ['Louisiana', 'Baton Rouge'],
        ['Maine', 'Augusta'],
        ['Maryland', 'Annapolis'],
        ['Massachusetts', 'Boston'],
        ['Michigan', 'Lansing'],
        ['Minnesota', 'Saint Paul'],
        ['Mississippi', 'Jackson'],
        ['Missouri', 'Jefferson City'],
        ['Montana', 'Helena'],
        ['Nebraska', 'Lincoln'],
        ['Nevada', 'Carson City'],
        ['New Hampshire', 'Concord'],
        ['New Jersey', 'Trenton'],
        ['New Mexico', 'Santa Fe'],
        ['New York', 'Albany'],
        ['North Carolina', 'Raleigh'],
        ['North Dakota', 'Bismarck'],
        ['Ohio', 'Columbus'],
        ['Oklahoma', 'Oklahoma City'],
        ['Oregon', 'Salem'],
        ['Pennsylvania', 'Harrisburg'],
        ['Rhode Island', 'Providence'],
        ['South Carolina', 'Columbia'],
        ['South Dakota', 'Pierre'],
        ['Tennessee', 'Nashville'],
        ['Texas', 'Austin'],
        ['Utah', 'Salt Lake City'],
        ['Vermont', 'Montpelier'],
        ['Virginia', 'Richmond'],
        ['Washington', 'Olympia'],
        ['West Virginia', 'Charleston'],
        ['Wisconsin', 'Madison'],
        ['Wyoming', 'Cheyenne'],
    ]),
    // STATE SENATORS: Intentionally left empty per spec
    // For question #70, we treat this as review-only with a message:
    // "Look up your current senators at senate.gov before your interview"
    // DO NOT fabricate senator names
    stateSenators: new Map([
    // Empty - intentional. See spec Section 2.
    ]),
};
/**
 * Resolve a dynamic answer based on the key and optional user state
 * @param dynamicKey The type of dynamic answer to resolve
 * @param userState The user's state (required for state-specific answers)
 * @returns The resolved answer string, or undefined if not found
 */
window.resolveDynamicAnswer = function(dynamicKey, userState) {
    if (!dynamicKey)
        return undefined;
    switch (dynamicKey) {
        case 'current-president':
            return CURRENT_OFFICIALS.president;
        case 'current-vp':
            return CURRENT_OFFICIALS.vp;
        case 'current-speaker':
            return CURRENT_OFFICIALS.speaker;
        case 'state-capital':
            if (!userState)
                return undefined;
            return CURRENT_OFFICIALS.stateCapitals.get(userState);
        case 'state-senators':
            // Per spec: do not auto-grade, show review message instead
            if (!userState)
                return undefined;
            const senators = CURRENT_OFFICIALS.stateSenators.get(userState);
            if (!senators || senators.length === 0) {
                return undefined; // Signal to UI: show review-only message
            }
            return senators.join(' and ');
        default:
            return undefined;
    }
}
/**
 * Update the current President (for testing or after an election)
 */
window.updateOfficials = function(updates) {
    Object.assign(CURRENT_OFFICIALS, updates);
}
//# sourceMappingURL=officials.js.map