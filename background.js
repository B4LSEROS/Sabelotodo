const { browserAction } = chrome;

function fetchDefinition(word) {
    const apiUrl = `https://owlbot.info/api/v4/dictionary/${word}`;
    const headers = {
        Authorization: `Token 274ab34a173727032ecca66b78d6c7dfe2bd7331`
    };
    return fetch(apiUrl, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to fetch definition");
            }
            return response.json();
        })
        .then(data => {
            const definition = data.definitions[0];
            return {
                word: data.word,
                definition: definition.definition,
                example: definition.example
            };
        });
}

function handleClick() {
    console.log("Button clicked");
}

function handleSelection(info) {
    if (info.menuItemId !== "sabelotodo") {
        return;
    }

    const selectedText = info.selectionText.trim();
    if (selectedText.length === 0) {
        return;
    }

    fetchDefinition(selectedText).then(data => {
        const definition = data.definition || "No definition found";
        const example = data.example || "No example found";
        const message = `Definition of ${data.word}:\n${definition}\nExample:\n${example}`;
        alert(message);
    });
}

browserAction.onClicked.addListener(handleClick);

chrome.contextMenus.create({
    id: "sabelotodo",
    title: "Sabelotodo",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(handleSelection);
