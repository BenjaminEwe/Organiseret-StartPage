/**
 * @typedef {Object} Site
 * @property {string} name
 * @property {string} url
 * @property {string} UUID
 */

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

/**
 * Updates the typed string based on the provided key.
 * If key is Backspace, also deletes cachedSites.
 * @param {string} key 
 */
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
 * Filters cachedSites based on typedString. If cachedSites is null, uses provided sites to filter and caches the result.
 * @param {Site[]} sites to be used if cachedSites is null
 * @returns {Site[]} sites filtered according to typedString
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

/**
 * Returns the current state of the application
 * @returns 
 */
export function getCurrentState() {
    return state.currentState;
}

/**
 * Sets the current state of the application
 * @param {typeof STATES[keyof typeof STATES]} newState
 * @throws {Error} if newState is not a valid state
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