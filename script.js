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
    loadUrls();
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

function TomlToJson(toml) {
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
            let sites = TomlToJson(toml);
            setSites(sites);
            loadUrls();
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

function loadGreeting() {
    let greeting = localStorage.getItem("greeting") || "Welcome!";
    document.getElementById("greeting").textContent = greeting;
}

function loadInnerImage() {
    const imageElement = document.getElementById("innerImage");
    if (!imageElement) {
        return;
    }

    const fullSrc = imageElement.dataset.fullSrc;
    if (!fullSrc) {
        return;
    }

    const fullImage = new Image();
    fullImage.src = fullSrc;
    fullImage.onload = function() {
        imageElement.src = fullSrc;
    };
}

function toggleButtonVisibility(ID) {
    const button = document.getElementById(ID);
    if (button.style.display === "none") {
        button.style.display = "block";
        localStorage.setItem(ID + "Visible", "true");
    } else {
        button.style.display = "none";
        localStorage.setItem(ID + "Visible", "false");
    }
}

function toggleSettingsButton() {
    const settingsIcon = document.getElementById("settingsIcon");
    if (settingsIcon.style.display === "none") {
        settingsIcon.style.display = "block";
        localStorage.setItem("settingsIconVisible", "true");
    } else {
        settingsIcon.style.display = "none";
        localStorage.setItem("settingsIconVisible", "false");
    }
}



function loadIconVisibility() {
    const settingsIcon = document.getElementById("settingsIcon");
    const isSettingsVisible = localStorage.getItem("settingsIconVisible");
    if (isSettingsVisible === "false") {
        settingsIcon.style.display = "none";
    }
    const creditsLink = document.getElementById("creditsLink");
    const isCreditsVisible = localStorage.getItem("creditsLinkVisible");
    if (isCreditsVisible === "false") {
        creditsLink.style.display = "none";
    }
}

document.addEventListener('keydown', function(event) {
    const target = event.target;
    const isTypingInField = target instanceof HTMLElement && (
        target.matches('input, textarea, select') ||
        target.isContentEditable
    );

    if (isTypingInField) {
        return;
    }

    if (event.key === 's' && event.ctrlKey) {
        event.preventDefault();
        screenToggle('settings');
    }

    if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault();
        screenToggle('credits');
    }
});

window.addEventListener("load", loadInnerImage);

document.addEventListener("DOMContentLoaded", () => {
    loadUrls();
    loadGreeting();
    loadIconVisibility();
    loadInnerImage();
});