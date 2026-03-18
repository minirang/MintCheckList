export type Todo = {
    text: string;
    done: boolean;
};
const KEY = "mint-checklist";
export function save(todos: Todo[]) {
    chrome.storage.local.set({ [KEY]: todos });
}
export function load(): Promise<Todo[]> {
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