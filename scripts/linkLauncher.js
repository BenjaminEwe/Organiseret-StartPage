import { clearCache, filterOrSites, getTypedString, getCachedSites } from "./state.js";
import { getSites } from "./storage.js";
import { loadUrls } from "./ui.js";

export function updateSiteCache() {
    loadUrls(filterOrSites(getSites()));
    highlightTypedString(getTypedString());
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
            console.debug("Auto-launching is enabled, launching site:", site);
            console.debug("launching with target:", (localStorage.getItem("launchInNewTab") === "true" ? "_blank" : "_self"));
            window.open(
                site.url,
                (localStorage.getItem("launchInNewTab") === "true" ? "_blank" : "_self"),
                "noreferrer");
            clearCache();
            loadUrls();
        } else {
            console.debug("Auto-launching is disabled, not launching site:", site);
        }
    } else if (cachedSites.length === 0) {
        console.debug("No sites start with typed word:", typedString, "flushing typed string");
        clearCache();
        loadUrls();
    } else {
        console.debug(cachedSites.length, "sites start with typed word:", typedString);
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
        const name = siteElement.textContent ?? "";
        const prefixLength = Math.min(typedLength, name.length);
        if (prefixLength === 0) {
            siteElement.textContent = name;
            continue;
        }

        const firstPart = name.substring(0, prefixLength);
        const restPart = name.substring(prefixLength);
        siteElement.textContent = "";

        const highlighted = document.createElement("span");
        highlighted.className = "highlighted";
        highlighted.textContent = firstPart;

        siteElement.appendChild(highlighted);
        siteElement.appendChild(document.createTextNode(restPart));
    }
}