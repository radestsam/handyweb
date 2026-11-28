import { describe, expect, it } from "vitest";
import { makeQr } from "../qr-generator/logic";
import { decodeQrPixels } from "./decode";
import { classify, parseWifi, safeLink } from "./logic";

describe("code contents", () => {
    it("reads Wi-Fi codes with escapes", () => {
        expect(parseWifi(String.raw`WIFI:T:WPA;S:Home\;Net;P:pa\:ss;H:true;;`)).toEqual({
            ssid: "Home;Net",
            password: "pa:ss",
            security: "WPA",
            hidden: true,
        });
        expect(parseWifi("hello")).toBeNull();
    });

    it("classifies contents", () => {
        expect(classify("https://handyweb.ir")).toBe("url");
        expect(classify("WIFI:S:x;;")).toBe("wifi");
        expect(classify("tel:+989121234567")).toBe("phone");
        expect(classify("BEGIN:VCARD\nFN:Ali\nEND:VCARD")).toBe("contact");
        expect(classify("سلام")).toBe("text");
    });

    it("opens only http and https links", () => {
        expect(safeLink("https://handyweb.ir/a")).toBe("https://handyweb.ir/a");
        expect(safeLink("javascript:alert(1)")).toBeNull();
        expect(safeLink("not a link")).toBeNull();
    });
});

describe("jsQR", () => {
    it("decodes a QR code made by the QR generator, with Persian text", async () => {
        const matrix = makeQr("سلام HandyWeb", "M");
        const scale = 4;
        const size = matrix.size * scale;
        const data = new Uint8ClampedArray(size * size * 4).fill(255);
        matrix.modules.forEach((row, y) =>
            row.forEach((dark, x) => {
                if (!dark) return;
                for (let dy = 0; dy < scale; dy++)
                    for (let dx = 0; dx < scale; dx++) {
                        const i = ((y * scale + dy) * size + x * scale + dx) * 4;
                        data[i] = data[i + 1] = data[i + 2] = 0;
                    }
            }),
        );
        expect(await decodeQrPixels(data, size, size)).toEqual({
            value: "سلام HandyWeb",
            format: "qr_code",
        });
    });
});
