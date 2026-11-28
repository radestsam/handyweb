import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { generateIds, inspectId, ulid, uuidV4, uuidV7, type ByteSource } from "./logic";

const zeros: ByteSource = (bytes) => bytes.fill(0);
const ones: ByteSource = (bytes) => bytes.fill(0xff);

function detail(fn: () => unknown): string | undefined {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error.detail;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("uuidV4", () => {
    it("sets the version and the variant", () => {
        expect(uuidV4(zeros)).toBe("00000000-0000-4000-8000-000000000000");
        expect(uuidV4(ones)).toBe("ffffffff-ffff-4fff-bfff-ffffffffffff");
    });

    it("makes different random values", () => {
        const ids = new Set(Array.from({ length: 1000 }, () => uuidV4()));
        expect(ids.size).toBe(1000);
        for (const id of ids) {
            expect(id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
            );
        }
    });
});

describe("uuidV7", () => {
    it("writes the time in the first 48 bits (RFC 9562 appendix A.6)", () => {
        // 0x017F22E279B0 ms is 2022-02-22T19:22:22.000Z.
        expect(uuidV7(0x017f22e279b0, zeros)).toBe("017f22e2-79b0-7000-8000-000000000000");
    });

    it("sorts by time", () => {
        const earlier = uuidV7(1_700_000_000_000);
        const later = uuidV7(1_700_000_000_001);
        expect(earlier < later).toBe(true);
    });
});

describe("ulid", () => {
    it("writes the time in the first 10 characters", () => {
        expect(ulid(0, zeros)).toBe("00000000000000000000000000");
        expect(ulid(1_469_918_176_385, zeros).slice(0, 10)).toBe("01ARYZ6S41");
        expect(ulid(2 ** 48 - 1, ones)).toBe("7ZZZZZZZZZZZZZZZZZZZZZZZZZ");
    });

    it("uses only Crockford Base32", () => {
        for (let i = 0; i < 200; i++)
            expect(ulid(Date.UTC(2026, 0, 1))).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });
});

describe("generateIds", () => {
    it("formats UUIDs and makes one per line", () => {
        const ids = generateIds("v4", 3, 0, { uppercase: true, hyphens: false }).split("\n");
        expect(ids).toHaveLength(3);
        for (const id of ids) expect(id).toMatch(/^[0-9A-F]{32}$/);
    });

    it("rejects a bad count", () => {
        expect(detail(() => generateIds("v4", 0, 0, { uppercase: false, hyphens: true }))).toBe(
            "count",
        );
    });
});

describe("inspectId", () => {
    it("reads a v4 UUID in any common form", () => {
        for (const form of [
            "F81D4FAE-7DEC-41D0-A765-00A0C91E6BF6",
            "{f81d4fae-7dec-41d0-a765-00a0c91e6bf6}",
            "urn:uuid:f81d4fae-7dec-41d0-a765-00a0c91e6bf6",
            "f81d4fae7dec41d0a76500a0c91e6bf6",
        ]) {
            expect(inspectId(form)).toEqual({
                kind: "uuid",
                canonical: "f81d4fae-7dec-41d0-a765-00a0c91e6bf6",
                version: 4,
                variant: "rfc",
                special: null,
                timeMs: null,
            });
        }
    });

    it("reads the time of v7, v1, and v6 UUIDs", () => {
        expect(inspectId("017f22e2-79b0-7cc3-98c4-dc0c0c07398f").timeMs).toBe(
            Date.UTC(2022, 1, 22, 19, 22, 22),
        );
        // RFC 9562 appendix A.1 and A.5: the same time as v1 and as v6.
        const time = Date.UTC(2022, 1, 22, 19, 22, 22);
        expect(inspectId("c232ab00-9414-11ec-b3c8-9f6bdeced846").timeMs).toBe(time);
        expect(inspectId("1ec9414c-232a-6b00-b3c8-9f6bdeced846").timeMs).toBe(time);
    });

    it("names the nil and max UUIDs and other variants", () => {
        expect(inspectId("00000000-0000-0000-0000-000000000000")).toMatchObject({
            special: "nil",
            version: null,
        });
        expect(inspectId("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF")).toMatchObject({ special: "max" });
        expect(inspectId("00000000-0000-4000-c000-000000000001").variant).toBe("microsoft");
    });

    it("reads a ULID and its time", () => {
        expect(inspectId("01arz3ndektsv4rrffq69g5fav")).toEqual({
            kind: "ulid",
            canonical: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
            version: null,
            variant: null,
            special: null,
            timeMs: 1_469_922_850_259,
        });
    });

    it("rejects other text and a ULID above the maximum time", () => {
        expect(detail(() => inspectId("not-an-id"))).toBe("not an id");
        expect(detail(() => inspectId("8ZZZZZZZZZZZZZZZZZZZZZZZZZ"))).toBe("ulid overflow");
        expect(detail(() => inspectId("01ARZ3NDEKTSV4RRFFQ69G5FAU"))).toBe("not an id");
    });
});
