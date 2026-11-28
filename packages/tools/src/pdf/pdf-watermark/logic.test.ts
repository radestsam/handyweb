import { PDFDocument } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { addWatermark, placeStamps, watermarkedName, type Stamp } from "./logic";

/** A PNG of 4 x 2 pixels. */
const PNG = Uint8Array.from(
    atob(
        "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAAH0lEQVR4nA3IsQEAAAiDMGof93NlyBJgLxpVEEOj6gG+gAwJKx3JVgAAAABJRU5ErkJggg==",
    ),
    (char) => char.charCodeAt(0),
);

/** The center of a stamp after pdf-lib turns it around its lower-left corner. */
function center(stamp: Stamp): [number, number] {
    const rad = (stamp.rotate * Math.PI) / 180;
    return [
        stamp.x + (stamp.width / 2) * Math.cos(rad) - (stamp.height / 2) * Math.sin(rad),
        stamp.y + (stamp.width / 2) * Math.sin(rad) + (stamp.height / 2) * Math.cos(rad),
    ];
}

describe("pdf watermark", () => {
    it("centers one stamp, turned or straight", () => {
        for (const angle of [0, 45]) {
            const [stamp] = placeStamps(600, 800, 0, 400, 100, {
                layout: "center",
                size: "medium",
                angle,
            });
            const [cx, cy] = center(stamp as Stamp);
            expect(cx).toBeCloseTo(300);
            expect(cy).toBeCloseTo(400);
            expect(stamp?.rotate).toBe(angle);
        }
        const [straight] = placeStamps(600, 800, 0, 400, 100, {
            layout: "center",
            size: "medium",
            angle: 0,
        });
        expect(straight?.width).toBeCloseTo(0.65 * 600);
        const [turned] = placeStamps(600, 800, 0, 400, 100, {
            layout: "center",
            size: "medium",
            angle: 45,
        });
        expect(turned?.width).toBeCloseTo(0.65 * 1000);
    });

    it("keeps a short text from getting taller than the page", () => {
        const [stamp] = placeStamps(600, 200, 0, 100, 100, {
            layout: "center",
            size: "large",
            angle: 0,
        });
        expect(stamp?.height).toBeCloseTo(160);
    });

    it("turns with a rotated page", () => {
        const [stamp] = placeStamps(600, 800, 90, 400, 100, {
            layout: "center",
            size: "medium",
            angle: 45,
        });
        expect(stamp?.rotate).toBe(135);
        const [cx, cy] = center(stamp as Stamp);
        expect(cx).toBeCloseTo(300);
        expect(cy).toBeCloseTo(400);
    });

    it("tiles the page", () => {
        const stamps = placeStamps(600, 800, 0, 400, 100, {
            layout: "tiled",
            size: "medium",
            angle: 45,
        });
        expect(stamps.length).toBeGreaterThan(6);
        for (const stamp of stamps) expect(stamp.width).toBeCloseTo(0.28 * 600);
    });

    it("draws the image on every page", async () => {
        const source = await PDFDocument.create();
        source.addPage([600, 800]);
        source.addPage([800, 600]);
        const done: number[] = [];
        const output = await addWatermark(
            await source.save(),
            PNG,
            { layout: "center", size: "medium", angle: 45, opacity: 0.3 },
            (count) => done.push(count),
        );
        expect(done).toEqual([1, 2]);
        const document = await PDFDocument.load(output);
        expect(document.getPageCount()).toBe(2);
        const raw = new TextDecoder("latin1").decode(output);
        // One image object, used on both pages, with a transparency state.
        expect(raw.match(/\/Subtype\s*\/Image/g)?.length).toBe(1);
        expect(raw).toContain("/ca 0.3");
    });

    it("names the output", () => {
        expect(watermarkedName("Deal.pdf")).toBe("Deal-watermarked.pdf");
    });
});
