import type { LocalizedText } from "@handyweb/core";

export const strings = {
    input: { fa: "گواهی یا CSR (PEM)", en: "Certificate or CSR (PEM)" },
    certificate: { fa: "گواهی X.509", en: "X.509 certificate" },
    csr: { fa: "درخواست گواهی (CSR)", en: "Certificate request (CSR)" },
    subject: { fa: "دارنده (Subject)", en: "Subject" },
    issuer: { fa: "صادرکننده (Issuer)", en: "Issuer" },
    serial: { fa: "شماره سریال", en: "Serial number" },
    notBefore: { fa: "معتبر از", en: "Valid from" },
    notAfter: { fa: "معتبر تا", en: "Valid until" },
    publicKey: { fa: "کلید عمومی", en: "Public key" },
    signature: { fa: "الگوریتم امضا", en: "Signature algorithm" },
    san: { fa: "نام‌های جایگزین (SAN)", en: "Alternative names (SAN)" },
    ca: { fa: "گواهی مرجع (CA)", en: "Certificate authority (CA)" },
    selfSigned: { fa: "خودامضا", en: "Self-signed" },
    fingerprint: { fa: "اثر انگشت SHA-256", en: "SHA-256 fingerprint" },
    yes: { fa: "بله", en: "Yes" },
    no: { fa: "نه", en: "No" },
    expired: { fa: "این گواهی منقضی شده است.", en: "This certificate has expired." },
    notYet: { fa: "این گواهی هنوز معتبر نشده است.", en: "This certificate is not valid yet." },
    note: {
        fa: "ابزار امضای گواهی یا زنجیره آن را بررسی نمی‌کند؛ تنها محتوای آن را نشان می‌دهد.",
        en: "The tool does not verify the signature or the chain of the certificate; it only shows what is in it.",
    },
} as const satisfies Record<string, LocalizedText>;
