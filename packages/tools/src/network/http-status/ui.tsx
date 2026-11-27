import { useId, useState } from "react";
import { Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { CLASSES, DATASET, searchStatus } from "./logic";

export default function HttpStatus({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState("all");
    const id = useId();
    const results = searchStatus(query).filter(
        (entry) => group === "all" || String(entry.code)[0] === group,
    );

    return (
        <div className="flex flex-col gap-5">
            <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                {t("search")}
                <input
                    id={id}
                    type="search"
                    dir="auto"
                    autoComplete="off"
                    placeholder="404 · redirect · کش"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </label>
            <Segmented<string>
                legend={t("group")}
                value={group}
                onChange={setGroup}
                options={[
                    { value: "all", label: t("all") },
                    ...CLASSES.map((item) => ({
                        value: String(item.digit),
                        label: `${item.digit}xx`,
                    })),
                ]}
            />
            {results.length === 0 ? (
                <p className="text-sm text-muted">{t("none")}</p>
            ) : (
                <ul className="flex flex-col gap-2" data-status-list="">
                    {results.map((entry) => (
                        <li
                            key={entry.code}
                            className="flex gap-3 rounded-2xl border border-border bg-bg p-3"
                            data-status={entry.code}
                        >
                            <span
                                className={`shrink-0 font-mono text-xl font-semibold ${entry.code >= 500 ? "text-error" : entry.code >= 400 ? "text-primary-text" : entry.code >= 300 ? "text-muted" : "text-success"}`}
                            >
                                <Ltr>{String(entry.code)}</Ltr>
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">
                                    {entry.name[locale]}
                                    {locale === "fa" && (
                                        <>
                                            {" "}
                                            <Ltr className="text-xs font-normal text-muted">
                                                {entry.name.en}
                                            </Ltr>
                                        </>
                                    )}
                                </p>
                                <p className="text-sm text-muted">{entry.description[locale]}</p>
                                <Ltr className="text-xs text-muted">{entry.reference}</Ltr>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <p className="text-xs text-muted">
                {t("source")} <Ltr>{DATASET.version}</Ltr>.
            </p>
            <input
                type="hidden"
                value={results.map((entry) => entry.code).join(",")}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
