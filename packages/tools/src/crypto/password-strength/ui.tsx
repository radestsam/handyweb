import { useEffect, useId, useRef, useState } from "react";
import { cx, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import {
    characterKinds,
    formatDuration,
    MAX_LENGTH,
    SCORE_LABELS,
    SUGGESTIONS,
    WARNINGS,
    type StrengthSummary,
} from "./logic";
import type { StrengthRequest, StrengthResponse } from "./zxcvbn.worker";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

/** Colors of the meter, from very weak to strong. */
const SCORE_COLORS = ["bg-error", "bg-error", "bg-primary", "bg-success", "bg-success"] as const;

export default function PasswordStrength({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const ids = { input: useId(), meter: useId() };
    const worker = useRef<Worker | null>(null);
    const lastId = useRef(0);
    const [ready, setReady] = useState(false);
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [summary, setSummary] = useState<StrengthSummary | null>(null);

    // One worker for the life of the tool. It is stopped when the tool closes.
    useEffect(() => {
        const instance = new Worker(new URL("./zxcvbn.worker.ts", import.meta.url), {
            type: "module",
        });
        instance.addEventListener("message", (event: MessageEvent<StrengthResponse>) => {
            if (event.data.id === 0) setReady(true);
            else if (event.data.id === lastId.current) setSummary(event.data.summary);
        });
        worker.current = instance;
        return () => {
            instance.terminate();
            worker.current = null;
        };
    }, []);

    useEffect(() => {
        // An empty field shows no result, so it needs no check.
        if (!ready || password === "") return;
        // Wait for a short pause in typing before the check.
        const timer = setTimeout(() => {
            const id = ++lastId.current;
            worker.current?.postMessage({ id, password } satisfies StrengthRequest);
        }, 120);
        return () => clearTimeout(timer);
    }, [password, ready]);

    const kinds = characterKinds(password);
    const shown = summary && password !== "" ? summary : null;
    const kindNames = (["lower", "upper", "digit", "symbol", "other"] as const)
        .filter((key) => kinds[key])
        .map((key) => t(key));
    const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en");

    return (
        <div className="flex flex-col gap-5">
            <label
                htmlFor={ids.input}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("password")}
                <span className="flex gap-2">
                    <input
                        id={ids.input}
                        type={visible ? "text" : "password"}
                        dir="ltr"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={t("placeholder")}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        // Password managers must not offer to save this field.
                        data-1p-ignore=""
                        data-lpignore="true"
                        aria-describedby={ids.meter}
                        className={FIELD}
                        data-tool-input=""
                    />
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        aria-pressed={visible}
                        className="min-h-11 shrink-0 rounded-xl border border-border px-4 text-sm font-semibold text-text hover:bg-surface-2"
                    >
                        {visible ? t("hide") : t("show")}
                    </button>
                </span>
            </label>

            {!ready && (
                <p className="text-sm text-muted" role="status">
                    {t("loading")}
                </p>
            )}

            <div id={ids.meter} className="flex flex-col gap-2" aria-live="polite">
                <div className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((step) => (
                        <span
                            key={step}
                            className={cx(
                                "h-2 flex-1 rounded-full",
                                shown && step <= shown.score
                                    ? SCORE_COLORS[shown.score]
                                    : "bg-surface-2",
                            )}
                        />
                    ))}
                </div>
                <p className="text-sm">
                    {t("strength")}:{" "}
                    <strong data-tool-score={shown?.score ?? ""}>
                        {shown ? SCORE_LABELS[shown.score][locale] : "–"}
                    </strong>
                    {password !== "" && (
                        <span className="text-muted">
                            {" "}
                            · {t("length")}: {number.format(kinds.length)} {t("characters")}
                            {kindNames.length > 0 &&
                                ` · ${kindNames.join(locale === "fa" ? "، " : ", ")}`}
                        </span>
                    )}
                </p>
            </div>
            {kinds.length > MAX_LENGTH && <p className="text-sm text-muted">{t("tooLong")}</p>}

            {shown && (
                <>
                    {shown.warning && WARNINGS[shown.warning] && (
                        <p
                            role="alert"
                            className="rounded-2xl border border-error/40 px-4 py-3 text-sm text-error"
                            data-tool-warning={shown.warning}
                        >
                            {WARNINGS[shown.warning]?.[locale]}
                        </p>
                    )}
                    {shown.suggestions.length > 0 && (
                        <section className="flex flex-col gap-1 text-sm">
                            <h2 className="font-semibold">{t("tips")}</h2>
                            <ul className="flex flex-col gap-1 ps-5" data-tool-suggestions="">
                                {shown.suggestions
                                    .filter((key) => SUGGESTIONS[key])
                                    .map((key) => (
                                        <li key={key} className="list-disc">
                                            {SUGGESTIONS[key]?.[locale]}
                                        </li>
                                    ))}
                            </ul>
                        </section>
                    )}
                    <section className="flex flex-col gap-2 text-sm">
                        <h2 className="font-semibold">{t("times")}</h2>
                        <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[1fr_auto]">
                            {(["online", "offlineSlow", "offlineFast"] as const).map((key) => (
                                <div key={key} className="contents">
                                    <dt className="text-muted">{t(key)}</dt>
                                    <dd className="font-semibold tabular-nums" data-tool-time={key}>
                                        {formatDuration(shown.seconds[key], locale)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </>
            )}
            <p className="text-xs text-muted">{t("privacy")}</p>
            <input
                type="hidden"
                value={shown ? String(shown.score) : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
