import { describe, expect, it } from "vitest";
import { DEFAULT_OPTIONS, fixZwnj, type ZwnjOptions } from "./logic";

const Z = "‌";
const only = (rule: keyof ZwnjOptions): ZwnjOptions => ({
    prefix: false,
    plural: false,
    comparative: false,
    heSuffix: false,
    [rule]: true,
});

describe("fixZwnj", () => {
    it("joins the می and نمی prefixes", () => {
        expect(fixZwnj("من می روم و نمی دانم", only("prefix"))).toEqual({
            text: `من می${Z}روم و نمی${Z}دانم`,
            counts: { prefix: 2 },
        });
    });

    it("does not change words that only start with می", () => {
        expect(fixZwnj("میز میوه میدان", DEFAULT_OPTIONS)).toEqual({
            text: "میز میوه میدان",
            counts: {},
        });
    });

    it("joins plural suffixes", () => {
        expect(fixZwnj("کتاب ها و کتاب های من و دست هایم", only("plural")).text).toBe(
            `کتاب${Z}ها و کتاب${Z}های من و دست${Z}هایم`,
        );
    });

    it("does not join words that only contain ها", () => {
        expect(fixZwnj("تنها رها کرد", DEFAULT_OPTIONS).text).toBe("تنها رها کرد");
        expect(fixZwnj("کتاب هاشمی", only("plural")).text).toBe("کتاب هاشمی");
    });

    it("joins تر and ترین", () => {
        expect(fixZwnj("بزرگ تر و بزرگ ترین", only("comparative")).text).toBe(
            `بزرگ${Z}تر و بزرگ${Z}ترین`,
        );
        expect(fixZwnj("بزرگ ترانه", only("comparative")).text).toBe("بزرگ ترانه");
    });

    it("joins suffixes after a final ه", () => {
        expect(fixZwnj("خانه ای و نامه ام و رفته اند", only("heSuffix")).text).toBe(
            `خانه${Z}ای و نامه${Z}ام و رفته${Z}اند`,
        );
        expect(fixZwnj("کتاب ای", only("heSuffix")).text).toBe("کتاب ای");
    });

    it("keeps a correct ZWNJ and Latin text", () => {
        const text = `می${Z}روم to the کتاب${Z}خانه`;
        expect(fixZwnj(text)).toEqual({ text, counts: {} });
    });

    it("fixes a whole sentence", () => {
        expect(fixZwnj("بچه ها به خانه ای بزرگ تر می روند").text).toBe(
            `بچه${Z}ها به خانه${Z}ای بزرگ${Z}تر می${Z}روند`,
        );
    });
});
