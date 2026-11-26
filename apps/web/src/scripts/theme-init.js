// Runs in <head> before the first paint, so the page never flashes the wrong
// theme. It reads the one theme key (D5) and sets data-theme on <html>. It must
// stay small and synchronous. The CSP allows it by its SHA-256 hash, so any
// change here changes the hash: run `make build` and the header check.
(function () {
    var choice = "system";
    try {
        var saved = localStorage.getItem("handyweb:theme");
        if (saved === "light" || saved === "dark") choice = saved;
    } catch {
        // Storage is blocked. Follow the system.
    }
    var dark =
        choice === "dark" ||
        (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.themeChoice = choice;
})();
