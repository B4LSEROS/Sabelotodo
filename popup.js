const { browserAction } = chrome;

function fetchDefinition(word) {
    const apiUrl = `https://api.openai.com/v1/definitions?model=davinci&query=${word}`;
    const headers = {
        Authorization: `Bearer YOUR_OPENAI_API_KEY_HERE`
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

browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ url: "popup.html" });
});

chrome.contextMenus.create({
    id: "sabelotodo",
    title: "Sabelotodo",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(handleSelection);

