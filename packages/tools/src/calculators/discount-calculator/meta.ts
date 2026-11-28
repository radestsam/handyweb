import type { ToolDefinition } from "@handyweb/core";

export const discountCalculatorMeta: ToolDefinition = {
    id: "discount-calculator",
    slug: "discount-calculator",
    aliases: ["sale-calculator", "price-after-discount", "percent-off-calculator"],
    category: "calculators",
    alsoIn: [],
    related: ["percentage-calculator"],
    tags: ["discount", "price", "calculator"],
    title: { fa: "محاسبه تخفیف", en: "Discount Calculator" },
    description: {
        fa: "قیمت پس از تخفیف، مقدار صرفه‌جویی و تخفیف روی‌همِ دو تخفیف پشت سر هم را حساب کنید، یا درصد تخفیف را از قیمت پیش و پس پیدا کنید.",
        en: "Work out the price after a discount, how much you save, and the total of two discounts in a row, or find the discount percent from the prices before and after.",
    },
    keywords: {
        fa: ["محاسبه تخفیف", "قیمت بعد از تخفیف", "درصد تخفیف", "حساب تخفیف"],
        en: ["discount calculator", "price after discount", "percent off", "sale price calculator"],
    },
    presets: [],
    execution: "main-thread",
    privacy: "local",
    networkUse: "none",
    maturity: "stable",
    status: "published",
    featured: false,
    inputKinds: ["text"],
    outputKinds: ["text"],
    limits: { maxInputBytes: 100 },
    limitations: {
        fa: "نتیجه‌ها گرد نمی‌شوند؛ قیمت نهایی را خودتان به ریال یا تومان گرد کنید.",
        en: "Results are not rounded to a currency unit; round the final price yourself.",
    },
    guide: {
        steps: [
            {
                fa: "قیمت و درصد تخفیف را بنویسید.",
                en: "Enter the price and the discount percent.",
            },
            {
                fa: "اگر تخفیف دومی هست، آن را هم بنویسید.",
                en: "If there is a second discount, enter it too.",
            },
            { fa: "قیمت نهایی و صرفه‌جویی را ببینید.", en: "Read the final price and the saving." },
        ],
        faq: [
            {
                question: {
                    fa: "۲۰٪ تخفیف روی ۱۰٪ تخفیف، ۳۰٪ است؟",
                    en: "Is 20% off and then 10% off the same as 30% off?",
                },
                answer: {
                    fa: "نه. تخفیف دوم روی قیمتِ پس از تخفیف اول حساب می‌شود، پس روی‌هم ۲۸٪ است.",
                    en: "No. The second discount applies to the price after the first one, so the total is 28%.",
                },
            },
        ],
    },
    example: "1000000",
};
