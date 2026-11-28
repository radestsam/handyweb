import { describe, expect, it } from "vitest";
import { fixDirection } from "./logic";

const LRM = "‎";
const RLM = "‏";
const LRI = "⁦";
const PDI = "⁩";

describe("fixDirection", () => {
    it("adds an LRM after a Latin part that ends with a symbol", () => {
        expect(fixDirection("من C++ بلدم", "lrm")).toEqual({ text: `من C++${LRM} بلدم`, count: 1 });
        expect(fixDirection("نسخه Windows 11! آمد", "lrm").text).toBe(`نسخه Windows 11!${LRM} آمد`);
    });

    it("isolates the Latin part", () => {
        expect(fixDirection("زبان C# را", "isolate").text).toBe(`زبان ${LRI}C#${PDI} را`);
    });

    it("leaves plain Latin words and English-only lines alone", () => {
        expect(fixDirection("من Python و JavaScript بلدم", "lrm").count).toBe(0);
        expect(fixDirection("I know C++.", "lrm")).toEqual({ text: "I know C++.", count: 0 });
    });

    it("works line by line", () => {
        expect(fixDirection("C++ است\nC++ only", "lrm").text).toBe(`C++${LRM} است\nC++ only`);
    });

    it("removes every direction mark", () => {
        expect(fixDirection(`${RLM}سلام${LRM} ${LRI}x${PDI}`, "remove")).toEqual({
            text: "سلام x",
            count: 4,
        });
    });

    it("does not add a second mark", () => {
        const once = fixDirection("من C++ بلدم", "lrm").text;
        expect(fixDirection(once, "lrm").text).toBe(once);
    });
});
