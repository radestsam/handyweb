import type { LocalizedText } from "@handyweb/core";

export const strings = {
    token: { fa: "توکن JWT", en: "JWT" },
    notVerifiedTitle: { fa: "امضا بررسی نشده است", en: "The signature is not verified" },
    notVerified: {
        fa: "این ابزار تنها توکن را رمزگشایی می‌کند. هر کسی می‌تواند توکنی با همین محتوا بسازد، پس به محتوای آن اعتماد نکنید، مگر آن‌که سرور شما امضای آن را با کلید درست بررسی کند.",
        en: "This tool only decodes the token. Anyone can make a token with this content, so do not trust it until your server checks the signature with the correct key.",
    },
    header: { fa: "سربرگ (header)", en: "Header" },
    payload: { fa: "بدنه (payload)", en: "Payload" },
    times: { fa: "زمان‌ها", en: "Times" },
    exp: { fa: "پایان اعتبار (exp)", en: "Expires (exp)" },
    nbf: { fa: "آغاز اعتبار (nbf)", en: "Not before (nbf)" },
    iat: { fa: "زمان ساخت (iat)", en: "Issued at (iat)" },
    expired: {
        fa: "زمان exp گذشته است: توکن منقضی شده است.",
        en: "The exp time has passed: the token has expired.",
    },
    notYet: {
        fa: "زمان nbf هنوز نرسیده است: توکن هنوز نباید پذیرفته شود.",
        en: "The nbf time has not come yet: the token must not be accepted yet.",
    },
    inWindow: {
        fa: "اکنون در بازه زمانی توکن است. این تنها درباره زمان است، نه درستی امضا.",
        en: "The current time is inside the time window of the token. This is about time only, not about the signature.",
    },
    clockNote: {
        fa: "زمان‌ها با ساعت همین دستگاه سنجیده می‌شوند.",
        en: "Times are compared with the clock of this device.",
    },
    algNone: {
        fa: "الگوریتم none است: این توکن امضا ندارد. سرور هرگز نباید آن را بپذیرد.",
        en: "The algorithm is none: this token has no signature. A server must never accept it.",
    },
    noSignature: {
        fa: "بخش امضا خالی است.",
        en: "The signature part is empty.",
    },
    jwe: {
        fa: "این یک JWE (توکن رمزنگاری‌شده) است. بدنه بدون کلید خوانده نمی‌شود، پس تنها سربرگ نشان داده می‌شود.",
        en: "This is a JWE (an encrypted token). The payload cannot be read without the key, so only the header is shown.",
    },
    signature: { fa: "امضا", en: "Signature" },
    bytes: { fa: "بایت", en: "bytes" },
} as const satisfies Record<string, LocalizedText>;
