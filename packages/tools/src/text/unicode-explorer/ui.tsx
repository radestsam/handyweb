import { useDeferredValue, useId, useMemo, useState } from "react";
import {
    CopyButton,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    cx,
    type ToolUiProps,
} from "@handyweb/core/ui";
import type { ToolError } from "@handyweb/core/runtime";
import { unicodeExplorerMeta } from "./meta";
import { groupLabels, strings } from "./i18n";
import { inspectText, toTsv, type CodePointInfo } from "./logic";

const MAX = unicodeExplorerMeta.limits?.maxInputBytes ?? Infinity;
/** U+25CC DOTTED CIRCLE: the base that a combining mark is shown on. */
const DOTTED_CIRCLE = String.fromCodePoint(0x25cc);

function Glyph({ row }: { row: CodePointInfo }) {
    if (row.invisible) {
        return (
            <span
                aria-hidden="true"
                className="inline-block h-6 w-4 rounded-sm border border-dashed border-muted"
            />
        );
    }
    return <span dir="auto">{row.group === "mark" ? DOTTED_CIRCLE + row.char : row.char}</span>;
}

export default function UnicodeExplorer({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const tableId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const format = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

    const deferred = useDeferredValue(text);
    const tooLarge = deferred.length > MAX;
    const result = useMemo(() => (tooLarge ? null : inspectText(deferred)), [deferred, tooLarge]);
    const tsv = result && result.rows.length > 0 ? toTsv(result.rows) : "";

    const error: ToolError | null = tooLarge
        ? {
              code: "too-large",
              message: { fa: "ورودی بیش از ۱ مگابایت است.", en: "The input is larger than 1 MB." },
          }
        : null;

    const counts = result
        ? ([
              ["codePoints", result.codePoints],
              ["graphemes", result.graphemes],
              ["utf8Bytes", result.utf8Bytes],
              ["utf16Units", result.utf16Units],
          ] as const)
        : [];

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={UI_STRINGS.input[locale]}
                locale={locale}
                value={text}
                stats={false}
                className="min-h-28"
                onChange={(event) => setText(event.target.value)}
                placeholder={UI_STRINGS.inputHere[locale]}
                actions={
                    <>
                        <PasteButton locale={locale} onPaste={setText} />
                        <PaneAction
                            icon="clear"
                            label={UI_STRINGS.clear[locale]}
                            onClick={() => setText("")}
                            disabled={text === ""}
                        />
                    </>
                }
                data-tool-input=""
            />

            {error && <ErrorMessage error={error} locale={locale} />}

            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-labelledby={tableId}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <h2 id={tableId} className="text-xs font-semibold text-muted">
                        {t("characters")}
                    </h2>
                    <CopyButton text={tsv} locale={locale} compact />
                </div>
                <dl className="grid grid-cols-2 gap-px bg-border/70 sm:grid-cols-4">
                    {counts.map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-0.5 bg-bg px-4 py-3">
                            <dt className="text-xs text-muted">{t(key)}</dt>
                            <dd className="text-lg font-bold tabular-nums" data-stat={key}>
                                {format.format(value)}
                            </dd>
                        </div>
                    ))}
                </dl>
                {result && result.rows.length > 0 ? (
                    <>
                        <div className="overflow-x-auto border-t border-border/70">
                            <table className="w-full text-sm" data-tool-table>
                                <thead className="text-xs text-muted">
                                    <tr className="border-b border-border/70">
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("char")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("codePoint")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("name")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("category")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            {t("script")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            UTF-8
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-2 text-start font-semibold"
                                        >
                                            UTF-16
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.rows.map((row, index) => (
                                        <tr
                                            key={index}
                                            data-invisible={row.invisible || undefined}
                                            className={cx(
                                                "border-b border-border/40 last:border-b-0",
                                                row.invisible && "bg-primary/8",
                                            )}
                                        >
                                            <td className="px-3 py-1.5 text-xl">
                                                <Glyph row={row} />
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap">
                                                <Ltr as="code" className="font-mono">
                                                    {row.label}
                                                </Ltr>
                                            </td>
                                            <td className="min-w-48 px-3 py-1.5">
                                                {row.name ? (
                                                    <Ltr className="font-mono text-xs">
                                                        {row.name}
                                                    </Ltr>
                                                ) : (
                                                    <span className="text-xs text-muted">
                                                        {t("noName")}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap">
                                                {groupLabels[row.group][locale]}{" "}
                                                <Ltr className="text-xs text-muted">
                                                    {row.category}
                                                </Ltr>
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap">
                                                <Ltr>{row.script}</Ltr>
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap">
                                                <Ltr as="code" className="font-mono text-xs">
                                                    {row.utf8 || "—"}
                                                </Ltr>
                                            </td>
                                            <td className="px-3 py-1.5 whitespace-nowrap">
                                                <Ltr as="code" className="font-mono text-xs">
                                                    {row.utf16}
                                                </Ltr>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col gap-1 border-t border-border/70 px-4 py-2 text-xs text-muted">
                            {result.rows.some((row) => row.invisible) && (
                                <p>{t("invisibleNote")}</p>
                            )}
                            {result.truncated && <p>{t("truncated")}</p>}
                        </div>
                    </>
                ) : (
                    <p className="border-t border-border/70 px-4 py-6 text-muted">
                        {UI_STRINGS.outputHere[locale]}
                    </p>
                )}
                <input type="hidden" value={tsv} readOnly data-tool-output="" />
            </section>
        </div>
    );
}
