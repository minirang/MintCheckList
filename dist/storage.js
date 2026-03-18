const KEY = "mint-checklist";
export function save(todos) {
    chrome.storage.local.set({ [KEY]: todos });
}
export function load() {
    return new Promise((resolve) => {
        chrome.storage.local.get([KEY], (result) => {
            const data = result[KEY];
            if (!Array.isArray(data)) {
                resolve([]);
                return;
            }
            resolve(data);
        });
    });
}
