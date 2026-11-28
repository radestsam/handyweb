import { useId, useState, type DragEvent } from "react";
import type { Locale } from "../i18n/locales";
import { cx } from "./cx";
import { UI_STRINGS } from "./strings";

/**
 * A file picker that also accepts a dropped file. It is a real file input, so
 * keyboard and screen-reader users can use it without the drop area. The file
 * stays in the browser; this component only hands it to the tool.
 *
 * With `onFiles`, the picker accepts more than one file and gives all of them
 * to the tool in the order of the file list.
 */
export function FileDrop({
    locale,
    accept,
    onFile,
    onFiles,
    hint,
}: {
    locale: Locale;
    accept?: string | undefined;
    hint?: string | undefined;
} & (
    | { onFile: (file: File) => void; onFiles?: undefined }
    | { onFiles: (files: File[]) => void; onFile?: undefined }
)) {
    const id = useId();
    const [over, setOver] = useState(false);
    const multiple = onFiles !== undefined;

    const take = (list: FileList | null | undefined) => {
        const picked = [...(list ?? [])];
        if (picked.length === 0) return;
        if (onFiles) onFiles(picked);
        else onFile?.(picked[0] as File);
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setOver(false);
        take(event.dataTransfer.files);
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
                "flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed px-6 py-10 text-center text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus",
                over ? "border-primary bg-primary-soft" : "border-border bg-surface-2",
            )}
        >
            <span className="font-semibold text-primary-text">
                {(multiple ? UI_STRINGS.chooseFiles : UI_STRINGS.chooseFile)[locale]}
            </span>
            <span className="text-muted">
                {(multiple ? UI_STRINGS.dropFiles : UI_STRINGS.dropFile)[locale]}
            </span>
            {hint && <span className="text-xs text-muted">{hint}</span>}
            <input
                id={id}
                type="file"
                accept={accept}
                multiple={multiple}
                className="sr-only"
                onChange={(event) => {
                    take(event.target.files);
                    event.target.value = "";
                }}
            />
        </label>
    );
}
