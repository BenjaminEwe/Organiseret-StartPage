import { clearCache, filterOrSites, getTypedString, getCachedSites } from "./state.js";
import { getSites } from "./storage.js";
import { loadUrls } from "./ui.js";

export function updateSiteCache() {
    loadUrls(filterOrSites(getSites()));
}

export function attemptLaunchTypedWord() {
    const typedString = getTypedString();
    const cachedSites = getCachedSites();
    console.debug("Attempting to launch typed word:", getTypedString());

    if (cachedSites === null) {
        throw new Error("cachedSites should not be null when attempting to launch typed word.");
    }

    // Launching of typed word if 1 match
    if (cachedSites.length === 1) {
        const site = cachedSites[0];
        if (localStorage.getItem("doAutoLaunch") === "true") {
            console.debug("Auto-launching is enabled, launching site:", cachedSites[0]);
            console.debug("launching with target:", (localStorage.getItem("launchInNewTab") === "true" ? "_blank" : "_self"));
            window.open(
                cachedSites[0].url,
                (localStorage.getItem("launchInNewTab") === "true" ? "_blank" : "_self"),
                "noreferrer");
            clearCache();
            loadUrls();
        } else {
            console.debug("Auto-launching is disabled, not launching site:", cachedSites[0]);
            highlightTypedString(typedString);
        }
    } else if (cachedSites.length === 0) {
        console.debug("No sites start with typed word:", typedString, "flushing typed string");
        clearCache();
        loadUrls();
    } else {
        console.debug(cachedSites.length, "sites start with typed word:", typedString);
        highlightTypedString(typedString);
    }

    const firstSite = document.getElementById("siteList").getElementsByClassName("link")[0];
    if (firstSite) {
        firstSite.focus();
    }
}

function highlightTypedString(typedString) {
    const siteList = document.getElementById("siteList");
    const sites = siteList.getElementsByClassName("link");
    const typedLength = typedString.length;
    for (let siteElement of sites) {
        let name = siteElement.innerHTML;
        const firstPart = name.substring(0, typedLength);
        const restPart = name.substring(typedLength);
        siteElement.innerHTML = name.replace(firstPart, `<span class="highlighted">${firstPart}</span>`);
    }
}