export const STATES = Object.freeze({
    EDIT: "edit",
    SETTINGS: "settings",
    CREDITS: "credits",
    MAIN: "main"
});

const state = {
    typedString: "",
    cachedSites: null,
    currentState: null
};

export function getTypedString() {
    return state.typedString;
}

export function updateTypedString(key) {
    switch (key) {
    case 'Backspace':
        state.typedString = state.typedString.slice(0, -1);
        state.cachedSites = null;
        break;
    default:
        state.typedString += key;
    }
}

export function getCachedSites() {
    return state.cachedSites;
}

/**
 * 
 * @param {Array} sites to be used if cachedSites is null
 * @returns {Array} sites filtered according to typedString
 * @throws {Error} if sites is not an array
 */
export function filterOrSites(sites) {
    if (!Array.isArray(sites)) {
        throw new Error("sites should be an array");
    }

    state.cachedSites = state.cachedSites === null ? sites : state.cachedSites;
    state.cachedSites = state.cachedSites.filter(site => site.name.toLowerCase().startsWith(state.typedString.toLowerCase()));
    return state.cachedSites;
}

function isValidState(stateToCheck) {
    return Object.values(STATES).includes(stateToCheck);
}

export function getCurrentState() {
    return state.currentState;
}

/**
 * Sets the current state of the application
 * @param {string} newState
 * @throws {Error} if newState is not a valid state
 * Valid states are: STATES.EDIT, STATES.SETTINGS, STATES.CREDITS, STATES.MAIN
 */
export function setCurrentState(newState) {
    if (!isValidState(newState)) {
        throw new Error("Invalid state: " + newState);
    }
    state.currentState = newState;
}

/**
 * Clears typedString and cachedSites
 */
export function clearCache() {
    state.typedString = "";
    state.cachedSites = null;
}

export function clearCacheOnly() {
    state.cachedSites = null;
}