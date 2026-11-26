import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/locales";
import { copyText } from "../files/output";
import { Button } from "./Button";
import { UI_STRINGS } from "./strings";

/** Copies text and announces the outcome to screen readers. */
export function CopyButton({
    text,
    locale,
    disabled,
}: {
    text: string;
    locale: Locale;
    disabled?: boolean | undefined;
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

    return (
        <>
            <Button variant="primary" onClick={onClick} disabled={disabled === true || text === ""}>
                {state === "copied" ? UI_STRINGS.copied[locale] : UI_STRINGS.copy[locale]}
            </Button>
            <span role="status" className="sr-only">
                {state === "copied"
                    ? UI_STRINGS.copied[locale]
                    : state === "failed"
                      ? UI_STRINGS.copyFailed[locale]
                      : ""}
            </span>
        </>
    );
}
