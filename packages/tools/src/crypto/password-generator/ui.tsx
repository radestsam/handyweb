import { useId, useMemo, useState } from "react";
import { toToolError, type ToolResult } from "@handyweb/core/runtime";
import {
    Button,
    Checkbox,
    CopyButton,
    cx,
    ErrorMessage,
    Segmented,
    type ToolUiProps,
    useClient,
} from "@handyweb/core/ui";
import { setLabels, strengthLabels, strings } from "./i18n";
import {
    DEFAULT_PASSPHRASE,
    DEFAULT_PASSWORD,
    MAX_LENGTH,
    MAX_WORDS,
    MIN_LENGTH,
    MIN_WORDS,
    SET_NAMES,
    generatePassphrase,
    generatePassword,
    passphraseBits,
    passwordBits,
    strength,
    type PassphraseOptions,
    type PasswordOptions,
} from "./logic";
import { EFF_WORDS } from "./words";

type Kind = "password" | "passphrase";

const SEPARATORS = ["-", " ", ".", "_"] as const;
const NUMBER_FIELD =
    "min-h-11 w-24 rounded-xl border border-border bg-surface-2/60 px-3 text-base tabular-nums text-text outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";
const STRENGTH_COLORS = {
    weak: "bg-error",
    fair: "bg-primary",
    strong: "bg-success",
    "very-strong": "bg-success",
} as const;

export default function PasswordGenerator({ locale, presetOptions }: ToolUiProps) {
    const [kind, setKind] = useState<Kind>(
        presetOptions?.["kind"] === "passphrase" ? "passphrase" : "password",
    );
    const [password, setPassword] = useState<PasswordOptions>(DEFAULT_PASSWORD);
    const [passphrase, setPassphrase] = useState<PassphraseOptions>(DEFAULT_PASSPHRASE);
    const [lengthText, setLengthText] = useState(String(DEFAULT_PASSWORD.length));
    const [wordsText, setWordsText] = useState(String(DEFAULT_PASSPHRASE.words));
    // Changing this number draws a new value with the same options.
    const [round, setRound] = useState(0);
    const lengthId = useId();
    const t = (key: keyof typeof strings) => strings[key][locale];
    const number = (n: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(n);

    // No password is drawn while the page is built on the server, so the
    // static HTML never holds one.
    const client = useClient();
    const result = useMemo((): ToolResult<string> => {
        if (!client) return { ok: true, value: "" };
        try {
            return {
                ok: true,
                value:
                    kind === "password"
                        ? generatePassword(password)
                        : generatePassphrase(passphrase, EFF_WORDS),
            };
        } catch (error) {
            return { ok: false, error: toToolError(error) };
        }
        // `round` is a dependency on purpose: it asks for a new random value.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, kind, password, passphrase, round]);

    const bits =
        kind === "password" ? passwordBits(password) : passphraseBits(passphrase, EFF_WORDS.length);
    const level = strength(bits);
    const output = result.ok ? result.value : "";

    const changeLength = (text: string) => {
        setLengthText(text);
        const value = Number(text);
        if (Number.isInteger(value)) setPassword({ ...password, length: value });
    };
    const changeWords = (text: string) => {
        setWordsText(text);
        const value = Number(text);
        if (Number.isInteger(value)) setPassphrase({ ...passphrase, words: value });
    };

    return (
        <div className="flex flex-col gap-6">
            <Segmented<Kind>
                legend={t("kind")}
                value={kind}
                onChange={setKind}
                options={[
                    { value: "password", label: t("password") },
                    { value: "passphrase", label: t("passphrase") },
                ]}
            />

            {kind === "password" ? (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={lengthId} className="text-xs font-semibold text-muted">
                            {t("length")}
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                id={lengthId}
                                type="number"
                                dir="ltr"
                                inputMode="numeric"
                                min={MIN_LENGTH}
                                max={MAX_LENGTH}
                                value={lengthText}
                                onChange={(event) => changeLength(event.target.value)}
                                className={NUMBER_FIELD}
                                data-tool-input=""
                            />
                            <input
                                type="range"
                                min={MIN_LENGTH}
                                max={64}
                                value={Math.min(64, password.length)}
                                onChange={(event) => changeLength(event.target.value)}
                                aria-label={t("length")}
                                className="min-w-0 flex-1 accent-primary"
                            />
                        </div>
                    </div>
                    <fieldset className="flex flex-col gap-2">
                        <legend className="mb-1.5 text-xs font-semibold text-muted">
                            {t("sets")}
                        </legend>
                        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                            {SET_NAMES.map((name) => (
                                <Checkbox
                                    key={name}
                                    label={setLabels[name][locale]}
                                    checked={password.sets[name]}
                                    onChange={(checked) =>
                                        setPassword({
                                            ...password,
                                            sets: { ...password.sets, [name]: checked },
                                        })
                                    }
                                />
                            ))}
                            <Checkbox
                                label={t("excludeSimilar")}
                                checked={password.excludeSimilar}
                                onChange={(excludeSimilar) =>
                                    setPassword({ ...password, excludeSimilar })
                                }
                            />
                        </div>
                    </fieldset>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor={lengthId} className="text-xs font-semibold text-muted">
                                {t("words")}
                            </label>
                            <input
                                id={lengthId}
                                type="number"
                                dir="ltr"
                                inputMode="numeric"
                                min={MIN_WORDS}
                                max={MAX_WORDS}
                                value={wordsText}
                                onChange={(event) => changeWords(event.target.value)}
                                className={NUMBER_FIELD}
                                data-tool-input=""
                            />
                        </div>
                        <Segmented<(typeof SEPARATORS)[number]>
                            legend={t("separator")}
                            value={passphrase.separator as (typeof SEPARATORS)[number]}
                            onChange={(separator) => setPassphrase({ ...passphrase, separator })}
                            options={SEPARATORS.map((value) => ({
                                value,
                                label: value === " " ? t("space") : value,
                            }))}
                        />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Checkbox
                            label={t("capitalize")}
                            checked={passphrase.capitalize}
                            onChange={(capitalize) => setPassphrase({ ...passphrase, capitalize })}
                        />
                        <Checkbox
                            label={t("addDigit")}
                            checked={passphrase.addDigit}
                            onChange={(addDigit) => setPassphrase({ ...passphrase, addDigit })}
                        />
                    </div>
                    <p className="text-xs text-muted">{t("passphraseNote")}</p>
                </div>
            )}

            {!result.ok && <ErrorMessage error={result.error} locale={locale} />}

            <section
                className="overflow-hidden rounded-2xl border border-border bg-bg"
                aria-label={t("result")}
            >
                <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border/70 ps-4 pe-1.5">
                    <span className="text-xs font-semibold text-muted">{t("result")}</span>
                    <CopyButton text={output} locale={locale} compact />
                </div>
                <p
                    dir="ltr"
                    className="min-h-20 px-4 py-5 font-mono text-lg break-all text-text select-all sm:text-xl"
                    data-tool-result
                >
                    {output}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 px-4 py-3">
                    <div className="flex min-w-40 flex-1 flex-col gap-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted">{t("strength")}</span>
                            <span className="font-semibold" data-tool-strength={level}>
                                {strengthLabels[level][locale]} · {number(Math.floor(bits))}{" "}
                                {t("bits")}
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                            <div
                                className={cx("h-full rounded-full", STRENGTH_COLORS[level])}
                                style={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
                            />
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => setRound(round + 1)}>
                        {t("regenerate")}
                    </Button>
                </div>
                <input type="hidden" value={output} readOnly data-tool-output="" />
            </section>
            <p className="text-xs text-muted">{t("randomNote")}</p>
        </div>
    );
}
