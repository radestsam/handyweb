import { ToolFailure } from "@handyweb/core/runtime";

export const MAX_COUNT = 10_000;
/** The largest result, in characters, so the page does not run out of memory. */
export const MAX_OUTPUT = 5_000_000;

export function repeatText(text: string, count: number, separator: string): string {
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
        throw new ToolFailure(
            "invalid-input",
            {
                fa: `شمار تکرار باید میان ۱ و ۱۰٬۰۰۰ باشد.`,
                en: `The count must be from 1 to 10,000.`,
            },
            "count",
        );
    }
    if ((text.length + separator.length) * count > MAX_OUTPUT) {
        throw new ToolFailure(
            "too-large",
            {
                fa: "خروجی بیش از ۵ میلیون نویسه می‌شود. شمار تکرار را کم کنید.",
                en: "The result would be longer than 5 million characters. Use a smaller count.",
            },
            "output",
        );
    }
    return Array.from({ length: count }, () => text).join(separator);
}
