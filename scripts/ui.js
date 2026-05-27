import { getSites, setSites } from "./storage.js";
import { STATES, getCurrentState, setCurrentState, clearCacheOnly } from "./state.js";

// Go between different screens (main, settings, credits)
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
    let sites = getSites();
    sites.push({ name: siteName, url: siteURL, UUID: crypto.randomUUID() });

    setSites(sites);
    loadUrls();
}

export function loadUrls(sites) {
    let siteList = document.getElementById("siteList");
    siteList.innerHTML = "";

    if (sites === undefined) {
        sites = getSites();
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

export function removeSite(event) {
    event.preventDefault();
    const site = event.currentTarget;
    const siteName = site.textContent;
    const siteUUID = site.dataset.UUID;
    console.debug("Removing site:", siteName, "UUID:", siteUUID);

    let sites = getSites();
    console.debug(siteName, "Removing site:", sites.filter(s => s.UUID === siteUUID));

    sites = sites.filter(s => !(s.UUID === siteUUID));
    site.remove(); // Not strictly necessary but nice visual feedback.
    setSites(sites);
    clearCacheOnly();
    //loadUrls(filterOrSites(getSites()));
}