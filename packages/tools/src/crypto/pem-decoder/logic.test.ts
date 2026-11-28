import { describe, expect, it } from "vitest";
import type { ToolFailure } from "@handyweb/core/runtime";
import { decodePem } from "./logic";

// Made with OpenSSL for these tests. Public data only.
const CERT = `-----BEGIN CERTIFICATE-----
MIIBtzCCAV2gAwIBAgICEjQwCgYIKoZIzj0EAwIwNjELMAkGA1UEBhMCSVIxETAP
BgNVBAoMCEhhbmR5V2ViMRQwEgYDVQQDDAtoYW5keXdlYi5pcjAeFw0yNjExMjcx
MTI0MzlaFw0yNzExMjcxMTI0MzlaMDYxCzAJBgNVBAYTAklSMREwDwYDVQQKDAhI
YW5keVdlYjEUMBIGA1UEAwwLaGFuZHl3ZWIuaXIwWTATBgcqhkjOPQIBBggqhkjO
PQMBBwNCAARzHlx6aJNOujKjr/g8vvFEjipb0YVQ3afy4fFUnAh+AqCbouFNm8jU
8JXtkO0oQI66F8SSUp73WZif8m0zB4JRo1swWTAdBgNVHQ4EFgQUlbyvhV4+kgfK
MH2kdFyad0+3uQ4wDwYDVR0TAQH/BAUwAwEB/zAnBgNVHREEIDAeggtoYW5keXdl
Yi5pcoIPd3d3LmhhbmR5d2ViLmlyMAoGCCqGSM49BAMCA0gAMEUCIQD9IJI9c30O
2lL/qLk3LQMJHox6vG4Qntj9hBDdqvXbBwIgI3dTPFwduAJsOYLEjTmJZOrRLGaD
D2m2JrpzIJky2gk=
-----END CERTIFICATE-----`;
const CSR = `-----BEGIN CERTIFICATE REQUEST-----
MIICijCCAXICAQAwRTELMAkGA1UEBhMCSVIxDzANBgNVBAgMBlRlaHJhbjEQMA4G
A1UECgwHVGVzdCBDbzETMBEGA1UEAwwKZXhhbXBsZS5pcjCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAJsogXyaGiNLHPwqDSH4AxM6nauYDuwj09azlx1+
5pDcSUUW1+gw5rwFlg+mnQAXHyzhGf+rHV1rCalvoRey3aqOySDfojmePwnUn3dN
rxewRV6FIGLk3Hiuu1z4b26GeqFyFfrPCX+aZ+z1vagoR01fNaQAMUPhKZljalcN
gvspXdX9SYVCMY8ttaG/V4elaojwFQEJrRc/O2qQkVWzXIFa9xxezSxU1Wy6Rw1d
j5J/rsfXlmVllIjJl1yhzZrSD+VkiZKwE5hLbuuCSp3o/HPGyDFKZxYEl2ZTXP4A
GFNHGNxlH6idIRowgZ9Uul2sHbyCeDu5F1QxL2wgMHi9LOECAwEAAaAAMA0GCSqG
SIb3DQEBCwUAA4IBAQBdlC9D4U41TnE9ui676acvFohAwAEVL5Ob4AQSA2Gr2nj5
WMINGGRD4k/LDtBmMuug3nm7vouzUAwihpE7uPF7keNlYqGEL1LAP+FDmA7DuJt0
uKYp2kDNndKWh59QJ1qg1RBDaPyCR9/en/BLJlytFpS/b0O0ClwY8GBePD6HlIvd
F3pdhdCkObcWi70lzbc/JL2aauuK5sjJlf1nqZqrP6x9JFjSRMcmDjd7hQhaDP5D
lVzyyng7TLvZNnaDWLB7Ymz2uVRk9jq6bja/zvqX5ajzhb8BjxiR1zjbTm8O4OxE
p8r50P4fCr+cvNH+eaB6TFYJ0bM8xjQ2oLrusLj0
-----END CERTIFICATE REQUEST-----`;

async function failure(promise: Promise<unknown>): Promise<ToolFailure> {
    try {
        await promise;
    } catch (error) {
        return error as ToolFailure;
    }
    throw new Error("expected a failure");
}

describe("decodePem", () => {
    it("reads a certificate", async () => {
        const cert = await decodePem(CERT);
        expect(cert).toMatchObject({
            kind: "certificate",
            subject: "C=IR, O=HandyWeb, CN=handyweb.ir",
            issuer: "C=IR, O=HandyWeb, CN=handyweb.ir",
            serial: "12:34",
            publicKey: { algorithm: "EC", size: "P-256" },
            signatureAlgorithm: "ECDSA with SHA-256",
            subjectAltNames: ["DNS:handyweb.ir", "DNS:www.handyweb.ir"],
            selfSigned: true,
            sha256: "1B:4A:A7:2E:54:F3:3E:0D:33:55:0F:4E:D6:01:8F:E4:40:08:6A:EA:81:BA:02:54:9D:D6:16:C6:65:3F:17:5E",
        });
        expect(cert.notBefore?.toISOString()).toBe("2026-11-27T11:24:39.000Z");
        expect(cert.notAfter?.toISOString()).toBe("2027-11-27T11:24:39.000Z");
    });

    it("reads a certificate request", async () => {
        expect(await decodePem(CSR)).toMatchObject({
            kind: "csr",
            subject: "C=IR, ST=Tehran, O=Test Co, CN=example.ir",
            publicKey: { algorithm: "RSA", size: "2048 bit" },
            signatureAlgorithm: "SHA-256 with RSA",
        });
    });

    it("refuses a private key", async () => {
        const key =
            "-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIA==\n-----END PRIVATE KEY-----";
        expect((await failure(decodePem(key))).detail).toBe("private key");
    });

    it("rejects other data", async () => {
        expect((await failure(decodePem("aGVsbG8gd29ybGQ="))).code).toBe("invalid-input");
        expect((await failure(decodePem("  "))).detail).toBe("empty");
    });
});
