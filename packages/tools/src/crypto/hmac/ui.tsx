import { useEffect, useId, useState } from "react";
import { toToolError, type ToolError } from "@handyweb/core/runtime";
import {
    CopyButton,
    cx,
    ErrorMessage,
    Icon,
    Pane,
    PaneAction,
    PasteButton,
    Segmented,
    UI_STRINGS,
    type ToolUiProps,
} from "@handyweb/core/ui";
import { hmacMeta } from "./meta";
import { macLabel, strings } from "./i18n";
import {
    ALGORITHMS,
    computeHmac,
    encodeMac,
    verifyHmac,
    type Algorithm,
    type KeyFormat,
    type OutputEncoding,
} from "./logic";

type Mode = "generate" | "verify";

const MAX = hmacMeta.limits?.maxInputBytes ?? Infinity;
const FIELD =
    "min-h-12 w-full rounded-xl border border-border bg-surface-2/60 px-4 font-mono text-sm text-text outline-none transition-[border-color,box-shadow] duration-200 placeholder:font-sans placeholder:text-muted/80 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function HmacTool({ locale, presetOptions }: ToolUiProps) {
    const [mode, setMode] = useState<Mode>(
        presetOptions?.["mode"] === "verify" ? "verify" : "generate",
    );
    const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");
    const [keyFormat, setKeyFormat] = useState<KeyFormat>("text");
    const [encoding, setEncoding] = useState<OutputEncoding>("hex");
    const [expected, setExpected] = useState("");
    const [mac, setMac] = useState<Uint8Array | null>(null);
    const [verdict, setVerdict] = useState<boolean | null>(null);
    const [error, setError] = useState<ToolError | null>(null);
    const keyId = useId();
    const expectedId = useId();
    const t = (name: keyof typeof strings) => strings[name][locale];

    useEffect(() => {
        let current = true;
        void (async () => {
            if (key === "") {
                if (current) {
                    setMac(null);
                    setVerdict(null);
                    setError(null);
                }
                return;
            }
            if (message.length > MAX) {
                if (current) {
                    setMac(null);
                    setError({
                        code: "too-large",
                        message: {
                            fa: "پیام بیش از ۲۰ مگابایت است.",
                            en: "The message is larger than 20 MB.",
                        },
                    });
                }
                return;
            }
            try {
                const input = { message, key, keyFormat, algorithm };
                const computed = await computeHmac(input);
                const checked = expected.trim() === "" ? null : await verifyHmac(input, expected);
                if (current) {
                    setMac(computed);
                    setVerdict(checked);
                    setError(null);
                }
            } catch (caught) {
                if (current) {
                    setMac(null);
                    setVerdict(null);
                    setError(toToolError(caught));
                }
            }
        })();
        return () => {
            current = false;
        };
    }, [message, key, keyFormat, algorithm, expected]);

    const output = mac ? encodeMac(mac, encoding) : "";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                <Segmented<Mode>
                    legend={t("mode")}
                    value={mode}
                    onChange={setMode}
                    options={[
                        { value: "generate", label: t("generate") },
                        { value: "verify", label: t("verify") },
                    ]}
                />
                <Segmented<Algorithm>
                    legend={t("algorithm")}
                    value={algorithm}
                    onChange={setAlgorithm}
                    options={ALGORITHMS.map((value) => ({ value, label: value }))}
                />
            </div>

            <Pane
                label={t("message")}
                locale={locale}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={UI_STRINGS.inputHere[locale]}
                className="min-h-36"
                actions={
                    <>
                        <PasteButton locale={locale} onPaste={setMessage} />
                        <PaneAction
                            icon="clear"
                            label={UI_STRINGS.clear[locale]}
                            onClick={() => setMessage("")}
                            disabled={message === ""}
                        />
                    </>
                }
            />

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                    <div className="flex min-w-0 flex-1 basis-64 flex-col gap-1.5">
                        <label htmlFor={keyId} className="text-xs font-semibold text-muted">
                            {t("key")}
                        </label>
                        <input
                            id={keyId}
                            dir="ltr"
                            value={key}
                            onChange={(event) => setKey(event.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                            className={FIELD}
                            data-tool-input=""
                        />
                    </div>
                    <Segmented<KeyFormat>
                        legend={t("keyFormat")}
                        value={keyFormat}
                        onChange={setKeyFormat}
                        options={[
                            { value: "text", label: t("text") },
                            { value: "hex", label: t("hex") },
                            { value: "base64", label: t("base64") },
                        ]}
                    />
                </div>
            </div>

            {error && <ErrorMessage error={error} locale={locale} />}

            {mode === "generate" ? (
                <section
                    className="overflow-hidden rounded-2xl border border-border bg-bg"
                    aria-label={macLabel(algorithm)[locale]}
                >
                    <div className="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                        <span className="text-xs font-semibold text-muted">
                            <bdi>{macLabel(algorithm)[locale]}</bdi>
                        </span>
                        <div className="flex items-center gap-2">
                            <Segmented<OutputEncoding>
                                legend={t("encoding")}
                                value={encoding}
                                onChange={setEncoding}
                                options={[
                                    { value: "hex", label: t("hex") },
                                    { value: "base64", label: t("base64") },
                                ]}
                            />
                            <CopyButton text={output} locale={locale} compact />
                        </div>
                    </div>
                    <div dir="ltr" className="min-h-20 px-4 py-4 select-all">
                        {output ? (
                            <p className="font-mono text-base break-all text-text sm:text-lg">
                                {output}
                            </p>
                        ) : (
                            <p dir="auto" className="text-muted">
                                {UI_STRINGS.outputHere[locale]}
                            </p>
                        )}
                    </div>
                </section>
            ) : (
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={expectedId} className="text-xs font-semibold text-muted">
                        {t("expected")}
                    </label>
                    <div
                        className={cx(
                            "flex items-center gap-3 rounded-xl border bg-surface-2/60 ps-4 pe-3",
                            verdict === true
                                ? "border-success"
                                : verdict === false
                                  ? "border-error"
                                  : "border-border",
                        )}
                    >
                        <input
                            id={expectedId}
                            dir="ltr"
                            value={expected}
                            onChange={(event) => setExpected(event.target.value)}
                            placeholder="sha256=…"
                            autoComplete="off"
                            spellCheck={false}
                            className="min-h-12 min-w-0 flex-1 bg-transparent font-mono text-sm text-text outline-none placeholder:text-muted/80"
                        />
                    </div>
                    {expected.trim() !== "" && key !== "" && !error && (
                        <p
                            role="status"
                            className={cx(
                                "inline-flex items-center gap-1.5 text-sm font-semibold",
                                verdict === true
                                    ? "text-success"
                                    : verdict === false
                                      ? "text-error"
                                      : "text-muted",
                            )}
                            data-tool-verdict={
                                verdict === null ? "unreadable" : verdict ? "yes" : "no"
                            }
                        >
                            {verdict !== null && <Icon name={verdict ? "check" : "clear"} />}
                            {verdict === null
                                ? t("unreadable")
                                : verdict
                                  ? t("match")
                                  : t("mismatch")}
                        </p>
                    )}
                </div>
            )}
            <input type="hidden" value={output} readOnly data-tool-output="" />
        </div>
    );
}
