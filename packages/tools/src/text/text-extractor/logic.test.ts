import { describe, expect, it } from "vitest";
import { extract } from "./logic";

const keep = { unique: false, sort: false };

describe("extract", () => {
    it("finds email addresses", () => {
        expect(
            extract("Mail ali@example.com or sara.r@mail.co.ir. Not @x or a@b.", "emails", keep),
        ).toEqual(["ali@example.com", "sara.r@mail.co.ir"]);
    });

    it("finds URLs without the final punctuation", () => {
        expect(
            extract(
                "See https://handyweb.ir/fa/tools/, and www.example.com/a?b=1. (http://x.ir/y)",
                "urls",
                keep,
            ),
        ).toEqual(["https://handyweb.ir/fa/tools/", "www.example.com/a?b=1", "http://x.ir/y"]);
        expect(extract("سایت https://example.com/سلام،", "urls", keep)).toEqual([
            "https://example.com/سلام",
        ]);
    });

    it("finds Iranian phone numbers with Persian digits", () => {
        expect(
            extract("تماس: ۰۹۱۲۳۴۵۶۷۸۹ یا +98 912 345 6789 یا 021-88776655", "phones", keep),
        ).toEqual(["09123456789", "+98 912 345 6789", "021-88776655"]);
    });

    it("finds numbers", () => {
        expect(extract("قیمت ۱٬۲۰۰ و 3.5 و -7 و 1,000,000", "numbers", keep)).toEqual([
            "1٬200",
            "3.5",
            "-7",
            "1,000,000",
        ]);
    });

    it("finds hashtags and mentions", () => {
        expect(extract("#سلام_دنیا #web2 email@x.com @handyweb", "hashtags", keep)).toEqual([
            "#سلام_دنیا",
            "#web2",
        ]);
        expect(extract("hi @handyweb and @a.b, not me@x.com", "mentions", keep)).toEqual([
            "@handyweb",
            "@a.b",
        ]);
    });

    it("removes duplicates and sorts", () => {
        expect(extract("b@x.ir a@x.ir b@x.ir", "emails", { unique: true, sort: true })).toEqual([
            "a@x.ir",
            "b@x.ir",
        ]);
    });
});
