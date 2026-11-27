import { useId, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { calculate } from "./logic";

export default function IpCalculator({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [text, setText] = useState("");
    const id = useId();
    let subnet = null;
    let error = null;
    if (text.trim()) {
        try {
            subnet = calculate(text);
        } catch (caught) {
            error = toToolError(caught);
        }
    }
    const count = (value: bigint) =>
        value > 10n ** 15n
            ? `2^${value.toString(2).length - 1}`
            : Number(value).toLocaleString(locale === "fa" ? "fa-IR" : "en");

    const rows: Array<[keyof typeof strings, string, boolean]> = subnet
        ? [
              ["address", `${subnet.address}/${subnet.prefix}`, true],
              ["network", subnet.network, true],
              ...(subnet.broadcast
                  ? ([["broadcast", subnet.broadcast, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : [["last", subnet.last, true] as [keyof typeof strings, string, boolean]]),
              ...(subnet.mask
                  ? ([["mask", subnet.mask, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(subnet.wildcard
                  ? ([["wildcard", subnet.wildcard, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(subnet.binaryMask
                  ? ([["binaryMask", subnet.binaryMask, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ["range", `${subnet.firstHost} – ${subnet.lastHost}`, true],
              ["addresses", count(subnet.addresses), false],
              ["hosts", count(subnet.hosts), false],
              ["special", subnet.special ? subnet.special[locale] : t("public"), false],
          ]
        : [];

    return (
        <div className="flex flex-col gap-5">
            <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
                {t("input")}
                <input
                    id={id}
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="192.168.1.10/24 · 10.0.0.1 255.255.240.0 · 2001:db8::1/64"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
            </label>
            {error && <ErrorMessage error={error} locale={locale} />}
            {subnet && (
                <dl
                    className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border bg-bg text-sm"
                    aria-live="polite"
                >
                    {rows.map(([key, value, code]) => (
                        <div
                            key={key}
                            className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:items-center sm:gap-3"
                        >
                            <dt className="shrink-0 text-xs text-muted sm:w-44">{t(key)}</dt>
                            <dd className="flex min-w-0 flex-1 items-center gap-2" data-ip={key}>
                                {code ? (
                                    <Ltr as="code" className="min-w-0 flex-1 font-mono break-all">
                                        {value}
                                    </Ltr>
                                ) : (
                                    <span className="flex-1 tabular-nums">{value}</span>
                                )}
                                {code && <CopyButton text={value} locale={locale} compact />}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={subnet ? `${subnet.network}/${subnet.prefix}` : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
