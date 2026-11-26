import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/locales";
import { copyText } from "../files/output";
import { Button } from "./Button";
import { Icon } from "./icons";
import { PaneAction } from "./PaneAction";
import { UI_STRINGS } from "./strings";

/**
 * Copies text. The icon turns into a check and the label says "Copied" for two
 * seconds, and screen readers hear the outcome.
 */
export function CopyButton({
    text,
    locale,
    disabled,
    compact = false,
}: {
    text: string;
    locale: Locale;
    disabled?: boolean | undefined;
    /** The small pane-header form. */
    compact?: boolean;
}) {
    const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const onClick = async () => {
        const copied = await copyText(text);
        setState(copied ? "copied" : "failed");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("idle"), 2000);
    };

    const label = state === "copied" ? UI_STRINGS.copied[locale] : UI_STRINGS.copy[locale];
    const off = disabled === true || text === "";
    const status = (
        <span role="status" className="sr-only">
            {state === "copied"
                ? UI_STRINGS.copied[locale]
                : state === "failed"
                  ? UI_STRINGS.copyFailed[locale]
                  : ""}
        </span>
    );

    if (compact) {
        return (
            <>
                <PaneAction
                    icon={state === "copied" ? "check" : "copy"}
                    label={label}
                    onClick={onClick}
                    disabled={off}
                    className={state === "copied" ? "text-success hover:text-success" : undefined}
                    data-copy=""
                />
                {status}
            </>
        );
    }

    return (
        <>
            <Button variant="primary" onClick={onClick} disabled={off}>
                <Icon name={state === "copied" ? "check" : "copy"} />
                {label}
            </Button>
            {status}
        </>
    );
}
