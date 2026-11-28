import { describe, expect, it } from "vitest";
import { move } from "./list";

describe("move", () => {
    it("moves an item one place and keeps the ends", () => {
        expect(move(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
        expect(move(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
        expect(move(["a", "b"], 0, -1)).toEqual(["a", "b"]);
        expect(move(["a", "b"], 1, 1)).toEqual(["a", "b"]);
    });
});
