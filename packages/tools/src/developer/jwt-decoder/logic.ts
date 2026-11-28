import { ToolFailure } from "@handyweb/core/runtime";

/*
 * JWT decoding. Decoding only reads the token: it does not check the
 * signature, so it never tells whether a token is genuine. The UI must say
 * this on every result and must never call a token "valid".
 */

export type PartName = "header" | "payload" | "signature";

export interface TimeClaims {
    /** Expiration time, in seconds since 1970 (RFC 7519 section 4.1.4). */
    exp?: number;
    /** Not before. */
    nbf?: number;
    /** Issued at. */
    iat?: number;
}

export type Warning = "alg-none" | "no-signature";

export interface DecodedJwt {
    /** `jws`: a signed token, 3 parts. `jwe`: an encrypted token, 5 parts. Only its header is readable. */
    kind: "jws" | "jwe";
    header: Record<string, unknown>;
    /** The header as indented JSON. */
    headerText: string;
    /** The payload as indented JSON, or as text when it is not JSON. Empty for a JWE. */
    payloadText: string;
    payloadIsJson: boolean;
    claims: TimeClaims;
    /** The length of the signature in bytes. */
    signatureBytes: number;
    warnings: Warning[];
}

const PART_LABELS: Record<PartName, { fa: string; en: string }> = {
    header: { fa: "سربرگ (header)", en: "header" },
    payload: { fa: "بدنه (payload)", en: "payload" },
    signature: { fa: "امضا (signature)", en: "signature" },
};

function fail(fa: string, en: string, detail?: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function base64UrlToBytes(part: string, name: PartName): Uint8Array {
    const body = part.replace(/=+$/, "");
    const bad = body.search(/[^A-Za-z0-9_-]/);
    if (bad !== -1) {
        const label = PART_LABELS[name];
        throw fail(
            `بخش ${label.fa} نویسه «${body[bad]}» دارد که در Base64url نیست.`,
            `The ${label.en} has the character "${body[bad]}", which is not Base64url.`,
            `${name} position ${bad + 1}`,
        );
    }
    if (body.length % 4 === 1) {
        const label = PART_LABELS[name];
        throw fail(
            `درازای بخش ${label.fa} نادرست است. شاید بخشی از توکن کپی نشده باشد.`,
            `The length of the ${label.en} is not valid. Part of the token may be missing.`,
            `${name} length`,
        );
    }
    const standard = body.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(standard + "=".repeat((4 - (standard.length % 4)) % 4));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function utf8(bytes: Uint8Array, name: PartName): string {
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        const label = PART_LABELS[name];
        throw fail(
            `بخش ${label.fa} نوشته UTF-8 نیست.`,
            `The ${label.en} is not UTF-8 text.`,
            `${name} utf-8`,
        );
    }
}

function numeric(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Decodes a JWT in compact form. A "Bearer " prefix, quotes, and whitespace
 * around the token are removed first.
 */
export function decodeJwt(input: string): DecodedJwt {
    const token = input
        .trim()
        .replace(/^Bearer\s+/i, "")
        .replace(/^["']|["']$/g, "")
        .replace(/\s+/g, "");
    if (token === "") throw fail("ورودی خالی است.", "The input is empty.");

    const parts = token.split(".");
    if (parts.length !== 3 && parts.length !== 5) {
        throw fail(
            `توکن JWT سه بخش دارد که با نقطه جدا شده‌اند (یا پنج بخش برای JWE). این ورودی ${parts.length} بخش دارد.`,
            `A JWT has three parts separated by dots (or five for a JWE). This input has ${parts.length}.`,
            `${parts.length} parts`,
        );
    }

    const headerRaw = utf8(base64UrlToBytes(parts[0] as string, "header"), "header");
    let header: unknown;
    try {
        header = JSON.parse(headerRaw);
    } catch {
        throw fail("سربرگ JSON درستی نیست.", "The header is not valid JSON.", "header json");
    }
    if (typeof header !== "object" || header === null || Array.isArray(header)) {
        throw fail("سربرگ یک شیء JSON نیست.", "The header is not a JSON object.", "header object");
    }
    const headerObject = header as Record<string, unknown>;
    const headerText = JSON.stringify(headerObject, null, 2);
    const warnings: Warning[] = [];
    if (typeof headerObject["alg"] === "string" && headerObject["alg"].toLowerCase() === "none") {
        warnings.push("alg-none");
    }

    if (parts.length === 5) {
        return {
            kind: "jwe",
            header: headerObject,
            headerText,
            payloadText: "",
            payloadIsJson: false,
            claims: {},
            signatureBytes: 0,
            warnings,
        };
    }

    const payloadRaw = utf8(base64UrlToBytes(parts[1] as string, "payload"), "payload");
    let payloadText = payloadRaw;
    let payloadIsJson = false;
    let claims: TimeClaims = {};
    try {
        const payload: unknown = JSON.parse(payloadRaw);
        payloadText = JSON.stringify(payload, null, 2);
        payloadIsJson = true;
        if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
            const record = payload as Record<string, unknown>;
            const exp = numeric(record["exp"]);
            const nbf = numeric(record["nbf"]);
            const iat = numeric(record["iat"]);
            claims = {
                ...(exp === undefined ? {} : { exp }),
                ...(nbf === undefined ? {} : { nbf }),
                ...(iat === undefined ? {} : { iat }),
            };
        }
    } catch {
        // A JWS payload can be any bytes. Show it as text.
    }

    const signatureBytes = base64UrlToBytes(parts[2] as string, "signature").length;
    if (signatureBytes === 0 && !warnings.includes("alg-none")) warnings.push("no-signature");

    return {
        kind: "jws",
        header: headerObject,
        headerText,
        payloadText,
        payloadIsJson,
        claims,
        signatureBytes,
        warnings,
    };
}

export type TimeState = "expired" | "not-yet" | "in-window";

/**
 * Compares the time claims with the clock of this device. The result is about
 * time only. It says nothing about the signature.
 */
export function timeState(claims: TimeClaims, nowSeconds: number): TimeState | null {
    if (claims.exp !== undefined && nowSeconds >= claims.exp) return "expired";
    if (claims.nbf !== undefined && nowSeconds < claims.nbf) return "not-yet";
    if (claims.exp === undefined && claims.nbf === undefined) return null;
    return "in-window";
}
