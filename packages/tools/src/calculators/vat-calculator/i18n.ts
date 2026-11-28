import type { LocalizedText } from "@handyweb/core";

export const strings = {
    amount: { fa: "مبلغ", en: "Amount" },
    rate: { fa: "نرخ مالیات بر ارزش افزوده", en: "VAT rate" },
    mode: { fa: "مبلغ", en: "The amount is" },
    without: { fa: "بدون مالیات است (افزودن)", en: "without VAT (add VAT)" },
    with: { fa: "با مالیات است (جدا کردن)", en: "with VAT (take VAT out)" },
    net: { fa: "مبلغ بدون مالیات", en: "Amount without VAT" },
    vat: { fa: "مالیات بر ارزش افزوده", en: "VAT" },
    gross: { fa: "مبلغ با مالیات", en: "Amount with VAT" },
    rateNote: {
        fa: "نرخ را خودتان بنویسید. نرخ مالیات بر ارزش افزوده در ایران با قانون بودجه هر سال تغییر می‌کند؛ نرخ امسال را از سازمان امور مالیاتی بپرسید.",
        en: "Enter the rate yourself. In Iran, the VAT rate can change with each year's budget law; check this year's rate with the Iranian National Tax Administration.",
    },
    removeNote: {
        fa: "برای جدا کردن مالیات، ۱۰٪ مبلغ را کم نکنید: مالیاتِ ۱۰ درصدی، ۱/۱۱ مبلغ با مالیات است.",
        en: "To take VAT out, do not subtract 10% of the amount: a 10% VAT is 1/11 of the amount with VAT.",
    },
} as const satisfies Record<string, LocalizedText>;
