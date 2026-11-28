import type { ToolDefinition } from "@handyweb/core";

export const svgOptimizerMeta: ToolDefinition = {
    id: "svg-optimizer",
    slug: "svg-optimizer",
    aliases: ["svg-minifier", "minify-svg", "optimize-svg", "svg-compressor"],
    category: "image",
    alsoIn: ["developer"],
    related: ["svg-viewer", "favicon-generator"],
    tags: ["svg", "optimize", "minify"],
    title: { fa: "بهینه‌سازی و کوچک کردن SVG", en: "SVG Optimizer" },
    description: {
        fa: "حجم SVG را با پاک کردن داده‌های ویرایشگر، توضیح‌ها، گروه‌های خالی و رقم‌های اضافه کم کنید، و پیش و پس را کنار هم ببینید. هیچ چیزی بارگذاری نمی‌شود.",
        en: "Make an SVG smaller by removing editor data, comments, empty groups, and extra digits, and compare before and after. Nothing is uploaded.",
    },
    keywords: {
        fa: ["بهینه سازی svg", "کم کردن حجم svg", "فشرده سازی svg", "minify svg"],
        en: ["svg optimizer", "minify svg", "optimize svg", "svg minifier", "reduce svg size"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text", "file"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "تنها کارهای بی‌خطر انجام می‌شود: شکل‌ها با هم یکی نمی‌شوند و مسیرها بازنویسی نمی‌شوند، پس SVGO گاهی کوچک‌تر می‌سازد. رقم اعشار کم ممکن است شکل‌های بسیار کوچک را دیگرگون کند.",
        en: "Only safe changes are made: shapes are not merged and paths are not rewritten, so SVGO can sometimes make a smaller file. Few decimal places may change very small shapes.",
    },
    guide: {
        steps: [
            { fa: "SVG را بچسبانید یا فایل را برگزینید.", en: "Paste the SVG or choose the file." },
            {
                fa: "رقم اعشار را برگزینید و پیش و پس را بسنجید.",
                en: "Choose the decimal places and compare before and after.",
            },
            { fa: "SVG بهینه را کپی یا دانلود کنید.", en: "Copy or download the optimized SVG." },
        ],
        faq: [
            {
                question: { fa: "چه چیزهایی پاک می‌شود؟", en: "What is removed?" },
                answer: {
                    fa: "اعلان XML، توضیح‌ها، metadata، داده‌های Inkscape، Illustrator و دیگر ویرایشگرها، گروه‌های خالی یا بی‌ویژگی، فاصله‌های اضافه و رقم‌های اعشار بیش از اندازه.",
                    en: "The XML declaration, comments, metadata, data from Inkscape, Illustrator, and other editors, empty groups or groups with no attributes, extra spaces, and too many decimal places.",
                },
            },
        ],
    },
    example:
        '<?xml version="1.0"?>\n<!-- icon -->\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24.000 24.000">\n  <g>\n    <path d="M 4.000000,12.000000 L 20.000000,12.000000" stroke="#bc4a3c" stroke-width="2.000000"/>\n  </g>\n</svg>',
};
