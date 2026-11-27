import type { LocalizedText } from "@handyweb/core";
import type { RiskFlag } from "./logic";

export const strings = {
    url: { fa: "نشانی (URL)", en: "URL" },
    addedScheme: {
        fa: "نشانی پیشوند نداشت، پس https:// به آن افزوده شد.",
        en: "The URL had no scheme, so https:// was added.",
    },
    parts: { fa: "بخش‌ها", en: "Parts" },
    protocol: { fa: "پروتکل", en: "Scheme" },
    username: { fa: "نام کاربری", en: "User name" },
    password: { fa: "گذرواژه", en: "Password" },
    host: { fa: "میزبان", en: "Host" },
    hostUnicode: { fa: "میزبان (با حروف خود)", en: "Host (own letters)" },
    port: { fa: "درگاه", en: "Port" },
    defaultPort: { fa: "پیش‌فرض", en: "default" },
    path: { fa: "مسیر", en: "Path" },
    query: { fa: "پارامترهای جستجو", en: "Query parameters" },
    name: { fa: "نام", en: "Name" },
    value: { fa: "مقدار", en: "Value" },
    hash: { fa: "بخش (#)", en: "Fragment (#)" },
    flags: { fa: "نشانه‌های هشدار", en: "Warning signs" },
    noFlags: { fa: "نشانه هشداری یافت نشد.", en: "No warning signs found." },
} as const satisfies Record<string, LocalizedText>;

export const flagLabels: Record<RiskFlag, LocalizedText> = {
    credentials: {
        fa: "نام کاربری یا گذرواژه در نشانی است. نشانی‌های فریب‌دهنده، مانند google.com@evil.com، از این راه میزبان واقعی را پنهان می‌کنند.",
        en: "The URL holds a user name or password. Deceptive links such as google.com@evil.com use this to hide the real host.",
    },
    "ip-host": {
        fa: "میزبان یک نشانی IP است، نه نام دامنه.",
        en: "The host is an IP address, not a domain name.",
    },
    punycode: {
        fa: "نام دامنه با حروف غیرلاتین (Punycode) است. شکل واقعی آن را در «میزبان (با حروف خود)» ببینید.",
        en: "The domain name uses non-Latin letters (Punycode). See its real form in “Host (own letters)”.",
    },
    "mixed-script": {
        fa: "یک بخش از نام دامنه حروف چند خط را درهم دارد. این شیوه برای ساختن دامنه‌های همانند (homograph) به کار می‌رود.",
        en: "One part of the domain mixes letters of several scripts. This is a common trick to make look-alike (homograph) domains.",
    },
    insecure: {
        fa: "نشانی رمزنگاری نمی‌شود (http). داده میان شما و سایت خواناست.",
        en: "The connection is not encrypted (http). Data between you and the site can be read.",
    },
    "unusual-port": { fa: "درگاه ناآشنا به کار رفته است.", en: "The URL uses an unusual port." },
    "dangerous-scheme": {
        fa: "پروتکل javascript:، data: یا file: کد یا فایل را مستقیم باز می‌کند. روی چنین پیوندی نزنید، مگر آنکه از آن مطمئن باشید.",
        en: "A javascript:, data:, or file: scheme runs code or opens a file directly. Do not open such a link unless you trust it.",
    },
    "redirect-param": {
        fa: "یک پارامتر به نشانی دیگری می‌فرستد (مانند next= یا redirect=). سایت‌های فریب‌دهنده از redirect باز بهره می‌برند.",
        en: "A parameter points to another URL (such as next= or redirect=). Phishing sites use open redirects.",
    },
    long: { fa: "نشانی بیش از ۲٬۰۰۰ نویسه است.", en: "The URL is longer than 2,000 characters." },
};
