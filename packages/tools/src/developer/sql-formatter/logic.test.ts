import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { formatSql, type SqlOptions } from "./logic";

const base: SqlOptions = { dialect: "sql", keywordCase: "upper", indent: 2 };

describe("formatSql", () => {
    it("formats a query and upper-cases keywords", () => {
        expect(formatSql("select a, b from t where x = 1 and y = 'سلام'", base)).toBe(
            "SELECT\n  a,\n  b\nFROM\n  t\nWHERE\n  x = 1\n  AND y = 'سلام'",
        );
    });

    it("uses the indent and the keyword case", () => {
        expect(formatSql("SELECT a FROM t", { ...base, indent: 4, keywordCase: "lower" })).toBe(
            "select\n    a\nfrom\n    t",
        );
    });

    it("separates several queries", () => {
        expect(formatSql("select 1; select 2;", base)).toBe("SELECT\n  1;\n\nSELECT\n  2;");
    });

    it("reads dialect syntax", () => {
        expect(formatSql("select `a` from t limit 5", { ...base, dialect: "mysql" })).toContain(
            "`a`",
        );
        expect(formatSql("select a::int from t", { ...base, dialect: "postgresql" })).toContain(
            "a::int",
        );
    });

    it("reports a parse error with its position", () => {
        try {
            formatSql("select (a from t", base);
            throw new Error("expected a ToolFailure");
        } catch (error) {
            expect(error).toBeInstanceOf(ToolFailure);
            expect((error as ToolFailure).localized.en).toMatch(/line 1, column \d+/);
        }
    });

    it("rejects empty input", () => {
        expect(() => formatSql("  ", base)).toThrow(ToolFailure);
    });
});
