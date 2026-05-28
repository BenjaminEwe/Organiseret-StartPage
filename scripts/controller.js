import { STATES, clearCache, setCurrentState, updateTypedString, getCurrentState } from "./state.js";
import { loadUrls, screenToggle } from "./ui.js";
import { updateSiteCache, attemptLaunchTypedWord } from "./linkLauncher.js";
import { loadGreeting } from "./greeting.js";

export function initController() {
    document.addEventListener('keydown', function(event) {
        console.debug("Key pressed:", event.key, "Current state:", getCurrentState());
        if (getCurrentState() === STATES.EDIT) {
            if (event.key === 'Escape') {
                console.debug("Escape key pressed, exiting edit mode...");
                setCurrentState(STATES.MAIN);
                clearCache();
                loadUrls();
                loadGreeting();
                return;
            } else if (event.key === 'Backspace') {
                updateTypedString(event.key);
                updateSiteCache();
            } else if (/^[a-zA-Z0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                updateTypedString(event.key);
                updateSiteCache();
            }
            return;
        }
    
        if (getCurrentState() === STATES.SETTINGS) {
            if ((event.key === 'Escape') || (event.key === 's' && event.ctrlKey)) {
                event.preventDefault();
                screenToggle('settings');
                return;
            }
            return;
        }
    
        if (getCurrentState() === STATES.MAIN) {
            if (event.key === 's' && event.ctrlKey) {
                event.preventDefault();
                screenToggle('settings');
            } else if (event.key === 'c' && event.ctrlKey) {
                event.preventDefault();
                screenToggle('credits');
            // Only listen for typing if the main screen is visible.
            } else if (!document.getElementById("rightBox").classList.contains("hidden")) {
                if (event.key === 'Escape') {
                    console.debug("Escape key pressed, flushed typed string");
                    clearCache();
                    loadUrls();
                } else if (event.key === 'Backspace') {
                    updateTypedString(event.key);
                    updateSiteCache()
                    attemptLaunchTypedWord();
                } else if (/^[a-zA-Z0-9 ]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    updateTypedString(event.key);
                    updateSiteCache();
                    attemptLaunchTypedWord();
                }
            }
            return;
        }
    });
}