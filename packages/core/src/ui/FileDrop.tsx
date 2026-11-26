import { useId, useState, type DragEvent } from "react";
import type { Locale } from "../i18n/locales";
import { cx } from "./cx";
import { UI_STRINGS } from "./strings";

/**
 * A file picker that also accepts a dropped file. It is a real file input, so
 * keyboard and screen-reader users can use it without the drop area. The file
 * stays in the browser; this component only hands it to the tool.
 */
export function FileDrop({
    locale,
    accept,
    onFile,
    hint,
}: {
    locale: Locale;
    accept?: string | undefined;
    onFile: (file: File) => void;
    hint?: string | undefined;
}) {
    const id = useId();
    const [over, setOver] = useState(false);

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setOver(false);
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
    };

    return (
        <label
            htmlFor={id}
            onDragOver={(event) => {
                event.preventDefault();
                setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
            className={cx(
                "flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 border-dashed p-6 text-center text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus",
                over ? "border-primary bg-surface-2" : "border-border bg-surface",
            )}
        >
            <span className="font-semibold text-primary-text">{UI_STRINGS.chooseFile[locale]}</span>
            <span className="text-muted">{UI_STRINGS.dropFile[locale]}</span>
            {hint && <span className="text-xs text-muted">{hint}</span>}
            <input
                id={id}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onFile(file);
                    event.target.value = "";
                }}
            />
        </label>
    );
}
