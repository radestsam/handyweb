import { describe, expect, it } from "vitest";
import { splitJoin, unescapeDelimiter, type SplitJoinOptions } from "./logic";

const base: SplitJoinOptions = {
    direction: "split",
    delimiter: ",",
    trim: true,
    skipEmpty: true,
    wrap: "",
};

describe("split", () => {
    it("writes one item per line", () => {
        expect(splitJoin("a, b,,c ", base)).toBe("a\nb\nc");
        expect(splitJoin("سیب، پرتقال، موز", { ...base, delimiter: "،" })).toBe("سیب\nپرتقال\nموز");
    });

    it("can keep empty items and spaces", () => {
        expect(splitJoin("a, b,,c", { ...base, trim: false, skipEmpty: false })).toBe("a\n b\n\nc");
    });

    it("reads \\t as a tab", () => {
        expect(splitJoin("a\tb", { ...base, delimiter: "\\t" })).toBe("a\nb");
    });
});

describe("join", () => {
    const join = { ...base, direction: "join" as const, delimiter: ", " };

    it("joins lines with the delimiter", () => {
        expect(splitJoin("a\nb\n\nc\n", join)).toBe("a, b, c");
    });

    it("wraps each item", () => {
        expect(splitJoin("a\nb", { ...join, delimiter: ",", wrap: "'" })).toBe("'a','b'");
    });

    it("reads \\n in the delimiter", () => {
        expect(splitJoin("a\nb", { ...join, delimiter: "\\n\\n" })).toBe("a\n\nb");
    });
});

describe("unescapeDelimiter", () => {
    it("reads escapes", () => {
        expect(unescapeDelimiter("\\n|\\t|\\\\")).toBe("\n|\t|\\");
    });
});
