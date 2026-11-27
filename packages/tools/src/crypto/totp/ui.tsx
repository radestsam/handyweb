import { useEffect, useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { parseTotp, totpAt, type TotpAlgorithm, type TotpConfig } from "./logic";

export default function Totp({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const [algorithm, setAlgorithm] = useState<TotpAlgorithm>("SHA-1");
    const [digits, setDigits] = useState<"6" | "8">("6");
    const [codes, setCodes] = useState<{ code: string; next: string; remaining: number } | null>(
        null,
    );
    const inputId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const parsed = useMemo((): ToolResult<TotpConfig> | null => {
        if (text.trim() === "") return null;
        try {
            return { ok: true, value: parseTotp(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);
    const isLink = /^otpauth:/i.test(text.trim());
    const config = useMemo((): TotpConfig | null => {
        if (!parsed?.ok) return null;
        return isLink ? parsed.value : { ...parsed.value, algorithm, digits: Number(digits) };
    }, [parsed, isLink, algorithm, digits]);

    // A new code every period: check the clock every second.
    useEffect(() => {
        if (!config) return;
        let current = true;
        const tick = async () => {
            const now = Date.now();
            const [present, upcoming] = await Promise.all([
                totpAt(config, now),
                totpAt(config, now + config.period * 1000),
            ]);
            if (current)
                setCodes({ code: present.code, next: upcoming.code, remaining: present.remaining });
        };
        void tick();
        const timer = setInterval(() => void tick(), 1000);
        return () => {
            current = false;
            clearInterval(timer);
        };
    }, [config]);

    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);
    const grouped = (code: string) => code.replace(/^(\d{3,4})(\d{3,4})$/, "$1 $2");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-xs font-semibold text-muted">
                    {t("secret")}
                </label>
                <input
                    id={inputId}
                    dir="ltr"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="characters"
                    className="min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-base text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]"
                    data-tool-input=""
                />
                <p className="text-xs text-muted">{t("warning")}</p>
            </div>
            {!isLink && (
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                    <Segmented<TotpAlgorithm>
                        legend={t("algorithm")}
                        value={algorithm}
                        onChange={setAlgorithm}
                        options={(["SHA-1", "SHA-256", "SHA-512"] as const).map((value) => ({
                            value,
                            label: value,
                        }))}
                    />
                    <Segmented<"6" | "8">
                        legend={t("digits")}
                        value={digits}
                        onChange={setDigits}
                        options={[
                            { value: "6", label: number(6) },
                            { value: "8", label: number(8) },
                        ]}
                    />
                </div>
            )}
            {parsed && !parsed.ok && <ErrorMessage error={parsed.error} locale={locale} />}
            {config && codes && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    {(config.issuer || config.label) && (
                        <p className="border-b border-border/70 px-4 py-2 text-xs text-muted">
                            {t("account")}:{" "}
                            <bdi className="font-semibold">{config.label || config.issuer}</bdi>
                        </p>
                    )}
                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                        <div>
                            <p className="text-xs text-muted">{t("code")}</p>
                            <p
                                className="font-mono text-4xl font-bold tracking-wider"
                                dir="ltr"
                                data-tool-code
                            >
                                {grouped(codes.code)}
                            </p>
                        </div>
                        <CopyButton text={codes.code} locale={locale} compact />
                    </div>
                    <div className="px-4 pb-4">
                        <div
                            role="progressbar"
                            aria-label={t("remaining")}
                            aria-valuemin={0}
                            aria-valuemax={config.period}
                            aria-valuenow={codes.remaining}
                            className="h-1.5 overflow-hidden rounded-full bg-border"
                        >
                            <div
                                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                                style={{ width: `${(codes.remaining / config.period) * 100}%` }}
                            />
                        </div>
                        <p className="mt-2 flex justify-between text-xs text-muted">
                            <span>
                                {number(codes.remaining)} {t("remaining")}
                            </span>
                            <span>
                                {t("next")}: <Ltr className="font-mono">{grouped(codes.next)}</Ltr>
                            </span>
                        </p>
                    </div>
                    <p className="border-t border-border/70 px-4 py-2 text-xs text-muted">
                        {t("clock")}
                    </p>
                </section>
            )}
            <input
                type="hidden"
                value={config && codes ? codes.code : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
