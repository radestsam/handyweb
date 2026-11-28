import type { ToolDefinition } from "@handyweb/core";

export const htmlEntitiesMeta: ToolDefinition = {
    id: "html-entities",
    slug: "html-entities",
    aliases: ["html-entity-encoder", "html-entity-decoder", "html-encoder", "html-decoder"],
    category: "encoding",
    alsoIn: ["developer"],
    related: ["url-encoding", "base64"],
    tags: ["html", "entities", "escape"],
    title: { fa: "رمزگذاری و رمزگشایی موجودیت‌های HTML", en: "HTML Entity Encoder and Decoder" },
    seoTitle: {
        fa: "رمزگذاری و رمزگشایی موجودیت‌های HTML",
        en: "HTML Entity Encoder and Decoder Online",
    },
    description: {
        fa: "رمزگذاری HTML: نویسه‌های ویژه مانند < و & را به &lt; و &amp; برگردانید، یا &nbsp; و &#1587; را به متن خوانا درآورید.",
        en: "Convert HTML special characters such as < and & to &lt; and &amp;, or decode references such as &nbsp; and &#1587; back to text.",
    },
    keywords: {
        fa: [
            "موجودیت html",
            "کد html فارسی",
            "رمزگذاری html",
            "رمزگشایی html",
            "html entity",
            "escape html",
        ],
        en: [
            "html entities",
            "html encode",
            "html decode",
            "escape html",
            "unescape html",
            "html special characters",
            "nbsp",
        ],
    },
    presets: [
        {
            id: "decode",
            title: { fa: "رمزگشایی موجودیت‌های HTML", en: "HTML Entity Decoder" },
            keywords: { fa: ["رمزگشایی html"], en: ["html decode", "unescape html"] },
            options: { mode: "decode" },
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
        fa: "رمزگذاری، نوشته را برای درون تگ و مقدار ویژگی داخل گیومه ایمن می‌کند، نه برای درون <script>، <style> یا یک URL. رمزگشایی تگ‌ها را پاک نمی‌کند.",
        en: "Encoding makes text safe inside an element and inside a quoted attribute value, not inside <script>, <style>, or a URL. Decoding does not remove tags.",
    },
    guide: {
        steps: [
            {
                fa: "رمزگذاری یا رمزگشایی را برگزینید.",
                en: "Choose Encode or Decode.",
            },
            {
                fa: "نوشته یا HTML را بچسبانید.",
                en: "Paste the text or the HTML.",
            },
            {
                fa: "خروجی را کپی کنید.",
                en: "Copy the output.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کدام نویسه‌ها رمزگذاری می‌شوند؟",
                    en: "Which characters are encoded?",
                },
                answer: {
                    fa: "همیشه & < > \" و '. حروف فارسی و ایموجی دست‌نخورده می‌مانند، چون در صفحه‌ای با UTF-8 نیازی به رمزگذاری ندارند. اگر سامانه‌ای تنها ASCII می‌پذیرد، گزینه نویسه‌های غیر ASCII را روشن کنید.",
                    en: "Always & < > \" and '. Persian letters and emoji stay, because a UTF-8 page does not need them encoded. If a system accepts only ASCII, turn on the non-ASCII option.",
                },
            },
            {
                question: {
                    fa: "کدام موجودیت‌ها رمزگشایی می‌شوند؟",
                    en: "Which references does the decoder know?",
                },
                answer: {
                    fa: "همه ۲٬۲۳۱ موجودیت نام‌دار استاندارد HTML، و شماره‌های دهدهی و هگز. رمزگشایی با پارسر HTML خود مرورگر انجام می‌شود، پس پاسخ همان است که مرورگر در یک صفحه نشان می‌دهد.",
                    en: "All 2,231 named references of the HTML standard, and decimal and hex numbers. The decoder uses the HTML parser of your browser, so the result is what a browser shows on a page.",
                },
            },
            {
                question: {
                    fa: "رمزگشایی HTML ناامن ایمن است؟",
                    en: "Is it safe to decode untrusted HTML here?",
                },
                answer: {
                    fa: "بله. ورودی تنها به شکل نوشته خوانده می‌شود: هیچ اسکریپتی اجرا نمی‌شود و هیچ تصویر یا فایلی بارگیری نمی‌شود.",
                    en: "Yes. The input is read as text only: no script runs, and no image or other file loads.",
                },
            },
        ],
    },
    example: '<p class="note">سلام & "خوش آمدید"</p>',
};
