import { useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    CopyButton,
    cx,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { HEADER_DOCS } from "./docs";
import { checkLabels, strings } from "./i18n";
import { cookies, parseHeaders, securityChecks, type ParsedHeaders } from "./logic";

export default function HttpHeaderParser({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<ParsedHeaders> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: parseHeaders(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);
    const parsed = result?.ok ? result.value : null;
    const listing = parsed ? parsed.headers.map((h) => `${h.name}: ${h.value}`).join("\n") : "";
    const sensitive = parsed?.headers.some((h) => h.key === "cookie" || h.key === "authorization");
    const cookieList = parsed ? cookies(parsed.headers) : [];

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={t("headers")}
                locale={locale}
                code
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={UI_STRINGS.inputHere[locale]}
                className="min-h-48"
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
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {sensitive && (
                <p
                    role="note"
                    className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                >
                    ⚠ {t("sensitive")}
                </p>
            )}
            {parsed && (
                <>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                            <h2
                                className="text-xs font-semibold text-muted"
                                data-tool-kind={parsed.kind}
                            >
                                {t(parsed.kind)}
                                {parsed.startLine && (
                                    <>
                                        {" · "}
                                        <Ltr as="code" className="font-mono">
                                            {parsed.startLine}
                                        </Ltr>
                                    </>
                                )}
                            </h2>
                            <CopyButton text={listing} locale={locale} compact />
                        </div>
                        <ul className="divide-y divide-border/50" data-tool-headers>
                            {parsed.headers.map((header, index) => (
                                <li key={index} className="flex flex-col gap-0.5 px-4 py-2 text-sm">
                                    <Ltr as="code" className="font-mono font-semibold">
                                        {header.name}
                                    </Ltr>
                                    <Ltr as="code" className="font-mono text-xs break-all">
                                        {header.value}
                                    </Ltr>
                                    {HEADER_DOCS[header.key] && (
                                        <span className="text-xs text-muted">
                                            {HEADER_DOCS[header.key]?.[locale]}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                    {parsed.kind === "response" && (
                        <section className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm">
                            <h2 className="font-semibold">{t("security")}</h2>
                            <ul className="mt-2 flex flex-col gap-1" data-tool-security>
                                {securityChecks(parsed.headers).map((item) => (
                                    <li
                                        key={item.check}
                                        className="flex gap-2"
                                        data-check={item.check}
                                        data-ok={item.ok}
                                    >
                                        <span
                                            className={cx(
                                                "font-bold",
                                                item.ok ? "text-success" : "text-error",
                                            )}
                                            aria-hidden="true"
                                        >
                                            {item.ok ? "✓" : "✗"}
                                        </span>
                                        <span>
                                            {checkLabels[item.check][locale]}:{" "}
                                            {item.ok ? t("yes") : t("no")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {cookieList.length > 0 && (
                        <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                            <h2 className="border-b border-border/70 px-4 py-2.5 text-xs font-semibold text-muted">
                                {t("cookies")}
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-muted">
                                        <tr className="border-b border-border/70">
                                            {(
                                                ["name", "secure", "httpOnly", "sameSite"] as const
                                            ).map((key) => (
                                                <th
                                                    key={key}
                                                    scope="col"
                                                    className="px-4 py-2 text-start font-semibold"
                                                >
                                                    {t(key)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cookieList.map((cookie, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-border/40 last:border-b-0"
                                            >
                                                <td className="px-4 py-1.5">
                                                    <Ltr as="code" className="font-mono">
                                                        {cookie.name}
                                                    </Ltr>
                                                </td>
                                                <td className="px-4 py-1.5">
                                                    {cookie.secure ? "✓" : "✗"}
                                                </td>
                                                <td className="px-4 py-1.5">
                                                    {cookie.httpOnly ? "✓" : "✗"}
                                                </td>
                                                <td className="px-4 py-1.5">
                                                    {cookie.sameSite ?? "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </>
            )}
            <input type="hidden" value={listing} readOnly data-tool-output="" />
        </div>
    );
}
