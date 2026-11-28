import type { LocalizedText } from "@handyweb/core";
import type { SecurityCheck } from "./logic";

export const strings = {
    headers: { fa: "سربرگ‌ها", en: "Headers" },
    request: { fa: "درخواست", en: "Request" },
    response: { fa: "پاسخ", en: "Response" },
    unknown: { fa: "ناشناخته", en: "Unknown" },
    name: { fa: "نام", en: "Name" },
    value: { fa: "مقدار", en: "Value" },
    meaning: { fa: "کار", en: "Purpose" },
    security: { fa: "سربرگ‌های امنیتی پاسخ", en: "Response security headers" },
    cookies: { fa: "کوکی‌ها", en: "Cookies" },
    yes: { fa: "دارد", en: "Yes" },
    no: { fa: "ندارد", en: "No" },
    secure: { fa: "Secure", en: "Secure" },
    httpOnly: { fa: "HttpOnly", en: "HttpOnly" },
    sameSite: { fa: "SameSite", en: "SameSite" },
    sensitive: {
        fa: "سربرگ‌های Cookie و Authorization گذرواژه یا نشست شما را دارند. آن‌ها را با کسی هم‌رسانی نکنید.",
        en: "Cookie and Authorization headers hold your login or session. Do not share them.",
    },
} as const satisfies Record<string, LocalizedText>;

export const checkLabels: Record<SecurityCheck, LocalizedText> = {
    hsts: {
        fa: "Strict-Transport-Security با max-age دست‌کم ۱۸۰ روز",
        en: "Strict-Transport-Security with max-age of at least 180 days",
    },
    csp: { fa: "Content-Security-Policy", en: "Content-Security-Policy" },
    nosniff: { fa: "X-Content-Type-Options: nosniff", en: "X-Content-Type-Options: nosniff" },
    framing: {
        fa: "جلوگیری از iframe (frame-ancestors یا X-Frame-Options)",
        en: "Framing protection (frame-ancestors or X-Frame-Options)",
    },
    referrer: { fa: "Referrer-Policy", en: "Referrer-Policy" },
    permissions: { fa: "Permissions-Policy", en: "Permissions-Policy" },
};
