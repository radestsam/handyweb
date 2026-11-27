import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { flagLabels, strings } from "./i18n";
import { parseUrl, type ParsedUrl } from "./logic";

export default function UrlParser({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<ParsedUrl> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: parseUrl(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);
    const url = result?.ok ? result.value : null;

    const rows: Array<[keyof typeof strings, string]> = url
        ? [
              ["protocol", url.protocol],
              ...(url.username
                  ? ([["username", url.username]] as Array<[keyof typeof strings, string]>)
                  : []),
              ...(url.password
                  ? ([["password", url.password]] as Array<[keyof typeof strings, string]>)
                  : []),
              ["host", url.hostname],
              ...(url.hostnameUnicode !== url.hostname
                  ? ([["hostUnicode", url.hostnameUnicode]] as Array<
                        [keyof typeof strings, string]
                    >)
                  : []),
              [
                  "port",
                  url.port || (url.defaultPort ? `${url.defaultPort} (${t("defaultPort")})` : ""),
              ],
              ["path", url.segments.length ? `/${url.segments.join("/")}` : "/"],
              ...(url.hash ? ([["hash", url.hash]] as Array<[keyof typeof strings, string]>) : []),
          ]
        : [];

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("url")}
                </label>
                <textarea
                    id={inputId}
                    dir="ltr"
                    rows={3}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                    placeholder="https://…"
                    className="w-full resize-y rounded-xl border border-border bg-surface-2/60 px-4 py-3 font-mono text-sm break-all text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </div>
            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}
            {url && (
                <>
                    {url.addedScheme && (
                        <p className="-mt-2 text-xs text-muted">{t("addedScheme")}</p>
                    )}
                    <section
                        className={
                            url.flags.length
                                ? "rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                                : "rounded-2xl border border-border bg-bg px-4 py-3 text-sm"
                        }
                        data-tool-flags={url.flags.join(" ")}
                    >
                        <h2 className="font-semibold">{t("flags")}</h2>
                        {url.flags.length === 0 ? (
                            <p className="mt-1 text-muted">{t("noFlags")}</p>
                        ) : (
                            <ul className="mt-1 list-disc ps-5">
                                {url.flags.map((flag) => (
                                    <li key={flag}>{flagLabels[flag][locale]}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                    <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                        <h2 className="border-b border-border/70 px-4 py-2.5 text-xs font-semibold text-muted">
                            {t("parts")}
                        </h2>
                        <dl className="divide-y divide-border/50">
                            {rows.map(([key, value]) => (
                                <div key={key} className="flex items-center gap-3 px-4 py-2">
                                    <dt className="w-32 shrink-0 text-xs text-muted">{t(key)}</dt>
                                    <dd className="min-w-0 flex-1 text-sm" data-part={key}>
                                        <bdi className="font-mono break-all">{value}</bdi>
                                    </dd>
                                    <CopyButton text={value} locale={locale} compact />
                                </div>
                            ))}
                        </dl>
                    </section>
                    {url.params.length > 0 && (
                        <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                            <h2 className="border-b border-border/70 px-4 py-2.5 text-xs font-semibold text-muted">
                                {t("query")}
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm" data-tool-params>
                                    <thead className="text-xs text-muted">
                                        <tr className="border-b border-border/70">
                                            <th
                                                scope="col"
                                                className="px-4 py-2 text-start font-semibold"
                                            >
                                                {t("name")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-4 py-2 text-start font-semibold"
                                            >
                                                {t("value")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {url.params.map(([name, value], index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-border/40 last:border-b-0"
                                            >
                                                <td className="px-4 py-1.5">
                                                    <Ltr as="code" className="font-mono">
                                                        {name}
                                                    </Ltr>
                                                </td>
                                                <td className="px-4 py-1.5">
                                                    <bdi className="font-mono break-all">
                                                        {value}
                                                    </bdi>
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
            <input type="hidden" value={url?.href ?? ""} readOnly data-tool-output="" />
        </div>
    );
}
