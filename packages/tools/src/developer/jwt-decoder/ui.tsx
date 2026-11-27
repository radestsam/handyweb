import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    CopyButton,
    ErrorMessage,
    Ltr,
    Pane,
    PaneAction,
    PasteButton,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { jwtDecoderMeta } from "./meta";
import { strings } from "./i18n";
import { decodeJwt, timeState, type DecodedJwt, type TimeClaims } from "./logic";

const MAX = jwtDecoderMeta.limits?.maxInputBytes ?? Infinity;
const CLAIMS: Array<keyof TimeClaims> = ["iat", "nbf", "exp"];

export default function JwtDecoder({ locale }: ToolUiProps) {
    const [text, setTextState] = useState("");
    // The clock is read when the token changes, not on each render.
    const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
    const setText = (value: string) => {
        setNow(Math.floor(Date.now() / 1000));
        setTextState(value);
    };
    const bannerId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];

    const result = useMemo((): ToolResult<DecodedJwt> | null => {
        if (text.trim() === "") return null;
        if (text.length > MAX) {
            return {
                ok: false,
                error: {
                    code: "too-large",
                    message: {
                        fa: "ورودی بیش از ۱ مگابایت است.",
                        en: "The input is larger than 1 MB.",
                    },
                },
            };
        }
        try {
            return { ok: true, value: decodeJwt(text) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
    }, [text]);

    const jwt = result?.ok ? result.value : null;
    const state = jwt ? timeState(jwt.claims, now) : null;
    // fa-IR shows the Jalali calendar and Persian digits.
    const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
        dateStyle: "full",
        timeStyle: "long",
    });

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={t("token")}
                locale={locale}
                code
                value={text}
                stats={false}
                onChange={(event) => setText(event.target.value)}
                placeholder="eyJhbGciOi…"
                className="min-h-32 break-all"
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

            <div
                role="note"
                aria-labelledby={bannerId}
                className="rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-sm"
                data-tool-banner
            >
                <p id={bannerId} className="font-semibold text-primary-text">
                    ⚠ {t("notVerifiedTitle")}
                </p>
                <p className="mt-1">{t("notVerified")}</p>
            </div>

            {result && !result.ok && <ErrorMessage error={result.error} locale={locale} />}

            {jwt && (
                <>
                    {(jwt.warnings.length > 0 || jwt.kind === "jwe") && (
                        <ul className="flex flex-col gap-1 rounded-2xl border border-error/40 bg-error-bg px-4 py-3 text-sm text-error">
                            {jwt.warnings.includes("alg-none") && <li>{t("algNone")}</li>}
                            {jwt.warnings.includes("no-signature") && <li>{t("noSignature")}</li>}
                            {jwt.kind === "jwe" && <li>{t("jwe")}</li>}
                        </ul>
                    )}

                    <div className="grid gap-3 lg:grid-cols-2">
                        <Pane
                            label={t("header")}
                            locale={locale}
                            code
                            readOnly
                            stats={false}
                            value={jwt.headerText}
                            className="min-h-32"
                            actions={<CopyButton text={jwt.headerText} locale={locale} compact />}
                        />
                        {jwt.kind === "jws" && (
                            <Pane
                                label={t("payload")}
                                locale={locale}
                                code={jwt.payloadIsJson}
                                readOnly
                                stats={false}
                                value={jwt.payloadText}
                                className="min-h-32"
                                meta={
                                    <span>
                                        {t("signature")}:{" "}
                                        {new Intl.NumberFormat(
                                            locale === "fa" ? "fa-IR" : "en",
                                        ).format(jwt.signatureBytes)}{" "}
                                        {t("bytes")}
                                    </span>
                                }
                                actions={
                                    <CopyButton text={jwt.payloadText} locale={locale} compact />
                                }
                                data-tool-output=""
                            />
                        )}
                    </div>

                    {Object.keys(jwt.claims).length > 0 && (
                        <section className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm">
                            <h2 className="text-xs font-semibold text-muted">{t("times")}</h2>
                            <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
                                {CLAIMS.filter((claim) => jwt.claims[claim] !== undefined).map(
                                    (claim) => {
                                        const value = jwt.claims[claim] as number;
                                        const when = new Date(value * 1000);
                                        return (
                                            <div key={claim} className="contents">
                                                <dt className="font-semibold">{t(claim)}</dt>
                                                <dd data-claim={claim}>
                                                    {Number.isNaN(when.getTime())
                                                        ? "—"
                                                        : date.format(when)}{" "}
                                                    <Ltr className="text-xs text-muted">
                                                        ({value})
                                                    </Ltr>
                                                </dd>
                                            </div>
                                        );
                                    },
                                )}
                            </dl>
                            {state && (
                                <p
                                    className={
                                        state === "in-window"
                                            ? "mt-3 text-muted"
                                            : "mt-3 font-semibold text-error"
                                    }
                                    data-tool-time={state}
                                >
                                    {state === "expired"
                                        ? t("expired")
                                        : state === "not-yet"
                                          ? t("notYet")
                                          : t("inWindow")}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-muted">{t("clockNote")}</p>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
