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
    const sites = [];
    const blocks = toml.split('[[Site]]').filter(block => block.trim() !== '');

    for (const block of blocks) {
        const nameMatch = block.match(/name\s*=\s*"([^"]+)"/);
        const urlMatch = block.match(/url\s*=\s*"([^"]+)"/);

        if (nameMatch && urlMatch) {
            sites.push({
                name: nameMatch[1],
                url: urlMatch[1],
                UUID: crypto.randomUUID()
            });
        }
    }
    return sites;
}

export function downloadSites(sites) {
    console.debug("Downloading sites...");
    if (sites.length === 0) {
        console.error("No sites to download");
        return;
    }
    let blob = new Blob([jsonToToml(sites)], { type: "text/toml" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "sites.toml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function uploadSites() {
    console.debug("Uploading sites...");
    return new Promise((resolve, reject) => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".toml";
        input.onchange = function(event) {
            let file = event.target.files[0];
            if (!file) {
                console.error("No file selected");
                reject("No file selected");
                return;
            }

            let reader = new FileReader();
            reader.onload = function(e) {
                let toml = e.target.result;
                let sites = tomlToJson(toml);
                resolve(sites);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        }
        input.click();
    });
}










    