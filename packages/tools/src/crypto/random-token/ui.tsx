import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    CopyButton,
    ErrorMessage,
    Pane,
    Segmented,
    type ToolUiProps,
    useClient,
} from "@handyweb/core/ui";
import { alphabetLabels, strings } from "./i18n";
import {
    ALPHABET_NAMES,
    MAX_BYTES,
    MAX_COUNT,
    MAX_LENGTH,
    encodeBytes,
    generateMany,
    generateToken,
    randomBytes,
    tokenBits,
    type AlphabetName,
    type ByteEncoding,
} from "./logic";

type Kind = "token" | "bytes";

const NUMBER_FIELD =
    "min-h-11 w-24 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function RandomToken({ locale, presetOptions }: ToolUiProps) {
    const [kind, setKind] = useState<Kind>(presetOptions?.["kind"] === "bytes" ? "bytes" : "token");
    const [alphabet, setAlphabet] = useState<AlphabetName>("base64url");
    const [length, setLength] = useState("32");
    const [byteCount, setByteCount] = useState("32");
    const [encoding, setEncoding] = useState<ByteEncoding>("hex");
    const [count, setCount] = useState("1");
    // Changing this number draws new values with the same options.
    const [round, setRound] = useState(0);
    const sizeId = useId();
    const countId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const format = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", {
        maximumFractionDigits: 0,
    });

    // No token is drawn while the page is built on the server, so the static
    // HTML never holds one.
    const client = useClient();
    const result = useMemo((): ToolResult<string> => {
        if (!client) return { ok: true, value: "" };
        try {
            const make =
                kind === "token"
                    ? () => generateToken(alphabet, Number(length))
                    : () => encodeBytes(randomBytes(Number(byteCount)), encoding);
            return { ok: true, value: generateMany(Number(count), make) };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
        // `round` is a dependency on purpose: it asks for new random values.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, kind, alphabet, length, byteCount, encoding, count, round]);

    const bits =
        kind === "token" ? tokenBits(alphabet, Number(length) || 0) : (Number(byteCount) || 0) * 8;
    const output = result.ok ? result.value : "";

    return (
        <div className="flex flex-col gap-6">
            <Segmented<Kind>
                legend={t("kind")}
                value={kind}
                onChange={setKind}
                options={[
                    { value: "token", label: t("token") },
                    { value: "bytes", label: t("bytes") },
                ]}
            />

            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                {kind === "token" ? (
                    <Segmented<AlphabetName>
                        legend={t("alphabet")}
                        value={alphabet}
                        onChange={setAlphabet}
                        options={ALPHABET_NAMES.map((value) => ({
                            value,
                            label: alphabetLabels[value][locale],
                        }))}
                    />
                ) : (
                    <Segmented<ByteEncoding>
                        legend={t("encoding")}
                        value={encoding}
                        onChange={setEncoding}
                        options={[
                            { value: "hex", label: t("hex") },
                            { value: "base64", label: t("base64") },
                            { value: "base64url", label: t("base64url") },
                        ]}
                    />
                )}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={sizeId} className="text-xs font-semibold text-muted">
                        {kind === "token" ? t("length") : t("byteCount")}
                    </label>
                    <input
                        id={sizeId}
                        type="number"
                        dir="ltr"
                        inputMode="numeric"
                        min={1}
                        max={kind === "token" ? MAX_LENGTH : MAX_BYTES}
                        value={kind === "token" ? length : byteCount}
                        onChange={(event) =>
                            kind === "token"
                                ? setLength(event.target.value)
                                : setByteCount(event.target.value)
                        }
                        className={NUMBER_FIELD}
                        data-tool-input=""
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={countId} className="text-xs font-semibold text-muted">
                        {t("count")}
                    </label>
                    <input
                        id={countId}
                        type="number"
                        dir="ltr"
                        inputMode="numeric"
                        min={1}
                        max={MAX_COUNT}
                        value={count}
                        onChange={(event) => setCount(event.target.value)}
                        className={NUMBER_FIELD}
                    />
                </div>
            </div>

            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}

            <Pane
                label={t("output")}
                locale={locale}
                code
                readOnly
                stats={false}
                value={output}
                className="min-h-28"
                meta={
                    <span data-tool-bits>
                        {format.format(bits)} {t("bits")}
                    </span>
                }
                actions={<CopyButton text={output} locale={locale} compact />}
                data-tool-output=""
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted">{t("note")}</p>
                <Button variant="primary" onClick={() => setRound(round + 1)}>
                    {t("regenerate")}
                </Button>
            </div>
        </div>
    );
}
