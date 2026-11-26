import type { Locale } from "../i18n/locales";
import type { Progress as ProgressValue } from "../runtime/context";
import { UI_STRINGS } from "./strings";

export function Progress({ value, locale }: { value: ProgressValue | null; locale: Locale }) {
    const percent =
        value && value.total > 0 ? Math.round((value.completed / value.total) * 100) : undefined;
    return (
        <div className="flex flex-col gap-1" role="status">
            <progress
                className="h-2 w-full accent-primary"
                max={100}
                value={percent}
                aria-label={UI_STRINGS.working[locale]}
            />
            <span className="text-xs text-muted">
                {UI_STRINGS.working[locale]}
                {percent !== undefined &&
                    ` ${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en").format(percent)}%`}
            </span>
        </div>
    );
}
