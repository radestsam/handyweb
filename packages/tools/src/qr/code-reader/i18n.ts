import type { LocalizedText } from "@handyweb/core";
import type { Kind } from "./logic";

export const strings = {
    camera: { fa: "روشن کردن دوربین", en: "Turn on the camera" },
    stop: { fa: "خاموش کردن دوربین", en: "Turn off the camera" },
    again: { fa: "اسکن دوباره", en: "Scan again" },
    orImage: { fa: "یا عکسی از کد را برگزینید", en: "Or choose a picture of the code" },
    looking: { fa: "دوربین را رو به کد بگیرید…", en: "Point the camera at the code…" },
    none: { fa: "در این تصویر کدی پیدا نشد.", en: "No code was found in this picture." },
    denied: {
        fa: "دسترسی به دوربین داده نشد. می‌توانید به جای آن عکسی از کد را برگزینید.",
        en: "Camera access was not given. You can choose a picture of the code instead.",
    },
    qrOnly: {
        fa: "این مرورگر بارکدخوان ندارد، پس تنها کد QR خوانده می‌شود. برای بارکد Chrome یا Edge را به کار ببرید.",
        en: "This browser has no barcode reader, so only QR codes are read. For barcodes, use Chrome or Edge.",
    },
    result: { fa: "محتوا", en: "Content" },
    open: { fa: "باز کردن پیوند", en: "Open the link" },
    openWarning: {
        fa: "پیش از باز کردن، نشانی را بخوانید. کدهای QR گاهی به سایت‌های فریبنده می‌برند.",
        en: "Read the address before you open it. QR codes sometimes lead to fake sites.",
    },
    network: { fa: "نام شبکه", en: "Network name" },
    password: { fa: "رمز", en: "Password" },
    security: { fa: "امنیت", en: "Security" },
} as const satisfies Record<string, LocalizedText>;

export const KINDS: Record<Kind, LocalizedText> = {
    url: { fa: "پیوند", en: "Link" },
    wifi: { fa: "شبکه Wi-Fi", en: "Wi-Fi network" },
    email: { fa: "ایمیل", en: "Email" },
    phone: { fa: "شماره تلفن", en: "Phone number" },
    sms: { fa: "پیامک", en: "Text message" },
    geo: { fa: "مکان", en: "Location" },
    contact: { fa: "کارت تماس", en: "Contact card" },
    text: { fa: "متن", en: "Text" },
};
