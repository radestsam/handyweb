import { describe, expect, it } from "vitest";
import { displaySize, readImageHeader } from "./size";

// 5 x 3 test images: a PNG made in code, converted with sips and cwebp. The
// JPEG with orientation 6 has an EXIF segment added by hand.
const FIXTURES = {
    png: "iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAYAAABbNsX4AAAAEklEQVR4nGM4YWT0Hx0zEC0IAPv0IIYUdOInAAAAAElFTkSuQmCC",
    jpeg: "/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABaADAAQAAAABAAAAAwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAwAFAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8A+e6KKK/Gz/Sw/9k=",
    bmp: "Qk3GAAAAAAAAAIoAAAB8AAAABQAAAP3///8BACAAAwAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAD/AAD/AAAAAAAA/0JHUnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjLI/zIyyP8yMsj/MjLI/zIyyP8yMsj/MjLI/zIyyP8yMsj/MjLI/zIyyP8yMsj/MjLI/zIyyP8yMsj/",
    gif: "R0lGODdhBQADAJEAAAAAAMgyMv///wAAACH5BAkAAAMALAAAAAAFAAMAAAIDjI9ZADs=",
    webpLossy:
        "UklGRjgAAABXRUJQVlA4ICwAAACQAQCdASoFAAMAAgA0JaACdLoAA5gA/u3O39ahGHM5v/rgP/nAf/OA/lYAAA==",
    webpLossless: "UklGRh4AAABXRUJQVlA4TBEAAAAvBIAAAAdQmSJXpv+BiOh/AAA=",
    jpegRotated:
        "/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAABaADAAQAAAABAAAAAwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAwAFAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwUDAwMFBgUFBQUGCAYGBgYGCAoICAgICAgKCgoKCgoKCgwMDAwMDA4ODg4ODw8PDw8PDw8PD//bAEMBAgICBAQEBwQEBxALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/dAAQAAf/aAAwDAQACEQMRAD8A+e6KKK/Gz/Sw/9k=",
};

const bytes = (base64: string) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

describe("readImageHeader", () => {
    it.each([
        ["png", "png"],
        ["jpeg", "jpeg"],
        ["bmp", "bmp"],
        ["gif", "gif"],
        ["webpLossy", "webp"],
        ["webpLossless", "webp"],
    ] as const)("reads the size of %s", (name, format) => {
        expect(readImageHeader(bytes(FIXTURES[name]))).toEqual({
            format,
            width: 5,
            height: 3,
            orientation: 1,
        });
    });

    it("reads the EXIF orientation of a JPEG and turns the shown size", () => {
        const header = readImageHeader(bytes(FIXTURES.jpegRotated));
        expect(header).toEqual({ format: "jpeg", width: 5, height: 3, orientation: 6 });
        expect(displaySize(header!)).toEqual({ width: 3, height: 5 });
    });

    it("reads an extended WebP (VP8X) canvas size", () => {
        const head = new Uint8Array(30);
        head.set(
            [..."RIFF"].map((c) => c.charCodeAt(0)),
            0,
        );
        head.set(
            [..."WEBPVP8X"].map((c) => c.charCodeAt(0)),
            8,
        );
        // Canvas width - 1 and height - 1, 24-bit little-endian.
        head.set([0xe6, 0x03, 0x00, 0x08, 0x03, 0x00], 24);
        expect(readImageHeader(head)).toMatchObject({ width: 999, height: 777 });
    });

    it("returns null for other data", () => {
        expect(readImageHeader(new TextEncoder().encode("not an image at all"))).toBeNull();
        expect(readImageHeader(bytes(FIXTURES.png).slice(0, 12))).toBeNull();
    });
});
