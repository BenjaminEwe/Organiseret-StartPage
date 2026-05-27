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
        console.debug("Launching site:", site, "for typed word:", typedString);
        window.open(site.url, "_blank", "noopener,noreferrer");
        clearCache();
        loadUrls();
    } else if (cachedSites.length === 0) {
        console.debug("No sites start with typed word:", typedString, "flushing typed string");
        clearCache();
        loadUrls();
    } else {
        console.debug(cachedSites.length, "sites start with typed word:", typedString);
    }
}