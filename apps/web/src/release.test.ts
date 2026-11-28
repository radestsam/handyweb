import { describe, expect, it } from "vitest";
import { RELEASE_TAG, REPOSITORY, toolIssueUrl } from "./release";

describe("toolIssueUrl", () => {
    const url = new URL(
        toolIssueUrl({
            id: "base64",
            title: "Base64 Encoder & Decoder",
            privacy: "local",
            page: "https://handyweb.ir/en/tools/base64/",
        }),
    );

    it("opens the bug form of the repository", () => {
        expect(`${url.origin}${url.pathname}`).toBe(`${REPOSITORY}/issues/new`);
        expect(url.searchParams.get("template")).toBe("bug.yml");
    });

    it("fills in the title, the page, the tool, and the release", () => {
        expect(url.searchParams.get("title")).toBe("[base64] ");
        expect(url.searchParams.get("page")).toBe("https://handyweb.ir/en/tools/base64/");
        expect(url.searchParams.get("tool")).toBe("Base64 Encoder & Decoder (base64, local)");
        expect(url.searchParams.get("version")).toBe(RELEASE_TAG);
    });

    it("sets only the known fields", () => {
        expect([...url.searchParams.keys()].sort()).toEqual([
            "page",
            "template",
            "title",
            "tool",
            "version",
        ]);
    });
});
