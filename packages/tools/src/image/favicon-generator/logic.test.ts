import { describe, expect, it } from "vitest";
import { fitBox, HTML_SNIPPET, makeIco, manifest } from "./logic";

describe("favicon files", () => {
    it("writes an ICO directory that points at each PNG", () => {
        const ico = makeIco([
            { size: 16, png: Uint8Array.from([1, 2]) },
            { size: 256, png: Uint8Array.from([3, 4, 5]) },
        ]);
        const view = new DataView(ico.buffer);
        expect([view.getUint16(0, true), view.getUint16(2, true), view.getUint16(4, true)]).toEqual(
            [0, 1, 2],
        );
        expect([ico[6], ico[7]]).toEqual([16, 16]);
        expect([ico[22], ico[23]]).toEqual([0, 0]);
        expect(view.getUint32(6 + 12, true)).toBe(38);
        expect(view.getUint32(22 + 8, true)).toBe(3);
        expect([...ico.slice(40, 43)]).toEqual([3, 4, 5]);
    });

    it("writes the manifest and the HTML", () => {
        expect(
            JSON.parse(
                manifest({ name: "My Site", themeColor: "#123456", backgroundColor: "#ffffff" }),
            ),
        ).toMatchObject({ name: "My Site", theme_color: "#123456" });
        expect(HTML_SNIPPET).toContain('rel="apple-touch-icon"');
    });

    it("fits a picture with padding", () => {
        expect(fitBox(100, 200, 100, 10)).toEqual({ x: 10, y: 30, width: 80, height: 40 });
        expect(fitBox(32, 10, 10, 0)).toEqual({ x: 0, y: 0, width: 32, height: 32 });
    });
});
