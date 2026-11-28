import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

/**
 * False while the page is built on the server and during hydration, true after.
 * Use it for values that must not be in the static HTML (random values,
 * secrets) and for browser features that the server cannot see.
 */
export function useClient(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}
