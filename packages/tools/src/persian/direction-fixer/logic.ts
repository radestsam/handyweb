/*
 * Direction marks for mixed Persian and English text. In a right-to-left
 * paragraph, a Latin part that ends with a symbol, such as "C++" or "Windows
 * 11!", can show its symbols on the wrong side. A direction mark or an
 * isolate after or around the Latin part fixes the display. The text itself
 * does not change.
 */

const LRM = "‎";
const LRI = "⁦";
const PDI = "⁩";
/** LRM, RLM, ALM, and the embedding, override, and isolate controls. */
const BIDI = /[؜‎‏‪-‮⁦-⁩]/g;

export type DirectionMode = "lrm" | "isolate" | "remove";
export const DIRECTION_MODES: readonly DirectionMode[] = ["lrm", "isolate", "remove"];

/**
 * A Latin part inside Persian text: it starts with a Latin letter or digit
 * and holds Latin letters, digits, spaces, and common symbols, but no Persian
 * letter. A trailing space is not part of it.
 */
const LATIN_RUN =
    /[A-Za-z0-9][A-Za-z0-9 \t._\-+#@/\\:;,'"!?%&*=()[\]{}<>$^~|]*[A-Za-z0-9._\-+#@/\\:;,'"!?%&*=()[\]{}<>$^~|]|[A-Za-z0-9]/g;

export interface DirectionResult {
    text: string;
    /** Marks added or removed. */
    count: number;
}

export function fixDirection(text: string, mode: DirectionMode): DirectionResult {
    const clean = text.replace(BIDI, "");
    const removed = text.length - clean.length;
    if (mode === "remove") return { text: clean, count: removed };
    let count = 0;
    const out = clean
        .split(/(\r\n|\r|\n)/)
        .map((line, index) => {
            if (index % 2 === 1) return line;
            // Only lines with Persian text need marks.
            if (!/[؀-ۿ]/.test(line)) return line;
            return line.replace(LATIN_RUN, (run) => {
                // A run of only letters and digits shows correctly without a mark.
                if (/^[A-Za-z0-9 ]+$/.test(run) && /[A-Za-z0-9]$/.test(run)) return run;
                count++;
                return mode === "isolate" ? `${LRI}${run}${PDI}` : `${run}${LRM}`;
            });
        })
        .join("");
    return { text: out, count };
}
