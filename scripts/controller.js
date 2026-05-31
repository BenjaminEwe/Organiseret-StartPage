import { STATES, clearCache, setCurrentState, updateTypedString, getCurrentState } from "./state.js";
import { loadUrls, screenToggle } from "./ui.js";
import { updateSiteCache, attemptLaunchTypedWord } from "./linkLauncher.js";
import { loadGreeting } from "./greeting.js";

/**
 * Sets keydown event listeners to allow keyboard navigation and search.
 */
export function initController() {
    document.addEventListener('keydown', function(event) {
        console.debug("Key pressed:", event.key, "Current state:", getCurrentState());
        switch (getCurrentState()) {
            case STATES.MAIN:
                if (event.key === 's' && event.ctrlKey) {
                    event.preventDefault();
                    screenToggle('settings');
                } else if (event.key === 'c' && event.ctrlKey) {
                    event.preventDefault();
                    screenToggle('credits');
                } else if (event.key === 'Escape') {
                    console.debug("Escape key pressed, flushed typed string");
                    clearCache();
                    loadUrls();
                } else if (event.key === 'Backspace') {
                    updateTypedString(event.key);
                    updateSiteCache()
                    attemptLaunchTypedWord();
                } else if (/^[a-zA-Z0-9 ,._-]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    updateTypedString(event.key);
                    updateSiteCache();
                    attemptLaunchTypedWord();
                }
                break;
            case STATES.SETTINGS:
                if ((event.key === 'Escape') || (event.key === 's' && event.ctrlKey)) {
                    event.preventDefault();
                    screenToggle('settings');
                }
                break;
            case STATES.CREDITS:
                if ((event.key === 'Escape') || (event.key === 'c' && event.ctrlKey)) {
                    event.preventDefault();
                    screenToggle('credits');
                } else if (event.key === 's' && event.ctrlKey) {
                    event.preventDefault();
                    screenToggle('settings');
                }
                break;
            case STATES.EDIT:
                if (event.key === 'Escape') {
                    console.debug("Escape key pressed, exiting edit mode...");
                    setCurrentState(STATES.MAIN);
                    clearCache();
                    loadUrls();
                    loadGreeting();
                } else if (event.key === 'Backspace') {
                    updateTypedString(event.key);
                    updateSiteCache();
                } else if (/^[a-zA-Z0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    updateTypedString(event.key);
                    updateSiteCache();
                }
                break;
            default:
                console.error("Unknown state:", getCurrentState());
                return;
        }
    });
}