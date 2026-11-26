import { validateRegistry } from "@handyweb/core";
import { describe, expect, it } from "vitest";
import { catalog, categories, loaders } from "./index";

describe("the tool registry", () => {
    it("is valid", () => {
        expect(validateRegistry({ categories, tools: catalog, loaders })).toEqual([]);
    });
});
