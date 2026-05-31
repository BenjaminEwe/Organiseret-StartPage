import * as storage from "./storage.js";
import { STATES, getCurrentState, setCurrentState, clearCacheOnly } from "./state.js";

/**
 * Switches screen based on the provided ID.
 * Works as a toggle - if provided ID is visible, hides it and shows main screen,
 * if provided ID is hidden, shows it and hides the others.
 * @param {\"rightBox\"|\"settings\"|\"credits\"} ID 
 */
export function screenToggle(ID) {
    const screens = ["rightBox", "settings", "credits"];
    const wasPressedScreenHidden = document.getElementById(ID).classList.contains("hidden");

    screens.forEach(screenID => {
        const screen = document.getElementById(screenID);
        if (screenID === ID) {
            if (wasPressedScreenHidden) {
                screen.classList.remove("hidden");
            } else {
                screen.classList.add("hidden");
            }
        } else {
            screen.classList.add("hidden");
        }
    });

    if (!wasPressedScreenHidden) {
        document.getElementById("rightBox").classList.remove("hidden");
        setCurrentState(STATES.MAIN);
    } else {
        switch (ID) {
        case "settings":
            setCurrentState(STATES.SETTINGS);
            break;
        case "credits":
            setCurrentState(STATES.CREDITS);
            break;
        default:
            setCurrentState(STATES.MAIN);
            break;
        } 
    }
}

/**
 * Adds a new site to the list of sites based on values in siteNameInput and siteURLInput, then updates the UI.
 * Normalizes to ensure URL starts with https:// and generates a UUID for the site.
 * Does nothing if site name or URL is empty.
 */
export function addSite() {
    console.debug("Adding site...");
    let siteName = document.getElementById("siteNameInput").value;
    let siteURL = document.getElementById("siteURLInput").value;
    console.debug("Site name:", siteName, "Site URL:", siteURL);

    if (!siteName || !siteURL) { console.error("empty name or url"); return; }
    if (siteURL.startsWith("http://")) {
        console.debug("Replacing http with https...");
        siteURL = siteURL.replace("http://", "https://");
    }
    if (!siteURL.startsWith("https://")) {
        console.debug("Prepending https:// to URL...");
        siteURL = "https://" + siteURL;
    }

    console.debug("Adding site:", siteName, siteURL);
    storage.appendSite({ name: siteName, url: siteURL, UUID: crypto.randomUUID() });
    loadUrls();
}

/**
 * Sets the list of sites in the UI.
 * If sites is provided, uses those sites, otherwise fetches site list from storage.
 * Obeys "sortLinks" and "launchInNewTab" settings.
 * @param {Site[]} sites 
 */
export function loadUrls(sites) {
    let siteList = document.getElementById("siteList");
    siteList.innerHTML = "";

    if (sites === undefined) {
        sites = storage.getSites();
    }
    if (localStorage.getItem("sortLinks") === "true") {
        sites = sites.toSorted((a, b) => a.name.localeCompare(b.name));
    }

    sites.forEach(function(site) {
        let link = document.createElement("a");
        link.href = site.url;
        link.dataset.UUID = site.UUID;
        link.textContent = site.name;
        link.className = "link";
        link.target = localStorage.getItem("launchInNewTab") === "true" ? "_blank" : "_self";
        link.rel = "noreferrer";
        if (getCurrentState() === STATES.EDIT) {
            link.onclick = removeSite;
            link.style.cursor = "pointer";
        }
        siteList.appendChild(link);
    }
    );
}

export function enterRemoveSitesMode() {
    console.debug("Entering edit mode...");
    setCurrentState(STATES.EDIT);
    loadUrls();
    document.getElementById("greeting").textContent = "Edit mode";
    document.getElementById("subGreeting").textContent = "Click a site to remove it. Press Escape to exit edit mode.";
    screenToggle("rightBox");
    setCurrentState(STATES.EDIT);
}

/**
 * Removes the site of the event's current target both from the UI and from storage, then updates the UI.
 * @param {Event} event 
 */
export function removeSite(event) {
    event.preventDefault();
    const site = event.currentTarget;
    const siteName = site.textContent;
    const siteUUID = site.dataset.UUID;
    console.debug("Removing site:", siteName, "UUID:", siteUUID);

    try {
        storage.removeSite(siteUUID);
        site.remove();
        clearCacheOnly();
    } catch (error) {
        console.error("Error removing site with UUID " + siteUUID + ":", error);
    }
}