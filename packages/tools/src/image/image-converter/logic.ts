import { EXTENSIONS, type OutputType } from "@handyweb/core/image";
import { safeFileName } from "@handyweb/core/files";

export const TARGETS: readonly OutputType[] = ["image/png", "image/jpeg", "image/webp"];

/** Reads the target type from a preset option such as "image/png" or "png". */
export function parseTarget(value: unknown): OutputType | null {
    if (typeof value !== "string") return null;
    const type = value.startsWith("image/") ? value : `image/${value === "jpg" ? "jpeg" : value}`;
    return (TARGETS as readonly string[]).includes(type) ? (type as OutputType) : null;
}

export function convertedName(source: string, type: OutputType): string {
    return safeFileName(`${source.replace(/\.[^.]+$/, "") || "image"}.${EXTENSIONS[type]}`);
}

/** Whether the browser wrote the asked type. A browser without a WebP encoder writes PNG. */
export function wroteType(blob: Blob, type: OutputType): boolean {
    return blob.type === type;
}
