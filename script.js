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

function loadUrls(sites) {
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
        link.textContent = site.name;
        link.className = "link";
        siteList.appendChild(link);
    }
    );
}

function jsonToToml(json) {
    return json.map(item => {
        return [
            '[[Site]]',
            'name = "' + item.name + '"',
            'url = "' + item.url + '"',
            ''
        ].join('\n');
    }).join('\n');
}

function tomlToJson(toml) {
    // Remove all lines that are not in the format of [[Site]], name = "something" or url = "something". Not foolproof but enough to allow comments etc.
    const wrongRegex = /^(?!\[\[Site\]\]$)(?!url = ".*"$)(?!name = ".*"$).*$/gm;
    toml = toml.replace(wrongRegex, "");

    const siteRegex = /\[\[Site\]\]\s*name\s*=\s*"([^"]+)"\s*url\s*=\s*"([^"]+)"/g;
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

// Apply greeting and sub-greeting.
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
            loadUrls();
        } else if (event.key === 'Backspace') {
            typedString = typedString.slice(0, -1);
            cachedSites = null;
            attemptLaunchTypedWord();
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

    if (localStorage.getItem("sortLinks") === "true") {
        document.getElementById("sortLinksCheckbox").checked = true;
    }
});

// Greeting and sub-greeting input listeners
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

let cachedSites = null;

function attemptLaunchTypedWord() {
    console.debug("Attempting to launch typed word:", typedString);
    console.debug("Cached sites:", cachedSites);

    if (cachedSites === null) {
        cachedSites = getSites();
    }

    const matchingSites = cachedSites.filter(site => site.name.toLowerCase().startsWith(typedString.toLowerCase()));
    cachedSites = matchingSites; // Cache the filtered list for faster subsequent filtering as the user types more characters

    
    loadUrls(matchingSites);

    // Launching of typed word if 1 match
    if (matchingSites.length === 1) {
        const site = matchingSites[0];
        console.debug("Launching site:", site, "for typed word:", typedString);
        window.open(site.url, "_blank");
        typedString = "";
        cachedSites = null; // Clear cache when resetting
        loadUrls();
    } else if (matchingSites.length === 0) {
        console.debug("No sites start with typed word:", typedString, "flushing typed string");
        typedString = "";
        cachedSites = null; // Clear cache when resetting
        loadUrls();
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

function toggleLinkSorting() {
    const sortLinksCheckbox = document.getElementById("sortLinksCheckbox");
    localStorage.setItem("sortLinks", sortLinksCheckbox.checked ? "true" : "false");
    loadUrls();
}