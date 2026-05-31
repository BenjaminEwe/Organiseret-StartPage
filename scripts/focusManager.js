/**
 * This script is a workaround for a focus-grabbing issue in Firefox when opening a new tab.
 * Firefox refuses to hand over focus from the address bar when a user creates a new tab.
 * It does not, however, refuse if the extension itself created it.
 * Therefore, we create a new tab and close the user-created one, giving us attention.
 * If Mozilla ever fixes Bugzilla #1415860, this script can be removed.
 */

const focusHackFlagKey = 'focusHackApplied';
const focusHackParamKey = 'focusGrabbed';

// Carry the flag across to the newly created tab once via a URL param
const currentUrl = new URL(window.location.href);
if (currentUrl.searchParams.get(focusHackParamKey) === '1') {
    sessionStorage.setItem(focusHackFlagKey, 'true');
    currentUrl.searchParams.delete(focusHackParamKey);
    history.replaceState(null, '', currentUrl.toString());
}

// Check sessionStorage so it only executes once per tab
if (!sessionStorage.getItem(focusHackFlagKey) && localStorage.getItem('doFocusGrabbing') === 'true') {
    sessionStorage.setItem(focusHackFlagKey, 'true');

    if (!globalThis.browser || !browser.tabs || !browser.tabs.create || !browser.tabs.remove) {
        console.error("Browser tabs API not available. Focus grabbing aborted.");
    } else {
        (async () => {
            const currentTab = await browser.tabs.getCurrent();

            // Create a new tab with the exact same extension URL
            const newTabUrl = new URL(window.location.href);
            newTabUrl.searchParams.set(focusHackParamKey, '1');

            await browser.tabs.create({
                url: newTabUrl.toString(),
                active: true
            });

            // Close the original tab where the address bar stole focus
            if (currentTab && typeof currentTab.id === 'number') {
                await browser.tabs.remove(currentTab.id);
            }
        })();
    }
}