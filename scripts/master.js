import { getSites, setSites } from "./storage.js";
import { loadUrls, screenToggle, addSite, enterRemoveSitesMode } from "./ui.js";
import { downloadSites, uploadSites } from "./importExport.js";
import { toggleButtonVisibility, toggleScrollBar, updateAnimationSpeed, toggleLinkSorting, updateFirefoxOffset, toggleFocusGrabbing, toggleAutoLaunch, toggleLaunchInNewTab } from "./settings.js";
import { loadGreeting, initGreetingListeners } from "./greeting.js";
import { initController } from "./controller.js";
import { STATES, setCurrentState, clearCache } from "./state.js";

initController();

// Default settings
if (localStorage.getItem("settingsIconVisible") === null) {
    localStorage.setItem("settingsIconVisible", "true");
}
if (localStorage.getItem("creditsLinkVisible") === null) {
    localStorage.setItem("creditsLinkVisible", "true");
}
if (localStorage.getItem("scrollBarVisible") === null) {
    localStorage.setItem("scrollBarVisible", "true");
}
if (localStorage.getItem("animationSpeed") === null) {
    localStorage.setItem("animationSpeed", "0");
}
if (localStorage.getItem("sortLinks") === null) {
    localStorage.setItem("sortLinks", "false");
}
if (localStorage.getItem("launchInNewTab") === null) {
    localStorage.setItem("launchInNewTab", "true");
}


// Helper commands
const onClick = (element, func) => {
    document.getElementById(element)?.addEventListener("click", func);
}
const onChange = (element, func) => {
    document.getElementById(element)?.addEventListener("change", func);
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    setCurrentState(STATES.MAIN);
    loadUrls();
    loadGreeting();
    initGreetingListeners();

    onClick("creditsLink", () => screenToggle("credits"));
    onClick("removeSitesBtn", enterRemoveSitesMode);
    onClick("downloadSitesBtn", () => downloadSites(getSites()));
    onClick("uploadSitesBtn", async () => {
        try {
            clearCache();
            const sites = await uploadSites();
            setSites(sites);
            loadUrls();
        } catch (error) {
            console.error("Error uploading sites:", error);
        }
    });
    onClick("enableFocusGrabbing", toggleFocusGrabbing);
    onClick("enableAutoLaunch", toggleAutoLaunch);
    onClick("launchInNewTabCheckbox", () => {
        toggleLaunchInNewTab();
        loadUrls();
    });

    onChange("showSettingsIconCheckbox", () => toggleButtonVisibility('settingsIcon'));
    onChange("showCreditsLinkCheckbox", () => toggleButtonVisibility('creditsLink'));
    onChange("showScrollBarCheckbox", toggleScrollBar);
    onChange("sortLinksCheckbox", () => {
        toggleLinkSorting();
        loadUrls();
    });

    if (localStorage.getItem("settingsIconVisible") === "false") {
        document.getElementById("settingsIcon").style.display = "none";
    } else {
        document.getElementById("showSettingsIconCheckbox").checked = true;
    }

    if (localStorage.getItem("creditsLinkVisible") === "false") {
        document.getElementById("creditsLink").style.display = "none";
    } else {
        document.getElementById("showCreditsLinkCheckbox").checked = true;
    }
    
    if (localStorage.getItem("scrollBarVisible") === "false") {
        document.getElementById("siteList").style.scrollbarWidth = "none";
    } else {
        document.getElementById("showScrollBarCheckbox").checked = true;
    }
    
    const speed = localStorage.getItem("animationSpeed");
    if (speed !== null) {
        document.getElementById("animationSpeedSlider").value = speed;
        updateAnimationSpeed();
    }

    const firefoxOffset = localStorage.getItem("firefoxOffset");
    if (firefoxOffset !== null) {
        document.getElementById("firefoxOffsetSlider").value = firefoxOffset;
        updateFirefoxOffset();
    }

    if (localStorage.getItem("sortLinks") === "true") {
        document.getElementById("sortLinksCheckbox").checked = true;
    }

    const settingsIcon = document.getElementById("settingsIcon");
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => screenToggle('settings'));
        settingsIcon.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') screenToggle('settings');
        });
    }
    

    const addSiteForm = document.getElementById("addSiteForm");
    if (addSiteForm) {
        addSiteForm.addEventListener('submit', event => {
            event.preventDefault();
            addSite();
        });
    }

    const animSpeedSlider = document.getElementById("animationSpeedSlider");
    if (animSpeedSlider) {
        animSpeedSlider.addEventListener('input', updateAnimationSpeed);
    }

    const firefoxOffsetSlider = document.getElementById("firefoxOffsetSlider");
    if (firefoxOffsetSlider) {
        firefoxOffsetSlider.addEventListener('input', updateFirefoxOffset);
    }

    if (!navigator.userAgent.includes("Firefox")) {
        console.debug("Hiding Firefox offset setting for non-Firefox browser");
        document.getElementById("firefoxOffsetSection").style.display = "none";
    }

    if (localStorage.getItem("doFocusGrabbing") === "true") {
        document.getElementById("enableFocusGrabbing").checked = true;
    }

    if (localStorage.getItem("doAutoLaunch") === "true") {
        document.getElementById("enableAutoLaunch").checked = true;
    }

    if (localStorage.getItem("launchInNewTab") === "true") {
        document.getElementById("launchInNewTabCheckbox").checked = true;
    }
});