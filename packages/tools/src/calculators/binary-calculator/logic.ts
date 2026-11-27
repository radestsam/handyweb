import { ToolFailure } from "@handyweb/core/runtime";
import { formatNumber, parseNumber, type BaseChoice } from "../../developer/number-base/logic";

/*
 * Whole-number arithmetic and bit operations with BigInt, so numbers of any
 * size stay exact. Division rounds toward zero, as in most programming
 * languages. The bit operations work on two's complement, like BigInt.
 */

export const OPERATIONS = ["+", "-", "*", "/", "%", "AND", "OR", "XOR", "<<", ">>"] as const;
export type Operation = (typeof OPERATIONS)[number];

export function calculate(a: bigint, b: bigint, operation: Operation): bigint {
    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
        case "%":
            if (b === 0n)
                throw new ToolFailure(
                    "invalid-input",
                    { fa: "تقسیم بر صفر شدنی نیست.", en: "You cannot divide by zero." },
                    "zero",
                );
            return operation === "/" ? a / b : a % b;
        case "AND":
            return a & b;
        case "OR":
            return a | b;
        case "XOR":
            return a ^ b;
        case "<<":
        case ">>":
            if (b < 0n || b > 4096n)
                throw new ToolFailure(
                    "invalid-input",
                    {
                        fa: "جابه‌جایی باید از ۰ تا ۴۰۹۶ بیت باشد.",
                        en: "The shift must be from 0 to 4096 bits.",
                    },
                    "shift",
                );
            return operation === "<<" ? a << b : a >> b;
    }
}

export interface Answer {
    binary: string;
    hex: string;
    decimal: string;
    octal: string;
}

export function solve(left: string, right: string, operation: Operation, base: BaseChoice): Answer {
    const value = calculate(
        parseNumber(left, base).value,
        parseNumber(right, base).value,
        operation,
    );
    const plain = { uppercase: false, group: false };
    return {
        binary: formatNumber(value, 2, { uppercase: false, group: true }),
        hex: formatNumber(value, 16, { uppercase: true, group: false }),
        decimal: formatNumber(value, 10, plain),
        octal: formatNumber(value, 8, plain),
    };
}
