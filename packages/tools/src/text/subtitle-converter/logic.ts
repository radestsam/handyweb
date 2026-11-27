import { ToolFailure } from "@handyweb/core/runtime";

/*
 * SRT and WebVTT subtitles. Cues are read into one model, shifted if asked,
 * and written in the target format. Cue text keeps its lines; VTT cue
 * settings and SRT formatting tags pass through unchanged.
 */

export type SubtitleFormat = "srt" | "vtt";

export interface Cue {
    start: number;
    end: number;
    /** The cue settings of a VTT cue, such as "align:start". */
    settings: string;
    text: string;
}

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

/** Reads 00:01:02,345 / 00:01:02.345 / 01:02.345 into milliseconds. */
function time(text: string): number {
    const m = /^(?:(\d+):)?(\d{1,2}):(\d{1,2})[,.](\d{1,3})$/.exec(text.trim());
    if (!m)
        throw fail(`زمان «${text}» درست نیست.`, `The time "${text}" is not valid.`, `time ${text}`);
    const [, h = "0", min = "0", s = "0", ms = "0"] = m;
    return ((Number(h) * 60 + Number(min)) * 60 + Number(s)) * 1000 + Number(ms.padEnd(3, "0"));
}

export function formatTime(ms: number, format: SubtitleFormat): string {
    const value = Math.max(0, Math.round(ms));
    const h = Math.floor(value / 3_600_000);
    const m = Math.floor(value / 60_000) % 60;
    const s = Math.floor(value / 1000) % 60;
    const rest = value % 1000;
    const pad = (n: number, w = 2) => String(n).padStart(w, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}${format === "srt" ? "," : "."}${pad(rest, 3)}`;
}

export function detectFormat(text: string): SubtitleFormat {
    return /^\uFEFF?WEBVTT/.test(text) ? "vtt" : "srt";
}

/** Reads SRT or VTT. NOTE, STYLE, and REGION blocks of VTT are skipped. */
export function parseSubtitles(input: string): Cue[] {
    const text = input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    const blocks = text.split(/\n{2,}/);
    const cues: Cue[] = [];
    for (const block of blocks) {
        const lines = block.split("\n").filter((line, index) => index > 0 || line.trim() !== "");
        const arrow = lines.findIndex((line) => line.includes("-->"));
        if (arrow === -1) continue;
        const [startText = "", rest = ""] = (lines[arrow] as string).split("-->");
        const [endText = "", ...settings] = rest.trim().split(/\s+/);
        cues.push({
            start: time(startText),
            end: time(endText),
            settings: settings.join(" "),
            text: lines
                .slice(arrow + 1)
                .join("\n")
                .replace(/\s+$/, ""),
        });
    }
    if (cues.length === 0) {
        throw fail(
            "زیرنویسی یافت نشد. هر زیرنویس یک خط زمان مانند 00:00:01,000 --> 00:00:02,000 دارد.",
            "No subtitles found. Each subtitle has a time line such as 00:00:01,000 --> 00:00:02,000.",
            "no cues",
        );
    }
    return cues;
}

/** Moves every cue by `ms` milliseconds (negative is earlier). A time below zero becomes zero. */
export function shiftCues(cues: Cue[], ms: number): Cue[] {
    return cues.map((cue) => ({
        ...cue,
        start: Math.max(0, cue.start + ms),
        end: Math.max(0, cue.end + ms),
    }));
}

export function writeSubtitles(cues: Cue[], format: SubtitleFormat): string {
    const body = cues
        .map((cue, index) => {
            const times = `${formatTime(cue.start, format)} --> ${formatTime(cue.end, format)}`;
            if (format === "srt") return `${index + 1}\n${times}\n${cue.text}`;
            return `${times}${cue.settings ? ` ${cue.settings}` : ""}\n${cue.text}`;
        })
        .join("\n\n");
    return format === "vtt" ? `WEBVTT\n\n${body}\n` : `${body}\n`;
}

/**
 * Reads the bytes of a subtitle file as text. UTF-8 is tried first. Many
 * Persian subtitles are saved as Windows-1256 (Arabic Windows), which is read
 * when the bytes are not valid UTF-8.
 */
export function decodeSubtitleFile(bytes: Uint8Array): {
    text: string;
    encoding: "utf-8" | "windows-1256";
} {
    try {
        return { text: new TextDecoder("utf-8", { fatal: true }).decode(bytes), encoding: "utf-8" };
    } catch {
        return { text: new TextDecoder("windows-1256").decode(bytes), encoding: "windows-1256" };
    }
}
