import type { ToolDefinition } from "@handyweb/core";

export const caseConverterMeta: ToolDefinition = {
    id: "case-converter",
    slug: "case-converter",
    aliases: [
        "uppercase-converter",
        "lowercase-converter",
        "title-case-converter",
        "sentence-case-converter",
    ],
    category: "text",
    alsoIn: [],
    related: ["text-counter"],
    tags: ["text", "case", "uppercase", "lowercase"],
    title: { fa: "تبدیل حروف بزرگ و کوچک انگلیسی", en: "Case Converter" },
    seoTitle: {
        fa: "تبدیل حروف بزرگ و کوچک انگلیسی آنلاین",
        en: "Case Converter: Uppercase, Lowercase, Title Case",
    },
    description: {
        fa: "تبدیل حروف بزرگ و کوچک انگلیسی، یا تبدیل متن به شیوه عنوان (Title Case) یا جمله (Sentence case). متن فارسی دست‌نخورده می‌ماند.",
        en: "Convert text to UPPERCASE, lowercase, Title Case, or Sentence case. Title case follows the Chicago Manual of Style. Persian text stays as it is.",
    },
    keywords: {
        fa: [
            "حروف بزرگ",
            "حروف کوچک",
            "بزرگ کردن حروف",
            "کوچک کردن حروف",
            "تبدیل حروف انگلیسی",
            "عنوان انگلیسی",
        ],
        en: [
            "uppercase",
            "lowercase",
            "title case",
            "sentence case",
            "capitalize",
            "chicago title case",
            "change case",
        ],
    },
    presets: [
        {
            id: "uppercase",
            title: { fa: "بزرگ کردن حروف انگلیسی", en: "Uppercase Converter" },
            keywords: { fa: ["حروف بزرگ"], en: ["uppercase", "all caps"] },
            options: { mode: "upper" },
        },
        {
            id: "lowercase",
            title: { fa: "کوچک کردن حروف انگلیسی", en: "Lowercase Converter" },
            keywords: { fa: ["حروف کوچک"], en: ["lowercase"] },
            options: { mode: "lower" },
        },
        {
            id: "title-case",
            title: { fa: "تبدیل به Title Case", en: "Title Case Converter" },
            keywords: { fa: ["عنوان انگلیسی"], en: ["title case", "headline case"] },
            options: { mode: "title" },
        },
        {
            id: "sentence-case",
            title: { fa: "تبدیل به Sentence case", en: "Sentence Case Converter" },
            keywords: { fa: ["جمله انگلیسی"], en: ["sentence case"] },
            options: { mode: "sentence" },
        },
    ],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 5_000_000 },
    limitations: {
        fa: "خط فارسی حرف بزرگ و کوچک ندارد، پس دگرگون نمی‌شود. در شیوه جمله، نام‌های خاص کوچک می‌شوند، مگر آن‌که حرف بزرگی در میانه داشته باشند (مانند NASA یا iPhone). کوته‌نوشت‌هایی مانند «e.g.» پایان جمله شمرده می‌شوند.",
        en: "Persian script has no letter case, so it does not change. In sentence case, proper names become lowercase unless they have a capital after the first letter (such as NASA or iPhone). Abbreviations such as “e.g.” count as a sentence end.",
    },
    guide: {
        steps: [
            {
                fa: "نوشته را در کادر ورودی بنویسید یا بچسبانید.",
                en: "Type or paste your text into the input box.",
            },
            {
                fa: "یکی از چهار شیوه را برگزینید. خروجی همزمان به‌روز می‌شود.",
                en: "Choose one of the four cases. The output updates as you type.",
            },
            {
                fa: "خروجی را کپی کنید.",
                en: "Copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "Title Case چگونه کار می‌کند؟",
                    en: "Which title case rules does it use?",
                },
                answer: {
                    fa: "شیوه Chicago Manual of Style: نخستین و واپسین واژه و همه واژه‌های اصلی با حرف بزرگ آغاز می‌شوند. حرف‌های تعریف (a، an، the)، حرف‌های ربط (and، but، or و مانند آن‌ها)، to، as و حرف‌های اضافه (of، in، with و مانند آن‌ها) کوچک می‌مانند. پس از دونقطه یا خط تیره، بخش تازه‌ای آغاز می‌شود.",
                    en: "It follows the Chicago Manual of Style. The first word, the last word, and all major words start with a capital. Articles (a, an, the), coordinating conjunctions (and, but, or, and so on), “to”, “as”, and prepositions (of, in, with, and so on) stay lowercase. A colon or a dash starts a new part, so the next word is capitalized.",
                },
            },
            {
                question: {
                    fa: "چرا NASA یا iPhone دگرگون نشد؟",
                    en: "Why did NASA or iPhone not change?",
                },
                answer: {
                    fa: "واژه‌ای که پس از حرف نخست حرف بزرگی دارد، کوته‌نوشت یا نام ویژه شمرده می‌شود و در Title Case و Sentence case دست‌نخورده می‌ماند. اگر همه نوشته با حروف بزرگ باشد، این قاعده به کار نمی‌رود.",
                    en: "A word with a capital after its first letter is treated as an acronym or a brand name, so title case and sentence case keep it. When the whole text is in capitals, this rule does not apply.",
                },
            },
            {
                question: {
                    fa: "برای «up» در «Set Up» چه می‌شود؟",
                    en: "What happens to “up” in “Set Up”?",
                },
                answer: {
                    fa: "up، down، out، off و over بیشتر بخشی از فعل‌اند، پس با حرف بزرگ نوشته می‌شوند. اگر در عنوان شما حرف اضافه‌اند، آن‌ها را با دست کوچک کنید.",
                    en: "“Up”, “down”, “out”, “off”, and “over” are usually part of a phrasal verb, so they are capitalized. If one of them is a preposition in your title, change it to lowercase by hand.",
                },
            },
        ],
    },
    example: "the lord of the rings: the return of the king",
};
