/**
 * A strict JSON scanner (RFC 8259). It does not build values. It finds the
 * first syntax error with its line and column, which JSON.parse does not
 * report the same way in every browser, and it collects warnings that
 * JSON.parse hides: duplicate keys and numbers that lose precision.
 */

export type ScanError = {
    offset: number;
    line: number;
    column: number;
    reason:
        | "unexpected-end"
        | "unexpected-character"
        | "trailing-comma"
        | "bad-escape"
        | "control-character"
        | "bad-number"
        | "extra-content";
    found: string;
};

export type ScanWarning =
    | { kind: "duplicate-key"; key: string; line: number; column: number }
    | { kind: "precision"; number: string; line: number; column: number };

export type ScanResult = { ok: true; warnings: ScanWarning[] } | { ok: false; error: ScanError };

class Fail extends Error {
    constructor(
        readonly offset: number,
        readonly reason: ScanError["reason"],
    ) {
        super(reason);
    }
}

const MAX_DEPTH = 1000;

export function scanJson(text: string): ScanResult {
    let i = 0;
    const warnings: ScanWarning[] = [];

    const skipSpace = () => {
        while (i < text.length) {
            const c = text.charCodeAt(i);
            if (c === 0x20 || c === 0x0a || c === 0x0d || c === 0x09) i++;
            else break;
        }
    };

    const expectChar = (char: string) => {
        if (i >= text.length) throw new Fail(i, "unexpected-end");
        if (text[i] !== char) throw new Fail(i, "unexpected-character");
        i++;
    };

    const string = (): string => {
        expectChar('"');
        let value = "";
        for (;;) {
            if (i >= text.length) throw new Fail(i, "unexpected-end");
            const c = text.charCodeAt(i);
            if (c === 0x22) {
                i++;
                return value;
            }
            if (c < 0x20) throw new Fail(i, "control-character");
            if (c === 0x5c) {
                const next = text[i + 1];
                if (next === undefined) throw new Fail(i + 1, "unexpected-end");
                if ('"\\/bfnrt'.includes(next)) {
                    value += next;
                    i += 2;
                } else if (next === "u") {
                    const hex = text.slice(i + 2, i + 6);
                    if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Fail(i, "bad-escape");
                    value += String.fromCharCode(parseInt(hex, 16));
                    i += 6;
                } else {
                    throw new Fail(i, "bad-escape");
                }
                continue;
            }
            value += text[i];
            i++;
        }
    };

    const number = () => {
        const start = i;
        const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(text.slice(i, i + 400));
        if (!match || match[0] === "-" || match[0] === "") throw new Fail(i, "bad-number");
        i += match[0].length;
        const next = text[i];
        if (next !== undefined && /[0-9.eE+-]/.test(next)) throw new Fail(i, "bad-number");
        const literal = match[0];
        if (!Object.is(Number(literal), -0) && loosesPrecision(literal)) {
            const { line, column } = position(text, start);
            warnings.push({ kind: "precision", number: literal, line, column });
        }
    };

    const literal = (word: string) => {
        for (let k = 0; k < word.length; k++) {
            if (i >= text.length) throw new Fail(i, "unexpected-end");
            if (text[i] !== word[k]) throw new Fail(i, "unexpected-character");
            i++;
        }
    };

    const value = (depth: number): void => {
        if (depth > MAX_DEPTH) throw new Fail(i, "unexpected-character");
        skipSpace();
        if (i >= text.length) throw new Fail(i, "unexpected-end");
        const c = text[i];
        if (c === "{") return object(depth);
        if (c === "[") return array(depth);
        if (c === '"') {
            string();
            return;
        }
        if (c === "t") return literal("true");
        if (c === "f") return literal("false");
        if (c === "n") return literal("null");
        if (c === "-" || (c !== undefined && c >= "0" && c <= "9")) return number();
        throw new Fail(i, "unexpected-character");
    };

    const object = (depth: number) => {
        i++;
        const keys = new Set<string>();
        skipSpace();
        if (text[i] === "}") {
            i++;
            return;
        }
        for (;;) {
            skipSpace();
            if (text[i] === "}") throw new Fail(i, "trailing-comma");
            const keyStart = i;
            const key = string();
            if (keys.has(key)) {
                const { line, column } = position(text, keyStart);
                warnings.push({ kind: "duplicate-key", key, line, column });
            }
            keys.add(key);
            skipSpace();
            expectChar(":");
            value(depth + 1);
            skipSpace();
            if (text[i] === ",") {
                i++;
                continue;
            }
            expectChar("}");
            return;
        }
    };

    const array = (depth: number) => {
        i++;
        skipSpace();
        if (text[i] === "]") {
            i++;
            return;
        }
        for (;;) {
            skipSpace();
            if (text[i] === "]") throw new Fail(i, "trailing-comma");
            value(depth + 1);
            skipSpace();
            if (text[i] === ",") {
                i++;
                continue;
            }
            expectChar("]");
            return;
        }
    };

    try {
        // A byte order mark at the start is allowed and ignored.
        if (text.charCodeAt(0) === 0xfeff) i = 1;
        value(0);
        skipSpace();
        if (i < text.length) throw new Fail(i, "extra-content");
        return { ok: true, warnings };
    } catch (error) {
        if (!(error instanceof Fail)) throw error;
        const { line, column } = position(text, error.offset);
        const found =
            error.offset < text.length
                ? String.fromCodePoint(text.codePointAt(error.offset) ?? 0)
                : "";
        return {
            ok: false,
            error: { offset: error.offset, line, column, reason: error.reason, found },
        };
    }
}

/** Line and column, both counted from 1. */
export function position(text: string, offset: number): { line: number; column: number } {
    let line = 1;
    let lineStart = 0;
    for (let k = 0; k < offset && k < text.length; k++) {
        if (text.charCodeAt(k) === 0x0a) {
            line++;
            lineStart = k + 1;
        }
    }
    return { line, column: offset - lineStart + 1 };
}

/** True when JavaScript cannot keep every digit of the number. */
function loosesPrecision(literal: string): boolean {
    const isInteger = /^-?\d+$/.test(literal);
    if (isInteger) {
        const digits = literal.replace(/^-/, "");
        return digits.length > 15 && !Number.isSafeInteger(Number(literal));
    }
    const value = Number(literal);
    if (!Number.isFinite(value)) return true;
    const significant = literal
        .replace(/^-/, "")
        .replace(/[eE].*$/, "")
        .replace(".", "")
        .replace(/^0+/, "")
        .replace(/0+$/, "");
    return significant.length > 17;
}
