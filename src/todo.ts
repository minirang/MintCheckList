import { save, load, Todo } from "./storage.js";
let todos: Todo[] = [];
export async function setupTodo() {
    const input = document.getElementById("todo-input") as HTMLInputElement;
    const addBtn = document.getElementById("add-btn")!;
    const list = document.getElementById("todo-list")!;
    const exportBtn = document.getElementById("export-btn")!;
    const importBtn = document.getElementById("import-btn")!;
    const importInput = document.getElementById("import-input") as HTMLInputElement;
    const clearDoneBtn = document.getElementById("clear-done-btn")!;
    const clearAllBtn = document.getElementById("clear-all-btn")!;
    const statsText = document.getElementById("stats-text")!;
    const progressBar = document.getElementById("progress")!;
    todos = await load();
    render();
    function render() {
        list.innerHTML = "";
        todos.forEach((todo, i) => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = todo.text;
            if (todo.done) span.classList.add("done");
            span.onclick = () => {
                todo.done = !todo.done;
                save(todos);
                render();
            };
            const del = document.createElement("button");
            del.textContent = "삭제";
            del.onclick = () => {
                todos.splice(i, 1);
                save(todos);
                render();
            };
            li.appendChild(span);
            li.appendChild(del);
            list.appendChild(li);
        });
        const total = todos.length;
        const done = todos.filter(t => t.done).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        statsText.textContent = `완료 ${done} / ${total} (${percent}%)`;
        progressBar.style.width = percent + "%";
    }
    addBtn.onclick = () => {
        if (!input.value.trim()) return;
        todos.push({ text: input.value, done: false });
        input.value = "";
        save(todos);
        render();
    };
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addBtn.click();
    });
    clearDoneBtn.onclick = () => {
        todos = todos.filter(t => !t.done);
        save(todos);
        render();
    };
    clearAllBtn.onclick = () => {
        if (!confirm("전체 삭제할까요?")) return;
        todos = [];
        save(todos);
        render();
    };
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(todos)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "checklist.mcl";
        a.click();
        URL.revokeObjectURL(url);
    };
    importBtn.addEventListener("click", () => {
        importInput.value = "";
        importInput.click();
    });
    importInput.addEventListener("change", () => {
        const file = importInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const raw = reader.result as string;
                const data = JSON.parse(raw);
                if (!Array.isArray(data)) throw new Error();
                todos = data.map((item: any) => ({
                    text: String(item.text),
                    done: Boolean(item.done),
                }));
                save(todos);
                render();
            } catch (e) {
                console.error(e);
                alert("파일 형식 오류");
            }
        };
        reader.readAsText(file);
    });
}