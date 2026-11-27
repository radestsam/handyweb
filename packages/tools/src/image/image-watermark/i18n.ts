import type { LocalizedText } from "@handyweb/core";
import type { Position } from "./logic";

export const strings = {
    kind: { fa: "واترمارک", en: "Watermark" },
    text: { fa: "متن", en: "Text" },
    logo: { fa: "لوگو", en: "Logo" },
    textLabel: { fa: "متن واترمارک", en: "Watermark text" },
    chooseLogo: {
        fa: "لوگو را برگزینید (PNG شفاف بهتر است)",
        en: "Choose the logo (a transparent PNG works best)",
    },
    size: { fa: "اندازه (درصد پهنای تصویر)", en: "Size (percent of the image width)" },
    color: { fa: "رنگ", en: "Color" },
    opacity: { fa: "پیدایی", en: "Opacity" },
    layout: { fa: "چیدمان", en: "Layout" },
    single: { fa: "یک‌جا", en: "One place" },
    tiled: { fa: "تکرار در همه تصویر", en: "Repeat over the image" },
    position: { fa: "جا", en: "Position" },
    angle: { fa: "زاویه (درجه)", en: "Angle (degrees)" },
    format: { fa: "قالب خروجی", en: "Output format" },
    same: { fa: "مانند ورودی", en: "Same as input" },
    make: { fa: "ساخت تصویر", en: "Make the image" },
    preview: { fa: "پیش‌نمایش", en: "Preview" },
    tip: {
        fa: "برای سخت کردن پاک کردن واترمارک، «تکرار در همه تصویر» را با پیدایی ۲۰ تا ۳۵ درصد به کار ببرید.",
        en: "To make the watermark hard to remove, use “Repeat over the image” with an opacity of 20 to 35 percent.",
    },
} as const satisfies Record<string, LocalizedText>;

export const POSITION_LABELS: Record<Position, LocalizedText> = {
    "top-left": { fa: "بالا چپ", en: "Top left" },
    top: { fa: "بالا", en: "Top" },
    "top-right": { fa: "بالا راست", en: "Top right" },
    left: { fa: "چپ", en: "Left" },
    center: { fa: "میانه", en: "Center" },
    right: { fa: "راست", en: "Right" },
    "bottom-left": { fa: "پایین چپ", en: "Bottom left" },
    bottom: { fa: "پایین", en: "Bottom" },
    "bottom-right": { fa: "پایین راست", en: "Bottom right" },
};
