import { describe, expect, it } from "vitest";
import { localePath, splitLocalePath } from "./paths";
import { isLocale, otherLocale } from "./locales";

describe("localePath", () => {
    it("prefixes the locale and ends with a slash", () => {
        expect(localePath("fa", "/")).toBe("/fa/");
        expect(localePath("en", "/about")).toBe("/en/about/");
        expect(localePath("fa", "tools/base64/")).toBe("/fa/tools/base64/");
    });
});

describe("splitLocalePath", () => {
    it("reads the locale and the neutral path", () => {
        expect(splitLocalePath("/fa/tools/base64/")).toEqual({
            locale: "fa",
            path: "/tools/base64/",
        });
        expect(splitLocalePath("/en")).toEqual({ locale: "en", path: "/" });
        expect(splitLocalePath("/de/x/")).toEqual({ locale: null, path: "/de/x/" });
    });
});

describe("locales", () => {
    it("recognizes the two locales only", () => {
        expect(isLocale("fa")).toBe(true);
        expect(isLocale("ar")).toBe(false);
        expect(otherLocale("fa")).toBe("en");
    });
});
