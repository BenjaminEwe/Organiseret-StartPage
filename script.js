// Go between different screens (main, settings, credits)
function screenToggle(ID) {
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
    }
}

function addSite() {
    console.debug("Adding site...");
    let siteName = document.querySelector(".inputField[placeholder='Site name']").value;
    let siteURL = document.querySelector(".inputField[placeholder='Site URL']").value;

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
    sites.push({ name: siteName, url: siteURL });

    setSites(sites);
}

function loadUrls() {
    let siteList = document.getElementById("siteList");
    siteList.innerHTML = "";

    let sites = getSites();

    sites.forEach(function(site) {
        let link = document.createElement("a");
        link.href = site.url;
        link.textContent = site.name;
        link.className = "link";
        siteList.appendChild(link);
    }
    );
}

function jsonToToml(json) {
    return json.map(item => {
        return [
            '[Site]',
            'name = "' + item.name + '"',
            'url = "' + item.url + '"',
            ''
        ].join('\n');
    }).join('\n');
}

function tomlToJson(toml) {
    const siteRegex = /\[Site\]\s*name\s*=\s*"([^"]+)"\s*url\s*=\s*"([^"]+)"/g;
    const sites = [];
    let match;
    while ((match = siteRegex.exec(toml)) !== null) {
        sites.push({ name: match[1], url: match[2] });
    }
    return sites;
}

function getSites() {
    return JSON.parse(localStorage.getItem("sites")) || [];
}

function setSites(sites) {
    localStorage.setItem("sites", JSON.stringify(sites));
    loadUrls();
}

function downloadSites() {
    console.debug("Downloading sites...");
    let json = getSites();
    if (!json) {
        console.error("No sites to download");
        return;
    }
    let blob = new Blob([jsonToToml(json)], { type: "text/toml" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "sites.toml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function uploadSites() {
    console.debug("Uploading sites...");
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".toml";
    input.onchange = function(event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            let toml = e.target.result;
            let sites = tomlToJson(toml);
            setSites(sites);
        };
        reader.readAsText(file);
    }
    input.click();
}

function setGreeting() {
    console.debug("Setting greeting...");
    let greetingText = document.querySelector(".inputField[placeholder='Greeting text']").value;
    if (!greetingText) {
        console.error("Empty greeting text");
        return;
    }
    localStorage.setItem("greeting", greetingText);
    loadGreeting();
}

function toggleButtonVisibility(ID) {
    const button = document.getElementById(ID);
    if (localStorage.getItem(ID + "Visible") === "false") {
        button.style.display = "block";
        localStorage.setItem(ID + "Visible", "true");
    } else {
        button.style.display = "none";
        localStorage.setItem(ID + "Visible", "false");
    }
}

// Apply greeting and sub-greeting on load.
function loadGreeting() {
    let greeting = localStorage.getItem("greeting");
    let subGreeting = localStorage.getItem("subGreeting");
    if (greeting) {
        document.getElementById("greeting").textContent = greeting;
        document.getElementById("greetingInput").value = greeting;
    }
    if (subGreeting) {
        document.getElementById("subGreeting").textContent = subGreeting;
        document.getElementById("subGreetingInput").value = subGreeting;
    }
}

// Apply icon visibility settings on load.
function loadIconVisibility() {
    const settingsIcon = document.getElementById("settingsIcon");
    const isSettingsVisible = localStorage.getItem("settingsIconVisible");
    if (isSettingsVisible === "false") {
        settingsIcon.style.display = "none";
    } else {
        document.getElementById("showSettingsIconCheckbox").checked = true;
    }
    const creditsLink = document.getElementById("creditsLink");
    const isCreditsVisible = localStorage.getItem("creditsLinkVisible");
    if (isCreditsVisible === "false") {
        creditsLink.style.display = "none";
    } else {
        document.getElementById("showCreditsLinkCheckbox").checked = true;
    }
}

// Apply scroll-bar visibility settings on load.
function loadScrollBarVisibility() {
    const siteList = document.getElementById("siteList");
    const isScrollBarVisible = localStorage.getItem("scrollBarVisible");
    if (isScrollBarVisible === "false") {
        siteList.style.scrollbarWidth = "none";
    } else {
        document.getElementById("showScrollBarCheckbox").checked = true;
    }
}

// Apply animation speed settings on load.
function loadAnimationSpeed() {
    const speed = localStorage.getItem("animationSpeed");
    if (speed !== null) {
        document.getElementById("animationSpeedSlider").value = speed;
        updateAnimationSpeed();
    }
}

// Used by keydown event listener to keep track of what the user has typed, for launching sites by typing their name.
var typedString = "";

document.addEventListener('keydown', function(event) {
    if (event.key === 's' && event.ctrlKey) {
        event.preventDefault();
        screenToggle('settings');
    } else if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault();
        screenToggle('credits');
    // Only listen for typing if the main screen is visible.
    } else if (!document.getElementById("rightBox").classList.contains("hidden")) {
        if (event.key === 'Escape') {
            console.debug("Escape key pressed, flushed typed string");
            typedString = "";
        } else if (/^[a-zA-Z0-9]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
            typedString += event.key;
            attemptLaunchTypedWord();
        }
    }
});

// All the on-load stuff
document.addEventListener("DOMContentLoaded", () => {
    loadUrls();
    loadGreeting();
    loadIconVisibility();
    loadScrollBarVisibility();
    loadAnimationSpeed();
    // Set default sites if none.
    if (getSites().length === 0) {
        const defaultSites = [
            { name: "DuckDuckGo", url: "https://duck.com" },
            { name: "GitHub", url: "https://github.com" },
            { name: "Reddit", url: "https://reddit.com" },
            { name: "YouTube", url: "https://youtube.com" },
            { name: "GitLab", url: "https://gitlab.com" },
        ];
        setSites(defaultSites);
    }
});

greetingInput = document.getElementById("greetingInput");
greeting = document.getElementById("greeting");
greetingInput.addEventListener('input', e => {
    greeting.textContent = e.target.value;
    greetingInput.value = e.target.value;
    localStorage.setItem("greeting", e.target.value);
});
subGreetingInput = document.getElementById("subGreetingInput");
subGreeting = document.getElementById("subGreeting");
subGreetingInput.addEventListener('input', e => {
    subGreeting.textContent = e.target.value;
    subGreetingInput.value = e.target.value;
    localStorage.setItem("subGreeting", e.target.value);
});

// FireFox warning
if (navigator.userAgent.includes("Firefox")) {
    console.warn("Firefox does not support some web-standards used, though it seems they are working on it: https://bugzilla.mozilla.org/show_bug.cgi?id=1832409");
}

// Launching of typed word
function attemptLaunchTypedWord() {
    console.debug("Attempting to launch typed word:", typedString);
    const sites = getSites();
    const matchingSites = sites.filter(site => site.name.toLowerCase().startsWith(typedString.toLowerCase()));
    if (matchingSites.length === 1) {
        const site = matchingSites[0];
        console.debug("Launching site:", site, "for typed word:", typedString);
        window.open(site.url, "_blank");
        typedString = "";
    } else if (matchingSites.length === 0) {
        console.debug("No sites start with typed word:", typedString, "flushing typed string");
        typedString = "";
    } else {
        console.debug(matchingSites.length, "sites start with typed word:", typedString);
    }
}

function toggleScrollBar() {
    const siteList = document.getElementById("siteList");
    if (siteList.style.scrollbarWidth === "none") {
        siteList.style.scrollbarWidth = "auto";
        localStorage.setItem("scrollBarVisible", "true");
    } else {
        siteList.style.scrollbarWidth = "none";
        localStorage.setItem("scrollBarVisible", "false");
    }
}

function updateAnimationSpeed() {
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