export function toggleButtonVisibility(ID) {
    const button = document.getElementById(ID);
    if (localStorage.getItem(ID + "Visible") === "false") {
        button.style.display = "block";
        localStorage.setItem(ID + "Visible", "true");
    } else {
        button.style.display = "none";
        localStorage.setItem(ID + "Visible", "false");
    }
}

export function toggleScrollBar() {
    const siteList = document.getElementById("siteList");
    const isVisible = localStorage.getItem("scrollBarVisible") === "true";
    if (!isVisible) {
        siteList.style.scrollbarWidth = "auto";
        localStorage.setItem("scrollBarVisible", "true");
    } else {
        siteList.style.scrollbarWidth = "none";
        localStorage.setItem("scrollBarVisible", "false");
    }
}

export function updateAnimationSpeed() {
    const slider = document.getElementById("animationSpeedSlider");
    const speed = slider.value;
    localStorage.setItem("animationSpeed", speed);
    if (speed > 0) {
        document.documentElement.style.setProperty('--bg-animation-speed', 80 / speed + "s");
    } else {
        document.documentElement.style.setProperty('--bg-animation-speed', "0s");
    }
    console.debug("Updated animation speed to:", speed);
}

export function toggleLinkSorting() {
    const sortLinksCheckbox = document.getElementById("sortLinksCheckbox");
    localStorage.setItem("sortLinks", sortLinksCheckbox.checked ? "true" : "false");
}

export function updateFirefoxOffset() {
    const slider = document.getElementById("firefoxOffsetSlider");
    const offset = slider.value;
    localStorage.setItem("firefoxOffset", offset);
    document.documentElement.style.setProperty('--firefox-offset', offset + "px");
    console.debug("Updated Firefox offset to:", offset);
}