import { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes } from "../../encoding/base64/logic";
import { DerError, hex, inner, oid, parseDer, text, time, type Node } from "./asn1";

const NAMES: Record<string, string> = {
    "2.5.4.3": "CN",
    "2.5.4.6": "C",
    "2.5.4.7": "L",
    "2.5.4.8": "ST",
    "2.5.4.10": "O",
    "2.5.4.11": "OU",
    "2.5.4.5": "serialNumber",
    "1.2.840.113549.1.9.1": "emailAddress",
};
const ALGORITHMS: Record<string, string> = {
    "1.2.840.113549.1.1.1": "RSA",
    "1.2.840.10045.2.1": "EC",
    "1.3.101.112": "Ed25519",
    "1.3.101.113": "Ed448",
    "1.2.840.113549.1.1.5": "SHA-1 with RSA",
    "1.2.840.113549.1.1.11": "SHA-256 with RSA",
    "1.2.840.113549.1.1.12": "SHA-384 with RSA",
    "1.2.840.113549.1.1.13": "SHA-512 with RSA",
    "1.2.840.113549.1.1.10": "RSA-PSS",
    "1.2.840.10045.4.3.2": "ECDSA with SHA-256",
    "1.2.840.10045.4.3.3": "ECDSA with SHA-384",
    "1.2.840.10045.4.3.4": "ECDSA with SHA-512",
};
const CURVES: Record<string, string> = {
    "1.2.840.10045.3.1.7": "P-256",
    "1.3.132.0.34": "P-384",
    "1.3.132.0.35": "P-521",
};

export interface PublicKeyInfo {
    algorithm: string;
    /** RSA modulus size in bits, or the curve name. */
    size: string;
}

export interface Decoded {
    kind: "certificate" | "csr";
    subject: string;
    issuer: string | null;
    serial: string | null;
    notBefore: Date | null;
    notAfter: Date | null;
    publicKey: PublicKeyInfo;
    signatureAlgorithm: string;
    subjectAltNames: string[];
    isCa: boolean | null;
    selfSigned: boolean;
    /** SHA-256 of the DER, as a fingerprint. */
    sha256: string;
}

function fail(fa: string, en: string, detail?: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

/** Takes the first PEM block, or reads the input as Base64 DER. */
export function pemToDer(input: string): { der: Uint8Array; label: string } {
    const text = input.trim();
    const block = /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/.exec(text);
    const label = block?.[1] ?? "";
    if (/PRIVATE KEY/.test(label)) {
        throw fail(
            "این یک کلید خصوصی است. کلید خصوصی را هرگز جایی نچسبانید. این ابزار تنها گواهی و درخواست گواهی را می‌خواند.",
            "This is a private key. Never paste a private key anywhere. This tool reads only certificates and certificate requests.",
            "private key",
        );
    }
    return { der: base64ToBytes(block ? (block[2] as string) : text), label };
}

function name(bytes: Uint8Array, node: Node): string {
    const parts: string[] = [];
    for (const set of node.children) {
        for (const pair of set.children) {
            const [type, value] = pair.children as [Node, Node];
            const id = oid(bytes, type);
            parts.push(`${NAMES[id] ?? id}=${text(bytes, value)}`);
        }
    }
    return parts.join(", ");
}

function algorithm(bytes: Uint8Array, node: Node): string {
    const id = oid(bytes, node.children[0] as Node);
    return ALGORITHMS[id] ?? id;
}

function publicKey(bytes: Uint8Array, spki: Node): PublicKeyInfo {
    const [algo, key] = spki.children as [Node, Node];
    const id = oid(bytes, algo.children[0] as Node);
    const name = ALGORITHMS[id] ?? id;
    if (name === "RSA") {
        const rsa = inner(bytes, key);
        const modulus = rsa?.children[0];
        if (modulus) {
            let start = modulus.start;
            while (bytes[start] === 0 && start < modulus.end - 1) start++;
            const bits = (modulus.end - start) * 8 - Math.clz32(bytes[start] as number) + 24;
            return { algorithm: "RSA", size: `${bits} bit` };
        }
    }
    if (name === "EC") {
        const curve = algo.children[1];
        return {
            algorithm: "EC",
            size:
                curve && curve.tag === 0x06 ? (CURVES[oid(bytes, curve)] ?? oid(bytes, curve)) : "",
        };
    }
    return { algorithm: name, size: "" };
}

function extensions(
    bytes: Uint8Array,
    list: Node | undefined,
): { san: string[]; isCa: boolean | null } {
    const san: string[] = [];
    let isCa: boolean | null = null;
    for (const extension of list?.children ?? []) {
        const id = oid(bytes, extension.children[0] as Node);
        const value = inner(bytes, extension.children[extension.children.length - 1] as Node);
        if (!value) continue;
        if (id === "2.5.29.17") {
            for (const general of value.children) {
                const kind = general.tag & 0x1f;
                if (kind === 2) san.push(`DNS:${text(bytes, general)}`);
                else if (kind === 1) san.push(`email:${text(bytes, general)}`);
                else if (kind === 6) san.push(`URI:${text(bytes, general)}`);
                else if (kind === 7) {
                    const ip = bytes.slice(general.start, general.end);
                    san.push(
                        `IP:${ip.length === 4 ? Array.from(ip).join(".") : hex(ip, 0, ip.length, "")}`,
                    );
                }
            }
        } else if (id === "2.5.29.19") {
            const flag = value.children[0];
            isCa = flag?.tag === 0x01 ? bytes[flag.start] !== 0 : false;
        }
    }
    return { san, isCa };
}

/** Decodes an X.509 certificate or a PKCS #10 certificate request. */
export async function decodePem(input: string): Promise<Decoded> {
    if (input.trim() === "") throw fail("ورودی خالی است.", "The input is empty.", "empty");
    const { der, label } = pemToDer(input);
    const digest = new Uint8Array(
        await crypto.subtle.digest("SHA-256", der as Uint8Array<ArrayBuffer>),
    );
    const sha256 = hex(digest, 0, digest.length);
    try {
        const root = parseDer(der);
        const info = root.children[0] as Node;
        const signatureAlgorithm = algorithm(der, root.children[1] as Node);
        const isCsr =
            /REQUEST/.test(label) ||
            (info.children[0]?.tag === 0x02 &&
                info.children.length === 4 &&
                info.children[3]?.tag === 0xa0);
        if (isCsr) {
            const [, subject, spki, attributes] = info.children as [Node, Node, Node, Node];
            let ext: Node | undefined;
            for (const attribute of attributes.children) {
                if (oid(der, attribute.children[0] as Node) === "1.2.840.113549.1.9.14") {
                    ext = attribute.children[1]?.children[0];
                }
            }
            const { san, isCa } = extensions(der, ext);
            return {
                kind: "csr",
                subject: name(der, subject),
                issuer: null,
                serial: null,
                notBefore: null,
                notAfter: null,
                publicKey: publicKey(der, spki),
                signatureAlgorithm,
                subjectAltNames: san,
                isCa,
                selfSigned: false,
                sha256,
            };
        }
        // The version field [0] is optional (v1 certificates).
        const fields = info.children[0]?.tag === 0xa0 ? info.children.slice(1) : info.children;
        const [serialNode, , issuer, validity, subject, spki] = fields as [
            Node,
            Node,
            Node,
            Node,
            Node,
            Node,
        ];
        const ext = fields.find((node) => node.tag === 0xa3)?.children[0];
        const { san, isCa } = extensions(der, ext);
        const subjectText = name(der, subject);
        const issuerText = name(der, issuer);
        return {
            kind: "certificate",
            subject: subjectText,
            issuer: issuerText,
            serial: hex(der, serialNode.start, serialNode.end),
            notBefore: time(der, validity.children[0] as Node),
            notAfter: time(der, validity.children[1] as Node),
            publicKey: publicKey(der, spki),
            signatureAlgorithm,
            subjectAltNames: san,
            isCa,
            selfSigned: subjectText === issuerText,
            sha256,
        };
    } catch (error) {
        if (error instanceof ToolFailure) throw error;
        throw fail(
            "این داده گواهی X.509 یا درخواست گواهی (CSR) نیست، یا کامل نیست.",
            "This is not an X.509 certificate or a certificate request (CSR), or it is not complete.",
            error instanceof DerError ? error.message : "structure",
        );
    }
}
