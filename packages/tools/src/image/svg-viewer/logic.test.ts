// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { inspectSvg, pngSize } from "./logic";

const SAFE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12"><rect width="24" height="12" fill="#bc4a3c"/></svg>';

describe("inspectSvg", () => {
    it("reads the size and finds no risk in a plain SVG", () => {
        const info = inspectSvg(SAFE);
        expect(info).toMatchObject({
            width: "24",
            height: "12",
            viewBox: "0 0 24 12",
            elements: 2,
            risks: [],
        });
        expect(info.clean).toContain("<rect");
    });

    it("finds and removes scripts, handlers, javascript links, foreignObject, and remote files", () => {
        const bad =
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onload="alert(1)">' +
            "<script>alert(2)</script>" +
            '<a xlink:href="javascript:alert(3)"><text>x</text></a>' +
            '<image href="https://example.com/track.png" width="1" height="1"/>' +
            "<foreignObject><div>hi</div></foreignObject>" +
            '<use href="#ok"/></svg>';
        const info = inspectSvg(bad);
        expect(info.risks.sort()).toEqual([
            "event-handler",
            "external-reference",
            "foreign-object",
            "javascript-url",
            "script",
        ]);
        expect(info.clean).not.toMatch(/script|onload|javascript:|example\.com|foreignObject/i);
        expect(info.clean).toContain('href="#ok"');
    });

    it("refuses other text", () => {
        expect(() => inspectSvg("<html></html>")).toThrow(/not valid SVG/);
        expect(() => inspectSvg("<svg")).toThrow();
        expect(() => inspectSvg(" ")).toThrow(/empty/);
    });
});

describe("pngSize", () => {
    it("uses width and height, then the viewBox", () => {
        expect(pngSize({ width: "24", height: "12", viewBox: null }, 512)).toEqual({
            width: 512,
            height: 256,
        });
        expect(pngSize({ width: null, height: null, viewBox: "0 0 10 20" }, 100)).toEqual({
            width: 50,
            height: 100,
        });
        expect(pngSize({ width: "100%", height: null, viewBox: null }, 64)).toEqual({
            width: 64,
            height: 64,
        });
    });
});
