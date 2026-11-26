import { normalizeForSearch } from "@handyweb/core/i18n";
import type { SearchEntry } from "../pages/search-index.json";

/*
 * The site search. It runs entirely in the browser: the index is a static file
 * and the query is never sent anywhere. It opens with the search button, "/",
 * or Ctrl+K (Cmd+K on a Mac).
 */

type Locale = "fa" | "en";

let index: SearchEntry[] | null = null;

async function loadIndex(): Promise<SearchEntry[]> {
    if (index) return index;
    const response = await fetch("/search-index.json");
    index = (await response.json()) as SearchEntry[];
    return index;
}

/** Ranks the entries for a query. Every word of the query must match. */
export function rank(entries: SearchEntry[], query: string): SearchEntry[] {
    const words = normalizeForSearch(query).split(" ").filter(Boolean);
    if (words.length === 0) return [];
    const scored: Array<[number, SearchEntry]> = [];
    for (const entry of entries) {
        let score = 0;
        let all = true;
        for (const word of words) {
            if (entry.titles.startsWith(word) || entry.titles.includes(` ${word}`)) score += 10;
            else if (entry.titles.includes(word)) score += 6;
            else if (entry.terms.includes(word)) score += 4;
            else if (entry.text.includes(word)) score += 1;
            else {
                all = false;
                break;
            }
        }
        if (all) scored.push([score, entry]);
    }
    return scored.sort((a, b) => b[0] - a[0]).map(([, entry]) => entry);
}

function setup(dialog: HTMLDialogElement) {
    const locale = (document.documentElement.lang === "en" ? "en" : "fa") as Locale;
    const input = dialog.querySelector<HTMLInputElement>("[data-search-input]");
    const list = dialog.querySelector<HTMLUListElement>("[data-search-results]");
    const status = dialog.querySelector<HTMLElement>("[data-search-status]");
    if (!input || !list || !status) return;
    const empty = status.dataset.empty ?? "";
    let results: SearchEntry[] = [];

    const links = () => [...list.querySelectorAll<HTMLAnchorElement>("a")];

    const render = () => {
        list.replaceChildren(
            ...results.slice(0, 20).map((entry) => {
                const item = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/${locale}/tools/${entry.slug}/`;
                link.className =
                    "block rounded-md px-3 py-2 text-text no-underline hover:bg-surface-2 focus:bg-surface-2";
                const title = document.createElement("span");
                title.className = "block font-semibold";
                title.textContent = entry.title[locale];
                const description = document.createElement("span");
                description.className = "block text-sm text-muted";
                description.textContent = entry.description[locale];
                link.append(title, description);
                item.append(link);
                return item;
            }),
        );
        status.textContent = input.value.trim() !== "" && results.length === 0 ? empty : "";
    };

    input.addEventListener("input", async () => {
        const entries = await loadIndex();
        results = rank(entries, input.value);
        render();
    });

    // Enter opens the best result. The arrow keys move between the results.
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const first = links()[0];
            if (first) {
                event.preventDefault();
                window.location.href = first.href;
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            links()[0]?.focus();
        }
    });

    list.addEventListener("keydown", (event) => {
        const all = links();
        const current = all.indexOf(document.activeElement as HTMLAnchorElement);
        if (current < 0) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            all[Math.min(current + 1, all.length - 1)]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (current === 0) input.focus();
            else all[current - 1]?.focus();
        }
    });

    dialog.addEventListener("click", (event) => {
        // A click on the backdrop closes the dialog.
        if (event.target === dialog) dialog.close();
    });

    const open = () => {
        if (dialog.open) return;
        dialog.showModal();
        input.select();
        void loadIndex();
    };

    for (const button of document.querySelectorAll("[data-search-open]")) {
        button.addEventListener("click", open);
    }
    document.addEventListener("keydown", (event) => {
        const target = event.target as HTMLElement | null;
        const typing = target?.closest("input, textarea, select, [contenteditable='true']");
        if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            open();
        } else if (event.key === "/" && !typing) {
            event.preventDefault();
            open();
        }
    });
}

const dialog =
    typeof document === "undefined"
        ? null
        : document.querySelector<HTMLDialogElement>("[data-search-dialog]");
if (dialog) setup(dialog);
