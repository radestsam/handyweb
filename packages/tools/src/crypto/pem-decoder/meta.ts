import type { ToolDefinition } from "@handyweb/core";

export const pemDecoderMeta: ToolDefinition = {
    id: "pem-decoder",
    slug: "pem-decoder",
    aliases: ["certificate-decoder", "csr-decoder", "ssl-certificate-decoder", "x509-decoder"],
    category: "crypto",
    alsoIn: ["developer", "network"],
    related: ["hash", "http-header-parser"],
    tags: ["certificate", "pem", "csr", "x509"],
    title: { fa: "خواندن گواهی SSL و CSR", en: "SSL Certificate and CSR Decoder" },
    seoTitle: {
        fa: "خواندن گواهی SSL و CSR و تاریخ انقضا",
        en: "SSL Certificate and CSR Decoder (PEM, X.509)",
    },
    description: {
        fa: "یک گواهی SSL/TLS (X.509) یا درخواست گواهی (CSR) به شکل PEM را بخوانید: دارنده، صادرکننده، تاریخ اعتبار، نام‌های دامنه، کلید و اثر انگشت SHA-256.",
        en: "Read an SSL/TLS certificate (X.509) or a certificate request (CSR) in PEM form: subject, issuer, validity, domain names, key, and SHA-256 fingerprint.",
    },
    keywords: {
        fa: ["گواهی ssl", "خواندن گواهی", "csr", "pem", "تاریخ انقضای گواهی"],
        en: [
            "certificate decoder",
            "csr decoder",
            "ssl certificate",
            "x509",
            "pem decoder",
            "certificate expiry",
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
    limits: { maxInputBytes: 200_000 },
    limitations: {
        fa: "امضا و زنجیره گواهی بررسی نمی‌شوند. تنها نخستین بلوک PEM خوانده می‌شود. کلیدهای خصوصی پذیرفته نمی‌شوند.",
        en: "The signature and the chain are not verified. Only the first PEM block is read. Private keys are refused.",
    },
    guide: {
        steps: [
            {
                fa: "گواهی یا CSR را، از -----BEGIN تا -----END، بچسبانید.",
                en: "Paste the certificate or the CSR, from -----BEGIN to -----END.",
            },
            {
                fa: "فیلدها و تاریخ اعتبار را بخوانید.",
                en: "Read the fields and the validity dates.",
            },
        ],
        faq: [
            {
                question: {
                    fa: "کلید خصوصی را هم بچسبانم؟",
                    en: "Do I paste the private key too?",
                },
                answer: {
                    fa: "هرگز. گواهی و CSR عمومی‌اند، اما کلید خصوصی نباید از سرور شما بیرون برود. این ابزار کلید خصوصی را نمی‌پذیرد.",
                    en: "Never. Certificates and CSRs are public, but a private key must never leave your server. This tool refuses private keys.",
                },
            },
        ],
    },
    example:
        "-----BEGIN CERTIFICATE-----\nMIIBtzCCAV2gAwIBAgICEjQwCgYIKoZIzj0EAwIwNjELMAkGA1UEBhMCSVIxETAP\nBgNVBAoMCEhhbmR5V2ViMRQwEgYDVQQDDAtoYW5keXdlYi5pcjAeFw0yNjExMjcx\nMTI0MzlaFw0yNzExMjcxMTI0MzlaMDYxCzAJBgNVBAYTAklSMREwDwYDVQQKDAhI\nYW5keVdlYjEUMBIGA1UEAwwLaGFuZHl3ZWIuaXIwWTATBgcqhkjOPQIBBggqhkjO\nPQMBBwNCAARzHlx6aJNOujKjr/g8vvFEjipb0YVQ3afy4fFUnAh+AqCbouFNm8jU\n8JXtkO0oQI66F8SSUp73WZif8m0zB4JRo1swWTAdBgNVHQ4EFgQUlbyvhV4+kgfK\nMH2kdFyad0+3uQ4wDwYDVR0TAQH/BAUwAwEB/zAnBgNVHREEIDAeggtoYW5keXdl\nYi5pcoIPd3d3LmhhbmR5d2ViLmlyMAoGCCqGSM49BAMCA0gAMEUCIQD9IJI9c30O\n2lL/qLk3LQMJHox6vG4Qntj9hBDdqvXbBwIgI3dTPFwduAJsOYLEjTmJZOrRLGaD\nD2m2JrpzIJky2gk=\n-----END CERTIFICATE-----",
};
