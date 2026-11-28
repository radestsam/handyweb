import { describe, expect, it } from "vitest";
import { convert, findKind, formatAmount, parseAmount, plainAmount } from "./logic";

const unit = (kindId: string, id: string) => findKind(kindId).units.find((u) => u.id === id)!;
const go = (kind: string, value: number, from: string, to: string) =>
    convert(value, findKind(kind), unit(kind, from), unit(kind, to));

describe("unit converter", () => {
    it("converts exact values", () => {
        expect(go("length", 1, "in", "cm")).toBeCloseTo(2.54, 12);
        expect(go("length", 1, "mi", "km")).toBeCloseTo(1.609344, 12);
        expect(go("mass", 1, "lb", "kg")).toBeCloseTo(0.45359237, 12);
        expect(go("data", 1, "gib", "mb")).toBeCloseTo(1073.741824, 9);
        expect(go("speed", 100, "kmh", "ms")).toBeCloseTo(27.7778, 4);
        expect(go("energy", 1, "kwh", "kj")).toBe(3600);
    });

    it("converts temperature with offsets", () => {
        expect(go("temperature", 100, "c", "f")).toBeCloseTo(212, 10);
        expect(go("temperature", -40, "f", "c")).toBeCloseTo(-40, 10);
        expect(go("temperature", 0, "k", "c")).toBeCloseTo(-273.15, 10);
    });

    it("converts Iranian units", () => {
        expect(go("mass", 1, "mesghal", "g")).toBeCloseTo(4.608, 10);
        expect(go("mass", 1, "kg", "sir")).toBeCloseTo(13.3333, 4);
        expect(go("area", 1, "jerib", "m2")).toBe(10000);
    });

    it("reads Persian digits and decimal marks", () => {
        expect(parseAmount("۱۲٫۵")).toBe(12.5);
        expect(parseAmount("1,234.5")).toBe(1234.5);
        expect(parseAmount("٣/٢")).toBe(3.2);
        expect(() => parseAmount("abc")).toThrow(/number/);
        expect(() => parseAmount("")).toThrow();
    });

    it("formats numbers", () => {
        expect(formatAmount(1234.5, "en")).toBe("1,234.5");
        expect(formatAmount(2.54, "fa")).toBe("۲٫۵۴");
        expect(plainAmount(0.1 + 0.2)).toBe("0.3");
        expect(plainAmount(1e20)).toBe("1e+20");
    });
});
