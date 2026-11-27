import { useEffect, useState } from "react";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
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
import { strings } from "./i18n";
import { decodePem, type Decoded } from "./logic";

export default function PemDecoder({ locale }: ToolUiProps) {
    const [text, setText] = useState("");
    const [decoded, setDecoded] = useState<Decoded | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    // The clock is read when the input changes, to say whether the certificate has expired.
    const [now, setNow] = useState(() => Date.now());
    const t = (key: keyof typeof strings) => strings[key][locale];

    useEffect(() => {
        let current = true;
        void (async () => {
            if (text.trim() === "") {
                if (current) {
                    setDecoded(null);
                    setError(null);
                }
                return;
            }
            try {
                const value = await decodePem(text);
                if (current) {
                    setDecoded(value);
                    setError(null);
                }
            } catch (caught) {
                if (current) {
                    setDecoded(null);
                    setError(toToolError(caught));
                }
            }
        })();
        return () => {
            current = false;
        };
    }, [text]);

    const date = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
        dateStyle: "long",
        timeStyle: "short",
    });
    const rows: Array<[keyof typeof strings, string, boolean]> = decoded
        ? [
              ["subject", decoded.subject, true],
              ...(decoded.issuer !== null
                  ? ([["issuer", decoded.issuer, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(decoded.serial
                  ? ([["serial", decoded.serial, true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(decoded.notBefore
                  ? ([["notBefore", date.format(decoded.notBefore), false]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(decoded.notAfter
                  ? ([["notAfter", date.format(decoded.notAfter), false]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              [
                  "publicKey",
                  `${decoded.publicKey.algorithm} ${decoded.publicKey.size}`.trim(),
                  true,
              ],
              ["signature", decoded.signatureAlgorithm, true],
              ...(decoded.subjectAltNames.length
                  ? ([["san", decoded.subjectAltNames.join(", "), true]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(decoded.isCa !== null
                  ? ([["ca", decoded.isCa ? t("yes") : t("no"), false]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ...(decoded.kind === "certificate"
                  ? ([["selfSigned", decoded.selfSigned ? t("yes") : t("no"), false]] as Array<
                        [keyof typeof strings, string, boolean]
                    >)
                  : []),
              ["fingerprint", decoded.sha256, true],
          ]
        : [];
    const expired = decoded?.notAfter && decoded.notAfter.getTime() < now;
    const notYet = decoded?.notBefore && decoded.notBefore.getTime() > now;

    return (
        <div className="flex flex-col gap-5">
            <Pane
                label={t("input")}
                locale={locale}
                code
                value={text}
                onChange={(event) => {
                    setNow(Date.now());
                    setText(event.target.value);
                }}
                placeholder="-----BEGIN CERTIFICATE-----"
                className="min-h-48 break-all"
                stats={false}
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
            {decoded && (
                <section className="overflow-hidden rounded-2xl border border-border bg-bg">
                    <h2
                        className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold"
                        data-tool-kind={decoded.kind}
                    >
                        {decoded.kind === "certificate" ? t("certificate") : t("csr")}
                    </h2>
                    {(expired || notYet) && (
                        <p className="border-b border-border/70 bg-error-bg px-4 py-2 text-sm text-error">
                            ⚠ {expired ? t("expired") : t("notYet")}
                        </p>
                    )}
                    <dl className="divide-y divide-border/50 text-sm">
                        {rows.map(([key, value, code]) => (
                            <div
                                key={key}
                                className="flex flex-col gap-0.5 px-4 py-2 sm:flex-row sm:gap-3"
                            >
                                <dt className="shrink-0 text-xs text-muted sm:w-44">{t(key)}</dt>
                                <dd
                                    className="flex min-w-0 flex-1 items-start gap-2"
                                    data-field={key}
                                >
                                    {code ? (
                                        <Ltr
                                            as="code"
                                            className="min-w-0 flex-1 font-mono text-xs break-all"
                                        >
                                            {value}
                                        </Ltr>
                                    ) : (
                                        <span className="flex-1">{value}</span>
                                    )}
                                    {key === "fingerprint" && (
                                        <CopyButton text={value} locale={locale} compact />
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="border-t border-border/70 px-4 py-2 text-xs text-muted">
                        {t("note")}
                    </p>
                </section>
            )}
            <input
                type="hidden"
                value={decoded ? decoded.subject : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
