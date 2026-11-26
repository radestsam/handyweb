import type { Locale } from "../i18n/locales";

/** The props that the tool page passes to the UI module of every tool. */
export interface ToolUiProps {
    locale: Locale;
    /** Initial options from `?preset=<id>`, when the URL names a preset. */
    presetOptions?: Readonly<Record<string, unknown>> | undefined;
}
