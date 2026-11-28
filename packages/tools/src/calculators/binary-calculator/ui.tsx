import { useId, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { CopyButton, ErrorMessage, Ltr, Segmented, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { OPERATIONS, solve, type Operation } from "./logic";

type Base = "2" | "16" | "10" | "auto";

const FIELD =
    "min-h-11 w-full rounded-xl border border-border bg-surface-2/60 px-3 font-mono text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

export default function BinaryCalculator({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const [base, setBase] = useState<Base>("2");
    const [left, setLeft] = useState("");
    const [right, setRight] = useState("110");
    const [operation, setOperation] = useState<Operation>("+");
    const ids = { left: useId(), right: useId(), operation: useId() };
    let answer = null;
    let error = null;
    if (left.trim() && right.trim()) {
        try {
            answer = solve(left, right, operation, base === "auto" ? "auto" : Number(base));
        } catch (caught) {
            error = toToolError(caught);
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <Segmented<Base>
                legend={t("base")}
                value={base}
                onChange={setBase}
                options={[
                    { value: "2", label: t("binary") },
                    { value: "16", label: t("hex") },
                    { value: "10", label: t("decimal") },
                    { value: "auto", label: t("auto") },
                ]}
            />
            <div dir="ltr" className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <label
                    htmlFor={ids.left}
                    className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <bdi dir={locale === "fa" ? "rtl" : "ltr"}>{t("first")}</bdi>
                    <input
                        id={ids.left}
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="1010"
                        value={left}
                        onChange={(event) => setLeft(event.target.value)}
                        className={FIELD}
                        data-tool-input=""
                    />
                </label>
                <label
                    htmlFor={ids.operation}
                    className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <span className="sr-only">{t("operation")}</span>
                    <select
                        id={ids.operation}
                        value={operation}
                        onChange={(event) => setOperation(event.target.value as Operation)}
                        className={`${FIELD} w-24`}
                        data-binary-op=""
                    >
                        {OPERATIONS.map((op) => (
                            <option key={op} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </label>
                <label
                    htmlFor={ids.right}
                    className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    <bdi dir={locale === "fa" ? "rtl" : "ltr"}>{t("second")}</bdi>
                    <input
                        id={ids.right}
                        autoComplete="off"
                        spellCheck={false}
                        value={right}
                        onChange={(event) => setRight(event.target.value)}
                        className={FIELD}
                    />
                </label>
            </div>
            {error && <ErrorMessage error={error} locale={locale} />}
            {answer && (
                <dl
                    className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border bg-bg text-sm"
                    aria-live="polite"
                >
                    {(["binary", "hex", "decimal", "octal"] as const).map((key) => (
                        <div key={key} className="flex items-center gap-3 px-4 py-1.5">
                            <dt className="w-28 shrink-0 text-xs text-muted">{t(key)}</dt>
                            <dd className="min-w-0 flex-1" data-binary={key}>
                                <Ltr as="code" className="font-mono break-all">
                                    {answer[key]}
                                </Ltr>
                            </dd>
                            <CopyButton
                                text={answer[key].replace(/\s/g, "")}
                                locale={locale}
                                compact
                            />
                        </div>
                    ))}
                </dl>
            )}
            <p className="text-xs text-muted">{t("note")}</p>
            <input
                type="hidden"
                value={answer ? answer.decimal : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
