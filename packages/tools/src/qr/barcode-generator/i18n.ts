import type { LocalizedText } from "@handyweb/core";

export const strings = {
    format: { fa: "نوع بارکد", en: "Barcode type" },
    content: { fa: "محتوا", en: "Content" },
    hintCode128: {
        fa: "حروف، رقم و نشانه‌های انگلیسی",
        en: "English letters, digits, and symbols",
    },
    hintEan13: {
        fa: "۱۲ رقم (رقم کنترل خودکار افزوده می‌شود) یا ۱۳ رقم",
        en: "12 digits (the check digit is added) or 13 digits",
    },
    hintEan8: { fa: "۷ یا ۸ رقم", en: "7 or 8 digits" },
    hintUpca: { fa: "۱۱ یا ۱۲ رقم", en: "11 or 12 digits" },
    height: { fa: "بلندی (پیکسل)", en: "Height (pixels)" },
    module: { fa: "پهنای باریک‌ترین خط (پیکسل)", en: "Narrowest bar (pixels)" },
    showText: { fa: "نشان دادن متن زیر بارکد", en: "Show the text under the bars" },
    downloadSvg: { fa: "دانلود SVG", en: "Download SVG" },
    downloadPng: { fa: "دانلود PNG", en: "Download PNG" },
    preview: { fa: "بارکد", en: "Barcode" },
    note: {
        fa: "برای چاپ، SVG را به کار ببرید. پیش از چاپ انبوه، بارکد را با یک اسکنر بیازمایید. کد EAN واقعی را باید از GS1 ایران گرفت.",
        en: "For print, use the SVG. Test the barcode with a scanner before printing many. Real EAN numbers come from GS1.",
    },
} as const satisfies Record<string, LocalizedText>;
