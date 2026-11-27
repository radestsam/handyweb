import type { LocalizedText } from "@handyweb/core";

/** Short explanations of common headers, by lower-case name. */
export const HEADER_DOCS: Readonly<Record<string, LocalizedText>> = {
    accept: { fa: "گونه‌های محتوایی که کاربر می‌پذیرد.", en: "Content types the client accepts." },
    "accept-encoding": {
        fa: "فشرده‌سازی‌هایی که کاربر می‌شناسد، مانند gzip.",
        en: "Compression the client supports, such as gzip.",
    },
    "accept-language": { fa: "زبان‌هایی که کاربر می‌خواهد.", en: "Languages the client prefers." },
    "access-control-allow-origin": {
        fa: "کدام سایت‌ها می‌توانند این پاسخ را بخوانند (CORS).",
        en: "Which sites may read this response (CORS).",
    },
    age: {
        fa: "چند ثانیه این پاسخ در کش بوده است.",
        en: "How many seconds the response has been in a cache.",
    },
    authorization: {
        fa: "اطلاعات ورود. آن را با کسی هم‌رسانی نکنید.",
        en: "Login credentials. Do not share them.",
    },
    "cache-control": { fa: "قاعده‌های کش کردن پاسخ.", en: "Caching rules for the response." },
    connection: {
        fa: "اتصال پس از پاسخ باز بماند یا بسته شود.",
        en: "Whether the connection stays open after the response.",
    },
    "content-encoding": { fa: "فشرده‌سازی بدنه پاسخ.", en: "The compression of the body." },
    "content-length": { fa: "اندازه بدنه به بایت.", en: "The size of the body in bytes." },
    "content-security-policy": {
        fa: "منبع‌هایی که صفحه می‌تواند بارگیری کند (CSP). سد اصلی در برابر XSS.",
        en: "Which sources the page may load (CSP). The main defense against XSS.",
    },
    "content-type": {
        fa: "گونه و رمزگذاری محتوا.",
        en: "The media type and character set of the content.",
    },
    cookie: {
        fa: "کوکی‌هایی که مرورگر می‌فرستد. شاید شناسه نشست داشته باشد.",
        en: "Cookies the browser sends. They can hold a session ID.",
    },
    date: { fa: "زمان ساخت پاسخ.", en: "When the response was made." },
    etag: { fa: "شناسه نسخه محتوا، برای کش.", en: "A version ID of the content, for caching." },
    expires: { fa: "زمان کهنه شدن پاسخ در کش.", en: "When the cached response becomes stale." },
    host: { fa: "نام دامنه‌ای که درخواست برای آن است.", en: "The domain the request is for." },
    "last-modified": { fa: "زمان واپسین دگرگونی محتوا.", en: "When the content last changed." },
    location: { fa: "نشانی که کاربر به آن فرستاده می‌شود.", en: "The URL to redirect to." },
    origin: { fa: "سایتی که درخواست را فرستاده است.", en: "The site that sent the request." },
    "permissions-policy": {
        fa: "کدام توانایی‌های مرورگر، مانند دوربین، در دسترس صفحه‌اند.",
        en: "Which browser features, such as the camera, the page may use.",
    },
    referer: { fa: "صفحه‌ای که کاربر از آن آمده است.", en: "The page the user came from." },
    "referrer-policy": {
        fa: "چه بخشی از نشانی صفحه به سایت‌های دیگر فرستاده شود.",
        en: "How much of the page URL is sent to other sites.",
    },
    server: {
        fa: "نرم‌افزار سرور. بهتر است نسخه آن را پنهان کنید.",
        en: "The server software. It is better to hide its version.",
    },
    "set-cookie": {
        fa: "کوکی‌ای که سرور در مرورگر می‌گذارد.",
        en: "A cookie the server stores in the browser.",
    },
    "strict-transport-security": {
        fa: "مرورگر را وا می‌دارد همیشه با HTTPS بیاید (HSTS).",
        en: "Makes the browser always use HTTPS (HSTS).",
    },
    "user-agent": {
        fa: "نام و نسخه مرورگر و سیستم‌عامل.",
        en: "The browser and operating system.",
    },
    vary: {
        fa: "کدام سربرگ‌های درخواست پاسخ را دگرگون می‌کنند، برای کش.",
        en: "Which request headers change the response, for caching.",
    },
    "x-content-type-options": {
        fa: "nosniff جلوی حدس زدن گونه فایل را می‌گیرد.",
        en: "nosniff stops the browser from guessing the file type.",
    },
    "x-frame-options": {
        fa: "آیا سایت‌های دیگر می‌توانند صفحه را در iframe بگذارند.",
        en: "Whether other sites may put the page in an iframe.",
    },
    "x-forwarded-for": {
        fa: "نشانی IP کاربر، پشت یک پراکسی.",
        en: "The client IP address, behind a proxy.",
    },
    "x-powered-by": {
        fa: "فناوری سرور. بهتر است آن را بردارید.",
        en: "The server technology. It is better to remove it.",
    },
};
