import type { ToolDefinition } from "@handyweb/core";

export const fileSignatureMeta: ToolDefinition = {
    id: "file-signature",
    slug: "file-signature",
    aliases: ["file-type-checker", "magic-number", "file-type-detector", "what-file-is-this"],
    category: "developer",
    alsoIn: ["crypto"],
    related: ["hash", "base64-file"],
    tags: ["file", "magic number", "security"],
    title: {
        fa: "تشخیص گونه واقعی فایل",
        en: "File Type Detector",
    },
    description: {
        fa: "گونه واقعی یک فایل را از بایت‌های آغاز آن (امضا یا magic number) بیابید، و ببینید آیا پسوند آن گمراه‌کننده است، مانند برنامه‌ای که نامش photo.jpg است.",
        en: "Find the real type of a file from its first bytes (signature or magic number), and see whether its extension is misleading, such as a program named photo.jpg.",
    },
    keywords: {
        fa: ["گونه فایل", "تشخیص نوع فایل", "پسوند فایل", "فایل مشکوک", "magic number"],
        en: [
            "file type checker",
            "magic number",
            "file signature",
            "detect file type",
            "fake extension",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["file", "text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 10_000 },
    limitations: {
        fa: "بیش از ۴۰ امضای رایج را می‌شناسد. گونه‌های متنی، مانند CSV یا JSON، امضا ندارند. یک فایل با امضای درست باز هم می‌تواند خطرناک باشد: این ابزار ویروس‌یاب نیست.",
        en: "It knows more than 40 common signatures. Text formats, such as CSV or JSON, have no signature. A file with a correct signature can still be harmful: this tool is not a virus scanner.",
    },
    guide: {
        steps: [
            { fa: "فایل را برگزینید.", en: "Choose the file." },
            {
                fa: "گونه واقعی را با پسوند فایل بسنجید.",
                en: "Compare the real type with the file extension.",
            },
        ],
        faq: [
            {
                question: { fa: "چرا پسوند کافی نیست؟", en: "Why is the extension not enough?" },
                answer: {
                    fa: "هر کسی می‌تواند نام فایل را دگرگون کند. بایت‌های آغاز فایل گونه واقعی آن را نشان می‌دهند. برای نمونه، هر برنامه ویندوز با «MZ» آغاز می‌شود، حتی اگر نامش photo.jpg باشد.",
                    en: "Anyone can rename a file. The first bytes show its real type. For example, every Windows program starts with “MZ”, even when it is named photo.jpg.",
                },
            },
        ],
    },
    example: "89 50 4E 47 0D 0A 1A 0A",
};
