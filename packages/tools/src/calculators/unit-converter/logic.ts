import { ToolFailure } from "@handyweb/core/runtime";
import { KINDS, type Kind, type Unit } from "./units";

export function findKind(id: unknown): Kind {
    return KINDS.find((kind) => kind.id === id) ?? (KINDS[0] as Kind);
}

function toKelvin(value: number, unit: string): number {
    if (unit === "c") return value + 273.15;
    if (unit === "f") return ((value - 32) * 5) / 9 + 273.15;
    return value;
}

function fromKelvin(value: number, unit: string): number {
    if (unit === "c") return value - 273.15;
    if (unit === "f") return ((value - 273.15) * 9) / 5 + 32;
    return value;
}

/** Converts a value from one unit to another of the same kind. */
export function convert(value: number, kind: Kind, from: Unit, to: Unit): number {
    if (kind.id === "temperature") return fromKelvin(toKelvin(value, from.id), to.id);
    return (value * from.factor) / to.factor;
}

/** Reads a number with Latin, Persian, or Arabic digits and a . or / or ٫ decimal mark. */
export function parseAmount(text: string): number {
    const latin = text
        .trim()
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[٫/]/g, ".")
        .replace(/[,٬\s_]/g, "");
    const value = Number(latin);
    if (latin === "" || !Number.isFinite(value)) {
        throw new ToolFailure(
            "invalid-input",
            { fa: "یک عدد بنویسید.", en: "Enter a number." },
            "number",
        );
    }
    return value;
}

/** A readable number: up to 10 significant digits, with no trailing zeros. */
export function formatAmount(value: number, locale: "fa" | "en"): string {
    if (value !== 0 && (Math.abs(value) >= 1e15 || Math.abs(value) < 1e-9))
        return value.toExponential(6).replace(/\.?0+e/, "e");
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", {
        maximumSignificantDigits: 10,
    }).format(value);
}

/** The same value as plain Latin text for copying, without group marks. */
export function plainAmount(value: number): string {
    if (value !== 0 && (Math.abs(value) >= 1e15 || Math.abs(value) < 1e-9))
        return value.toExponential(6).replace(/\.?0+e/, "e");
    return String(Number(value.toPrecision(10)));
}
