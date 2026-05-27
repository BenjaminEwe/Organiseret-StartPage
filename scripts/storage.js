export function getSites() {
    return JSON.parse(localStorage.getItem("sites")) || [];
}

export function setSites(sites) {
    localStorage.setItem("sites", JSON.stringify(sites));
}