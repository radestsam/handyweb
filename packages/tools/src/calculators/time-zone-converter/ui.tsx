import { useId, useMemo, useState } from "react";
import { toToolError } from "@handyweb/core/runtime";
import { Button, ErrorMessage, Ltr, type ToolUiProps } from "@handyweb/core/ui";
import { strings } from "./i18n";
import { DEFAULT_ZONES, formatOffset, offsetMinutes, parseWallTime, zonedToUtc } from "./logic";

const FIELD =
    "min-h-11 w-full min-w-0 rounded-xl border border-border bg-surface-2/60 px-3 text-base text-text outline-none focus-visible:border-focus focus-visible:shadow-[0_0_0_4px_var(--hw-glow)]";

function allZones(): string[] {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    return intl.supportedValuesOf
        ? ["UTC", ...intl.supportedValuesOf("timeZone").filter((zone) => zone !== "UTC")]
        : DEFAULT_ZONES;
}

function localInput(now: number, zone: string): string {
    // The current wall time in the zone, as a datetime-local value.
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat("en-US", {
            timeZone: zone,
            hourCycle: "h23",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
            .formatToParts(new Date(now))
            .map((part) => [part.type, part.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}T${String(Number(parts.hour) % 24).padStart(2, "0")}:${parts.minute}`;
}

export default function TimeZoneConverter({ locale }: ToolUiProps) {
    const t = (key: keyof typeof strings) => strings[key][locale];
    const zones = useMemo(() => allZones(), []);
    const [from, setFrom] = useState(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tehran",
    );
    const [time, setTime] = useState("");
    const [targets, setTargets] = useState<string[]>(DEFAULT_ZONES);
    const [adding, setAdding] = useState("");
    const ids = { from: useId(), time: useId(), add: useId() };

    let instant = null;
    let error = null;
    if (time) {
        try {
            instant = zonedToUtc(parseWallTime(time), from);
        } catch (caught) {
            error = toToolError(caught);
        }
    }
    const formatter = (zone: string) =>
        new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
            timeZone: zone,
            dateStyle: "full",
            timeStyle: "short",
        });
    const dayOf = (utc: number, zone: string) => {
        const date = new Date(utc + offsetMinutes(utc, zone) * 60000);
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
                <label
                    htmlFor={ids.from}
                    className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("from")}
                    <select
                        id={ids.from}
                        dir="ltr"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        className={FIELD}
                        data-tz-from=""
                    >
                        {zones.map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </select>
                </label>
                <label
                    htmlFor={ids.time}
                    className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-muted"
                >
                    {t("time")}
                    <span className="flex gap-2">
                        <input
                            id={ids.time}
                            type="datetime-local"
                            dir="ltr"
                            value={time}
                            onChange={(event) => setTime(event.target.value)}
                            className={FIELD}
                            data-tool-input=""
                        />
                        <Button onClick={() => setTime(localInput(Date.now(), from))}>
                            {t("now")}
                        </Button>
                    </span>
                </label>
            </div>
            {error && <ErrorMessage error={error} locale={locale} />}
            {instant?.skipped && <p className="text-sm text-error">{t("skipped")}</p>}
            {instant && (
                <ul
                    className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border bg-bg text-sm"
                    aria-live="polite"
                    data-tz-results=""
                >
                    {targets.map((zone) => {
                        const shift = Math.round(
                            (dayOf(instant.utc, zone) - dayOf(instant.utc, from)) / 86_400_000,
                        );
                        return (
                            <li
                                key={zone}
                                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2"
                                data-tz={zone}
                            >
                                <Ltr className="w-40 shrink-0 font-semibold">{zone}</Ltr>
                                <span className="min-w-0 flex-1" data-tz-time="">
                                    {formatter(zone).format(new Date(instant.utc))}
                                    {shift !== 0 && (
                                        <span className="ms-2 text-xs text-muted tabular-nums">
                                            ({shift > 0 ? `+${shift}` : shift})
                                        </span>
                                    )}
                                </span>
                                <Ltr className="text-xs text-muted tabular-nums">
                                    {formatOffset(offsetMinutes(instant.utc, zone))}
                                </Ltr>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTargets((list) => list.filter((item) => item !== zone))
                                    }
                                    className="min-h-9 rounded-full px-2 text-xs text-muted hover:bg-surface-2"
                                    aria-label={`${t("remove")} ${zone}`}
                                >
                                    ✕
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
            <label
                htmlFor={ids.add}
                className="flex flex-col gap-1.5 text-xs font-semibold text-muted"
            >
                {t("add")}
                <select
                    id={ids.add}
                    dir="ltr"
                    value={adding}
                    onChange={(event) => {
                        const zone = event.target.value;
                        if (zone && !targets.includes(zone)) setTargets((list) => [...list, zone]);
                        setAdding("");
                    }}
                    className={FIELD}
                >
                    <option value="">—</option>
                    {zones
                        .filter((zone) => !targets.includes(zone))
                        .map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                </select>
            </label>
            <p className="text-xs text-muted">{t("data")}</p>
            <input
                type="hidden"
                value={instant ? new Date(instant.utc).toISOString() : ""}
                readOnly
                data-tool-output=""
            />
        </div>
    );
}
