import { describe, expect, it } from "vitest";
import type { ToolFailure } from "@handyweb/core/runtime";
import { base64ToBytes } from "../../encoding/base64/logic";
import { decryptText, encryptText, VERSION } from "./logic";

// Fewer iterations keep the tests fast. The format does not depend on them.
const FAST = 1000;

async function failure(promise: Promise<unknown>): Promise<ToolFailure> {
    try {
        await promise;
    } catch (error) {
        return error as ToolFailure;
    }
    throw new Error("expected a failure");
}

describe("aes-gcm", () => {
    it("round-trips Persian text", async () => {
        const sealed = await encryptText("سلام دنیا 😀", "رمز من", undefined, FAST);
        expect(await decryptText(sealed, "رمز من", FAST)).toBe("سلام دنیا 😀");
    });

    it("writes the documented format", async () => {
        const fixed = (length: number) => new Uint8Array(length).fill(7);
        const bytes = base64ToBytes(await encryptText("abc", "p", fixed, FAST));
        expect(bytes[0]).toBe(VERSION);
        expect(bytes.slice(1, 17)).toEqual(new Uint8Array(16).fill(7));
        expect(bytes.slice(17, 29)).toEqual(new Uint8Array(12).fill(7));
        expect(bytes.length).toBe(29 + 3 + 16);
    });

    it("uses a new salt and IV each time", async () => {
        expect(await encryptText("x", "p", undefined, FAST)).not.toBe(
            await encryptText("x", "p", undefined, FAST),
        );
    });

    it("rejects a wrong passphrase and changed data", async () => {
        const sealed = await encryptText("secret", "right", undefined, FAST);
        expect((await failure(decryptText(sealed, "wrong", FAST))).detail).toBe("auth");
        const bytes = base64ToBytes(sealed);
        bytes[bytes.length - 1] = (bytes[bytes.length - 1] as number) ^ 1;
        const changed = btoa(String.fromCharCode(...bytes));
        expect((await failure(decryptText(changed, "right", FAST))).detail).toBe("auth");
    });

    it("rejects other data and an empty passphrase", async () => {
        expect((await failure(decryptText("aGVsbG8=", "p", FAST))).detail).toBe("format");
        expect((await failure(encryptText("x", ""))).detail).toBe("empty passphrase");
    });
});
