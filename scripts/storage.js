/**
 * Handles interacting with localStorage for storing and retrieving sites.
 * Handles validation to prevent corruption of stored data, but does not handle any UI updates.
 * @typedef {import("./state.js").Site} Site
 */

/**
 * @returns The list of sites from localStorage, or an empty array if no sites are stored.
 * Each site is an object with "name", "url", and "UUID" properties.
 * The list of sites is stored as a JSON string in localStorage under the key "sites".
 */
export function getSites() {
    return JSON.parse(localStorage.getItem("sites")) || [];
}

/**
 * Sets the list of sites in localStorage.
 * @param {Site[]} sites 
 * @throws {Error} if any site in the list is missing required properties or has properties of the wrong type. Propagated from verifySite.
 */
export function setSites(sites) {
    for (const site of sites) {
        verifySite(site);
    }
    localStorage.setItem("sites", JSON.stringify(sites));
}

/**
 * Adds a site to the list of sites in localStorage.
 * @param {Site} site 
 * @throws {Error} if name, url, or UUID properties are missing or not strings. Propagated from verifySite.
 */
export function appendSite(site) {
    verifySite(site);
    const sites = getSites();
    sites.push(site);
    setSites(sites);
}

/**
 * Removes a site from the list of sites in localStorage.
 * @param {string} siteUUID
 * @throws {Error} if no site with the given UUID exists in storage.
 */
export function removeSite(siteUUID) {
    let sites = getSites();
    if (!sites.some(s => s.UUID === siteUUID)) {
        throw new Error("No site with UUID " + siteUUID + " found in storage.");
    }
    console.debug("Removing site with UUID:", siteUUID, "Site:", sites.filter(s => s.UUID === siteUUID));
    sites = sites.filter(s => !(s.UUID === siteUUID));
    setSites(sites);
}

/**
 * Verifies that a site object has the required properties.
 * @param {Site} site 
 * @throws {Error} if any required property is missing or has the wrong type.
 */
function verifySite(site) {
    if (!site || typeof site !== "object" || !site.name || !site.url || !site.UUID || typeof site.name !== "string" || typeof site.url !== "string" || typeof site.UUID !== "string") {
        throw new Error("Invalid site object. Must have 'name', 'url', and 'UUID' string properties.");
    }
}