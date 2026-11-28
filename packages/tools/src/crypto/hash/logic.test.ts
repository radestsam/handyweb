import { describe, expect, it, vi } from "vitest";
import { digestsMatch, encodeDigest, hashBlob, hashText, type Algorithm } from "./logic";

// FIPS 180-2 / NIST example vectors for SHA-256.
const VECTORS: Array<[string, string]> = [
    ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
    ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
    [
        "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
        "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
    ],
];

describe("hashText", () => {
    it.each(VECTORS)("hashes %j", async (text, hex) => {
        expect(encodeDigest(await hashText(text), "hex")).toBe(hex);
    });

    it("hashes Persian text as UTF-8", async () => {
        const viaBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("سلام"));
        expect(await hashText("سلام")).toEqual(new Uint8Array(viaBytes));
    });
});

describe("hashBlob", () => {
    it("matches the one-shot digest across many chunks", async () => {
        const data = new Uint8Array(3_000_000).map((_, i) => (i * 31) % 251);
        const blob = new Blob([data]);
        const onProgress = vi.fn();
        const streamed = await hashBlob(blob, { onProgress });
        const oneShot = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
        expect(streamed).toEqual(oneShot);
        expect(onProgress).toHaveBeenLastCalledWith({ completed: 3_000_000, total: 3_000_000 });
    });

    it("hashes an empty file", async () => {
        expect(encodeDigest(await hashBlob(new Blob([])), "hex")).toBe(VECTORS[0]?.[1]);
    });

    it("stops when canceled", async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(hashBlob(new Blob(["x"]), { signal: controller.signal })).rejects.toThrow(
            "Canceled",
        );
    });
});

describe("encodeDigest and digestsMatch", () => {
    const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);

    it("encodes hex and Base64", () => {
        expect(encodeDigest(bytes, "hex")).toBe("deadbeef");
        expect(encodeDigest(bytes, "base64")).toBe("3q2+7w==");
    });

    it("compares hex in any case, Base64, and prefixed values", () => {
        expect(digestsMatch(bytes, "DEADBEEF")).toBe(true);
        expect(digestsMatch(bytes, " sha256:deadbeef ")).toBe(true);
        expect(digestsMatch(bytes, "3q2+7w==")).toBe(true);
        expect(digestsMatch(bytes, "deadbeee")).toBe(false);
        expect(digestsMatch(bytes, "  ")).toBe(null);
    });
});

// FIPS 180-2 example vectors for SHA-384 and SHA-512.
const LONG_VECTORS: Array<[Algorithm, string, string]> = [
    [
        "SHA-384",
        "abc",
        "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
    ],
    [
        "SHA-384",
        "",
        "38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b",
    ],
    [
        "SHA-512",
        "abc",
        "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    ],
    [
        "SHA-512",
        "",
        "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
    ],
];

describe("SHA-384 and SHA-512", () => {
    it.each(LONG_VECTORS)("%s hashes text %j", async (algorithm, text, hex) => {
        expect(encodeDigest(await hashText(text, algorithm), "hex")).toBe(hex);
    });

    it.each(LONG_VECTORS)("%s hashes a file %j", async (algorithm, text, hex) => {
        const blob = new Blob([new TextEncoder().encode(text)]);
        expect(encodeDigest(await hashBlob(blob, { algorithm }), "hex")).toBe(hex);
    });

    it("streams a large file with SHA-512", async () => {
        const data = new Uint8Array(2_500_000).map((_, i) => (i * 7) % 253);
        const streamed = await hashBlob(new Blob([data]), { algorithm: "SHA-512" });
        expect(streamed).toEqual(new Uint8Array(await crypto.subtle.digest("SHA-512", data)));
    });

    it("accepts sha384: and sha512: prefixes", () => {
        const bytes = new Uint8Array([0xab]);
        expect(digestsMatch(bytes, "sha512:ab")).toBe(true);
        expect(digestsMatch(bytes, "SHA-384 AB")).toBe(true);
    });
});
