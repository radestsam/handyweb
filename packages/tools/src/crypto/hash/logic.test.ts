import { describe, expect, it, vi } from "vitest";
import { digestsMatch, encodeDigest, hashBlob, hashText } from "./logic";

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
