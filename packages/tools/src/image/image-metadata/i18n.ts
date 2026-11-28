import type { LocalizedText } from "@handyweb/core";
import type { BlockKind } from "./logic";
import type { Group } from "./exif";

export const strings = {
    none: { fa: "این فایل هیچ فراداده‌ای ندارد.", en: "This file has no metadata." },
    location: {
        fa: "این عکس مکان گرفتن آن را در خود دارد. هر کس فایل را داشته باشد، می‌تواند آن را ببیند.",
        en: "This photo contains the place where it was taken. Anyone who has the file can see it.",
    },
    private: {
        fa: "این عکس داده‌های شخصی مانند نام مالک یا شماره سریال دوربین دارد.",
        en: "This photo contains personal data, such as the owner name or the camera serial number.",
    },
    blocks: { fa: "بلوک‌های فراداده", en: "Metadata blocks" },
    others: { fa: "برچسب دیگر", en: "other tags" },
    keepIcc: { fa: "نگه داشتن پروفایل رنگ (ICC)", en: "Keep the color profile (ICC)" },
    keepIccHelp: {
        fa: "پروفایل رنگ داده شخصی ندارد و رنگ‌ها را درست نگه می‌دارد.",
        en: "The color profile holds no personal data and keeps the colors right.",
    },
    strip: { fa: "پاک کردن فراداده", en: "Remove the metadata" },
    verified: {
        fa: "بررسی شد: فایل خروجی دوباره خوانده شد و هیچ فراداده‌ای در آن نماند. پیکسل‌ها بدون تغییر کپی شدند.",
        en: "Checked: the output file was read again and no metadata is left. The pixels were copied without change.",
    },
    orientationKept: {
        fa: "تنها برچسب «جهت عکس» نگه داشته شد تا عکس درست و نه کج نشان داده شود.",
        en: "Only the Orientation tag was kept, so the photo still shows upright.",
    },
    leftover: {
        fa: "این بلوک‌ها پس از پاک کردن ماندند:",
        en: "These blocks are still in the output:",
    },
    another: { fa: "فایل دیگر", en: "Another file" },
} as const satisfies Record<string, LocalizedText>;

export const GROUPS: Record<Group, LocalizedText> = {
    location: { fa: "مکان", en: "Location" },
    owner: { fa: "مالک و شناسه‌ها", en: "Owner and IDs" },
    camera: { fa: "دوربین", en: "Camera" },
    photo: { fa: "عکس", en: "Photo" },
    other: { fa: "دیگر", en: "Other" },
};

export const BLOCKS: Record<BlockKind, LocalizedText> = {
    exif: { fa: "EXIF (دوربین، تاریخ، مکان)", en: "EXIF (camera, date, location)" },
    xmp: { fa: "XMP (ویرایشگر، برچسب‌ها)", en: "XMP (editor, tags)" },
    iptc: { fa: "IPTC (نویسنده، حق نشر)", en: "IPTC (author, copyright)" },
    comment: { fa: "یادداشت", en: "Comment" },
    icc: { fa: "پروفایل رنگ (ICC)", en: "Color profile (ICC)" },
    text: { fa: "متن", en: "Text" },
    time: { fa: "زمان ویرایش", en: "Change time" },
    other: { fa: "داده سازنده", en: "Maker data" },
};
