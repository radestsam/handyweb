import { describe, expect, it } from "vitest";
import { convertedName, parseTarget, wroteType } from "./logic";

describe("image converter", () => {
    it("reads targets", () => {
        expect(parseTarget("png")).toBe("image/png");
        expect(parseTarget("jpg")).toBe("image/jpeg");
        expect(parseTarget("image/webp")).toBe("image/webp");
        expect(parseTarget("gif")).toBeNull();
        expect(parseTarget(undefined)).toBeNull();
    });

    it("names the output and checks the written type", () => {
        expect(convertedName("photo.JPG", "image/png")).toBe("photo.png");
        expect(convertedName("a.b.webp", "image/jpeg")).toBe("a.b.jpg");
        expect(wroteType(new Blob([], { type: "image/png" }), "image/webp")).toBe(false);
    });
});
