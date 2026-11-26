import { useSyncExternalStore } from "react";
import type { Locale } from "../i18n/locales";
import { PaneAction } from "./PaneAction";
import { UI_STRINGS } from "./strings";

const canRead = () =>
    typeof navigator !== "undefined" && typeof navigator.clipboard?.readText === "function";

/**
 * Pastes the clipboard into a pane. The browser asks the user first. Shown only
 * where the browser can read the clipboard.
 */
export function PasteButton({
    locale,
    onPaste,
}: {
    locale: Locale;
    onPaste: (text: string) => void;
}) {
    const supported = useSyncExternalStore(
        () => () => undefined,
        canRead,
        () => false,
    );
    if (!supported) return null;
    return (
        <PaneAction
            icon="paste"
            label={UI_STRINGS.paste[locale]}
            onClick={async () => {
                try {
                    onPaste(await navigator.clipboard.readText());
                } catch {
                    // The user declined, or the browser blocked it. Typing still works.
                }
            }}
        />
    );
}
