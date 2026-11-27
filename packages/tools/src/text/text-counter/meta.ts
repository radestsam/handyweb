import type { ToolDefinition } from "@handyweb/core";

export const textCounterMeta: ToolDefinition = {
    id: "text-counter",
    slug: "text-counter",
    aliases: [
        "word-counter",
        "character-counter",
        "line-counter",
        "sentence-counter",
        "reading-time-calculator",
    ],
    category: "text",
    alsoIn: ["persian"],
    related: ["persian-normalizer", "case-converter"],
    tags: ["text", "count", "words", "characters"],
    title: {
        fa: "شمارش واژه، نویسه و زمان خواندن",
        en: "Word and Character Counter",
    },
    description: {
        fa: "شمار واژه‌ها، نویسه‌ها، خط‌ها، بندها و جمله‌های نوشته فارسی یا انگلیسی را ببینید و زمان خواندن آن را برآورد کنید. نیم‌فاصله واژه را دو تکه نمی‌کند.",
        en: "Count the words, characters, lines, paragraphs, and sentences in Persian or English text, and estimate the reading time. A ZWNJ does not split a word.",
    },
    keywords: {
        fa: [
            "شمارش کلمات",
            "شمارش واژه",
            "شمارش حروف",
            "تعداد کاراکتر",
            "شمارش خط",
            "شمارش جمله",
            "زمان مطالعه",
            "زمان خواندن",
        ],
        en: [
            "word count",
            "character count",
            "letter count",
            "line count",
            "sentence count",
            "reading time",
            "persian word count",
        ],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["structured"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "شمار جمله‌ها برآورد است: کوته‌نوشت‌هایی مانند «e.g.» پایان جمله شمرده می‌شوند. زبان‌هایی که میان واژه‌ها اسپیس نمی‌گذارند، مانند چینی، درست شمرده نمی‌شوند.",
        en: "The sentence count is an estimate: abbreviations such as “e.g.” count as a sentence end. Languages without spaces between words, such as Chinese, are not counted correctly.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته را در کادر بنویسید یا بچسبانید. شمارش‌ها همزمان با نوشتن به‌روز می‌شوند.",
                en: "Type or paste your text into the box. The counts update as you type.",
            },
            {
                fa: "اگر تندتر یا کندتر می‌خوانید، شمار واژه در دقیقه را دگرگون کنید.",
                en: "Change the words per minute if you read faster or slower.",
            },
            {
                fa: "برای نگه داشتن شمارش‌ها، دکمه کپی را بزنید.",
                en: "Use the copy button to keep the counts.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "واژه فارسی چگونه شمرده می‌شود؟",
                    en: "How are Persian words counted?",
                },
                answer: {
                    fa: "واژه رشته‌ای از حرف‌ها و شماره‌هاست که اسپیس یا نشانه نگارشی آن را جدا می‌کند. نیم‌فاصله واژه را نمی‌شکند، پس «می‌روم» و «کتاب‌ها» یک واژه‌اند، اما «می روم» دو واژه است. کشیده و زیر و زبر بخشی از واژه‌اند. شماره‌ای مانند ۳٫۱۴ یا ۱۴۰۴/۰۹/۰۵ یک واژه است.",
                    en: "A word is a run of letters and digits that a space or punctuation separates. A ZWNJ does not split a word, so “می‌روم” and “کتاب‌ها” are one word each, but “می روم” is two. Tatweel and diacritics are part of the word. A number such as 3.14 or 1404/09/05 is one word.",
                },
            },
            {
                question: {
                    fa: "نویسه چیست؟",
                    en: "What counts as a character?",
                },
                answer: {
                    fa: "هر نویسه همان چیزی است که در چشم یکی دیده می‌شود. حرفی با زیر یا زبر و ایموجی چندتکه هر کدام یک نویسه‌اند. برای همین این شمار شاید از شمار پایین کادر کمتر باشد.",
                    en: "A character is what you see as one symbol. A letter with a diacritic, or an emoji made of several code points, is one character. This count can be lower than the count under the input box, which counts code points.",
                },
            },
            {
                question: {
                    fa: "جمله‌ها چگونه شمرده می‌شوند؟",
                    en: "How are sentences counted?",
                },
                answer: {
                    fa: "جمله با نقطه، !، ؟، ? یا … پیش از اسپیس یا پایان نوشته، و نیز با یک خط خالی پایان می‌یابد. نقطه درون شماره، مانند 3.14، جمله را پایان نمی‌دهد. بخش پایانی بی‌نشانه هم یک جمله است.",
                    en: "A sentence ends at a period, !, ?, ؟, or … before a space or the end of the text, and at an empty line. A period inside a number, such as 3.14, does not end a sentence. A last part without an end mark also counts.",
                },
            },
            {
                question: {
                    fa: "زمان خواندن چگونه به دست می‌آید؟",
                    en: "How is the reading time found?",
                },
                answer: {
                    fa: "شمار واژه‌ها بر شمار واژه در دقیقه بخش می‌شود و به ثانیه بالا گرد می‌شود. پیش‌فرض ۲۰۰ واژه در دقیقه است.",
                    en: "The word count is divided by the words per minute and rounded up to a whole second. The default is 200 words per minute.",
                },
            },
        ],
    },
    example: "می‌روم به کتاب‌خانه. You can count both languages here!",
};
