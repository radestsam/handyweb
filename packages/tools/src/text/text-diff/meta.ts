import type { ToolDefinition } from "@handyweb/core";

export const textDiffMeta: ToolDefinition = {
    id: "text-diff",
    slug: "text-diff",
    aliases: ["diff-checker", "compare-text", "diff", "text-compare"],
    category: "text",
    alsoIn: ["developer"],
    related: ["remove-duplicate-lines", "persian-normalizer"],
    tags: ["diff", "compare", "text"],
    title: {
        fa: "مقایسه دو متن و نمایش تفاوت‌ها",
        en: "Text Diff Checker",
    },
    description: {
        fa: "دو نوشته را خط به خط، واژه به واژه یا نویسه به نویسه با هم بسنجید و افزوده‌ها و برداشته‌ها را ببینید. خروجی را به شکل patch هم کپی کنید.",
        en: "Compare two texts line by line, word by word, or character by character, and see what was added and removed. Copy the result as a patch too.",
    },
    keywords: {
        fa: ["مقایسه متن", "تفاوت دو متن", "مقایسه دو فایل", "diff", "مقایسه نوشته"],
        en: [
            "text diff",
            "diff checker",
            "compare text",
            "compare two texts",
            "unified diff",
            "patch",
        ],
    },
    presets: [],
    execution: "worker",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: true,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 10_000_000 },
    limitations: {
        fa: "سنجش نویسه به نویسه تا ۲۰۰ هزار نویسه کار می‌کند. اگر دو نوشته بزرگ بسیار با هم فرق داشته باشند، سنجش پس از ۱۰ ثانیه می‌ایستد. patch همیشه خط به خط است.",
        en: "Character comparison works up to 200,000 characters. If two large texts are very different, the comparison stops after 10 seconds. The patch is always line by line.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته نخست را در کادر راست و نوشته دگرگون‌شده را در کادر چپ بچسبانید.",
                en: "Paste the original text into the first box and the changed text into the second.",
            },
            {
                fa: "سنجش خط به خط، واژه به واژه یا نویسه به نویسه را برگزینید.",
                en: "Choose to compare by lines, words, or characters.",
            },
            {
                fa: "افزوده‌ها سبز و برداشته‌ها سرخ‌اند. برای بردن فرق‌ها به جای دیگر، patch را کپی کنید.",
                en: "Additions are green and removals are red. Copy the patch to use the changes somewhere else.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام شیوه سنجش را برگزینم؟",
                    en: "Which comparison do I need?",
                },
                answer: {
                    fa: "برای کد و فهرست‌ها خط به خط. برای نوشته و نامه واژه به واژه. برای یافتن یک غلط تایپی یا نویسه نادیدنی، نویسه به نویسه.",
                    en: "Lines for code and lists. Words for prose and letters. Characters to find a typo or an invisible character.",
                },
            },
            {
                question: {
                    fa: "واژه‌های فارسی با نیم‌فاصله درست سنجیده می‌شوند؟",
                    en: "Are Persian words with ZWNJ compared correctly?",
                },
                answer: {
                    fa: "بله. واژه‌ها با جداکننده واژه مرورگر برای فارسی جدا می‌شوند، پس «کتاب‌خانه» یک واژه است.",
                    en: "Yes. Words are split with the Persian word segmenter of the browser, so “کتاب‌خانه” is one word.",
                },
            },
            {
                question: {
                    fa: "patch چیست؟",
                    en: "What is the patch?",
                },
                answer: {
                    fa: "فرق‌ها به شکل unified diff، همان شکلی که git diff و diff -u می‌نویسند. آن را می‌توانید با ابزارهایی مانند patch یا git apply به کار ببرید.",
                    en: "The differences as a unified diff, the form that git diff and diff -u write. You can apply it with tools such as patch or git apply.",
                },
            },
        ],
    },
    example: "سلام دنیا\nخط دوم",
};
