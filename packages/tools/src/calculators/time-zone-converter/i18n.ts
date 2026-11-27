import type { LocalizedText } from "@handyweb/core";

export const strings = {
    from: { fa: "منطقه زمانی مبدأ", en: "From time zone" },
    time: { fa: "تاریخ و ساعت", en: "Date and time" },
    now: { fa: "اکنون", en: "Now" },
    add: { fa: "افزودن منطقه زمانی", en: "Add a time zone" },
    remove: { fa: "برداشتن", en: "Remove" },
    skipped: {
        fa: "این ساعت به دلیل تغییر ساعت تابستانی در این منطقه وجود ندارد؛ ساعت معتبر بعدی به کار رفت.",
        en: "This time does not exist in this zone because of a daylight saving change; the next valid time is used.",
    },
    data: {
        fa: "اختلاف ساعت‌ها و ساعت تابستانی از داده منطقه زمانی مرورگر شما خوانده می‌شود. مرورگر را به‌روز نگه دارید؛ برای نمونه ایران از سال ۱۴۰۱ ساعت تابستانی ندارد.",
        en: "Offsets and daylight saving come from your browser's time zone data. Keep the browser up to date; for example, Iran has had no daylight saving since 2022.",
    },
} as const satisfies Record<string, LocalizedText>;
