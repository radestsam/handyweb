import { useId, useState } from "react";
import { CopyButton, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { DATASET, searchMime } from "./logic";

export default function MimeTypes({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [query, setQuery] = useState("");
    const id = useId();
    const results = searchMime(query);

    return (
        <div className="flex flex-col gap-5">
            <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                {t("search")}
                <input
                    id={id}
                    type="search"
                    dir="auto"
                    autoComplete="off"
                    placeholder=".webp · application/json · فونت"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </label>
            {results.length === 0 ? (
                <p className="text-sm text-muted">{t("none")}</p>
            ) : (
                <ul
                    className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border bg-bg"
                    data-mime-list=""
                >
                    {results.map((entry) => (
                        <li
                            key={entry.type}
                            className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-3"
                            data-mime={entry.type}
                        >
                            <span className="flex min-w-0 flex-1 items-center gap-1">
                                <Ltr as="code" className="font-mono text-sm break-all">
                                    {entry.type}
                                </Ltr>
                                <CopyButton text={entry.type} locale={locale} compact />
                            </span>
                            <Ltr className="font-mono text-xs text-muted sm:w-32">
                                {entry.extensions.map((extension) => `.${extension}`).join(" ")}
                            </Ltr>
                            <span className="text-sm sm:w-56">{entry.description[locale]}</span>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-xs text-muted">{t("warning")}</p>
            <p className="text-xs text-muted">
                {t("source")} <Ltr>{DATASET.version}</Ltr>.
            </p>
            <input
                type="hidden"
                value={results.map((entry) => entry.type).join(",")}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
