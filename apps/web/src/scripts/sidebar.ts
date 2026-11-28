import { normalizeForSearch } from "@handyweb/core/i18n";

/*
 * The tool sidebar (components/Sidebar.astro).
 *
 * - Scrolls the open tool into the middle of the sidebar. Only the sidebar
 *   scrolls, so the page does not move.
 * - Filters the list as the visitor types. The query stays on the device.
 * - Below the lg breakpoint, opens and closes the sidebar as a drawer.
 */

const WIDE = "(min-width: 64rem)";

/** Hides the tools that do not match every word of the query. Returns the number of matches. */
export function filterGroups(groups: HTMLDetailsElement[], query: string): number {
    const words = normalizeForSearch(query).split(" ").filter(Boolean);
    let total = 0;
    for (const group of groups) {
        let shown = 0;
        for (const item of group.querySelectorAll<HTMLLIElement>("li[data-terms]")) {
            const terms = item.dataset.terms ?? "";
            const match = words.every((word) => terms.includes(word));
            item.hidden = !match;
            if (match) shown += 1;
        }
        const category = group.querySelector<HTMLLIElement>("li:not([data-terms])");
        if (category) category.hidden = words.length > 0;
        group.hidden = shown === 0;
        // While a query is typed, every group with a match is open. Without a
        // query, only the group of the open page is open.
        group.open = words.length > 0 ? shown > 0 : group.hasAttribute("data-active");
        total += shown;
    }
    return total;
}

function setup(sidebar: HTMLElement) {
    const filter = sidebar.querySelector<HTMLInputElement>("[data-sidebar-filter]");
    const status = sidebar.querySelector<HTMLElement>("[data-sidebar-status]");
    const close = sidebar.querySelector<HTMLButtonElement>("[data-sidebar-close]");
    const backdrop = document.querySelector<HTMLElement>("[data-sidebar-backdrop]");
    const groups = [...sidebar.querySelectorAll<HTMLDetailsElement>("[data-sidebar-group]")];
    const wide = window.matchMedia(WIDE);
    let opener: HTMLElement | null = null;

    // The open tool sits in the middle of the sidebar's own scroll area.
    const current = sidebar.querySelector<HTMLElement>('.sidebar-body [aria-current="page"]');
    const body = sidebar.querySelector<HTMLElement>(".sidebar-body");
    if (current && body && current.offsetTop + current.offsetHeight > body.clientHeight) {
        const top = current.offsetTop - body.clientHeight / 2 + current.clientHeight / 2;
        body.scrollTop = Math.max(0, top);
    }

    filter?.addEventListener("input", () => {
        const found = filterGroups(groups, filter.value);
        if (status) status.textContent = found === 0 ? (status.dataset.empty ?? "") : "";
    });
    filter?.addEventListener("keydown", (event) => {
        // Enter opens the first match.
        if (event.key !== "Enter" || filter.value.trim() === "") return;
        const first = sidebar.querySelector<HTMLAnchorElement>("li[data-terms]:not([hidden]) a");
        if (first) {
            event.preventDefault();
            first.click();
        }
    });

    // The rest of the page, which is inert while the drawer is open: every
    // child of <body> and of the shell, except the shell, the sidebar, and
    // the backdrop.
    const shell = sidebar.parentElement;
    const outside = () =>
        [...document.body.children, ...(shell ? shell.children : [])].filter(
            (el): el is HTMLElement =>
                el instanceof HTMLElement &&
                el !== shell &&
                el !== sidebar &&
                el !== backdrop &&
                el.tagName !== "SCRIPT",
        );

    const isOpen = () => sidebar.hasAttribute("data-open");

    const open = (from: HTMLElement | null) => {
        if (wide.matches || isOpen()) {
            filter?.focus();
            return;
        }
        opener = from;
        sidebar.setAttribute("data-open", "");
        sidebar.setAttribute("role", "dialog");
        sidebar.setAttribute("aria-modal", "true");
        if (backdrop) backdrop.hidden = false;
        for (const el of outside()) el.inert = true;
        document.documentElement.classList.add("sidebar-lock");
        filter?.focus();
    };

    const shut = () => {
        if (!isOpen()) return;
        sidebar.removeAttribute("data-open");
        sidebar.removeAttribute("role");
        sidebar.removeAttribute("aria-modal");
        if (backdrop) backdrop.hidden = true;
        for (const el of outside()) el.inert = false;
        document.documentElement.classList.remove("sidebar-lock");
        opener?.focus();
        opener = null;
    };

    for (const button of document.querySelectorAll<HTMLElement>("[data-sidebar-open]")) {
        button.addEventListener("click", (event) => {
            // Without this script, the Tools tab is a plain link to /tools/.
            event.preventDefault();
            open(button);
        });
    }
    close?.addEventListener("click", shut);
    backdrop?.addEventListener("click", shut);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) {
            shut();
            return;
        }
        // "/" or Ctrl+K (Cmd+K on a Mac) goes to the filter field. "/" does
        // nothing while the visitor types in a field.
        const target = event.target as HTMLElement | null;
        const typing =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target?.isContentEditable === true;
        const slash = event.key === "/" && !typing && !event.ctrlKey && !event.metaKey;
        const k = event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey);
        if (slash || k) {
            event.preventDefault();
            open(document.activeElement instanceof HTMLElement ? document.activeElement : null);
        }
    });
    // A drawer that is open when the window gets wide becomes the column.
    wide.addEventListener("change", () => {
        if (wide.matches) shut();
    });
}

const sidebar = document.querySelector<HTMLElement>("[data-sidebar]");
if (sidebar) setup(sidebar);
