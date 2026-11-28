/*
 * Registers the service worker in the production build only, so that the
 * development server always serves fresh files. The worker caches only static
 * files of the site (integrations/service-worker.js).
 */
if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    });
}
