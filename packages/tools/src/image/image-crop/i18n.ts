import type { LocalizedText } from "@handyweb/core";

export const strings = {
    ratio: { fa: "نسبت", en: "Aspect ratio" },
    free: { fa: "آزاد", en: "Free" },
    x: { fa: "از چپ (X)", en: "From left (X)" },
    y: { fa: "از بالا (Y)", en: "From top (Y)" },
    width: { fa: "پهنا", en: "Width" },
    height: { fa: "بلندا", en: "Height" },
    area: { fa: "ناحیه برش", en: "Crop area" },
    handle: { fa: "تغییر اندازه ناحیه برش", en: "Resize the crop area" },
    help: {
        fa: "ناحیه را بکشید تا جابه‌جا شود و گوشه آن را بکشید تا اندازه‌اش عوض شود. با صفحه‌کلید، عددها را بنویسید.",
        en: "Drag the area to move it, and drag its corner to resize it. With a keyboard, type the numbers.",
    },
    format: { fa: "قالب خروجی", en: "Output format" },
    same: { fa: "مانند ورودی", en: "Same as input" },
    crop: { fa: "بریدن", en: "Crop" },
    another: { fa: "تصویر دیگر", en: "Another image" },
    result: { fa: "نتیجه", en: "Result" },
    metadata: {
        fa: "فایل خروجی هیچ فراداده‌ای (EXIF، مکان) ندارد. چرخش ذخیره‌شده در عکس پیش از برش اعمال می‌شود.",
        en: "The output file has no metadata (EXIF, location). The orientation stored in the photo is applied before the crop.",
    },
} as const satisfies Record<string, LocalizedText>;
