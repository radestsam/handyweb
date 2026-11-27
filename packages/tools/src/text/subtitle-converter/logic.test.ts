import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import {
    decodeSubtitleFile,
    detectFormat,
    formatTime,
    parseSubtitles,
    shiftCues,
    writeSubtitles,
} from "./logic";

const SRT =
    "1\r\n00:00:01,000 --> 00:00:02,500\r\nسلام\r\n\r\n2\r\n00:00:03,000 --> 00:00:04,000\r\n<i>خط یک</i>\r\nخط دو\r\n";
const VTT = "WEBVTT\n\nNOTE a note\n\n00:01.000 --> 00:02.500 align:start\nسلام\n";

describe("parseSubtitles", () => {
    it("reads SRT with CRLF and several lines", () => {
        expect(parseSubtitles(SRT)).toEqual([
            { start: 1000, end: 2500, settings: "", text: "سلام" },
            { start: 3000, end: 4000, settings: "", text: "<i>خط یک</i>\nخط دو" },
        ]);
    });

    it("reads VTT with short times, settings, and a NOTE block", () => {
        expect(parseSubtitles(VTT)).toEqual([
            { start: 1000, end: 2500, settings: "align:start", text: "سلام" },
        ]);
    });

    it("rejects text without cues and bad times", () => {
        expect(() => parseSubtitles("hello")).toThrow(ToolFailure);
        expect(() => parseSubtitles("00:00:xx --> 00:00:02,000\nhi")).toThrow(ToolFailure);
    });
});

describe("writeSubtitles", () => {
    it("converts SRT to VTT and back", () => {
        const vtt = writeSubtitles(parseSubtitles(SRT), "vtt");
        expect(vtt).toBe(
            "WEBVTT\n\n00:00:01.000 --> 00:00:02.500\nسلام\n\n00:00:03.000 --> 00:00:04.000\n<i>خط یک</i>\nخط دو\n",
        );
        expect(writeSubtitles(parseSubtitles(vtt), "srt")).toBe(
            "1\n00:00:01,000 --> 00:00:02,500\nسلام\n\n2\n00:00:03,000 --> 00:00:04,000\n<i>خط یک</i>\nخط دو\n",
        );
    });

    it("formats long times", () => {
        expect(formatTime(3_723_004, "srt")).toBe("01:02:03,004");
    });
});

describe("shiftCues", () => {
    it("moves cues and stops at zero", () => {
        const cues = shiftCues(parseSubtitles(SRT), -1500);
        expect(cues.map((c) => [c.start, c.end])).toEqual([
            [0, 1000],
            [1500, 2500],
        ]);
    });
});

describe("detectFormat and decodeSubtitleFile", () => {
    it("detects VTT", () => {
        expect(detectFormat(VTT)).toBe("vtt");
        expect(detectFormat(SRT)).toBe("srt");
    });

    it("reads Windows-1256 when the bytes are not UTF-8", () => {
        const bytes = new Uint8Array([0xd3, 0xe1, 0xc7, 0xe3]);
        expect(decodeSubtitleFile(bytes)).toEqual({ text: "سلام", encoding: "windows-1256" });
        expect(decodeSubtitleFile(new TextEncoder().encode("سلام")).encoding).toBe("utf-8");
    });
});
