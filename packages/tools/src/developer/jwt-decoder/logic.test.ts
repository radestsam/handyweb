import { describe, expect, it } from "vitest";
import { ToolFailure } from "@handyweb/core/runtime";
import { decodeJwt, timeState } from "./logic";

const b64url = (text: string) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(text)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

const token = (header: object, payload: object | string, signature = "c2lnbmF0dXJl") =>
    [
        b64url(JSON.stringify(header)),
        b64url(typeof payload === "string" ? payload : JSON.stringify(payload)),
        signature,
    ].join(".");

// The example token of RFC 7519 section 3.1 (HS256).
const RFC =
    "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

function failure(fn: () => unknown): ToolFailure {
    try {
        fn();
    } catch (error) {
        if (error instanceof ToolFailure) return error;
        throw error;
    }
    throw new Error("expected a ToolFailure");
}

describe("decodeJwt", () => {
    it("decodes the RFC 7519 example", () => {
        const jwt = decodeJwt(RFC);
        expect(jwt.kind).toBe("jws");
        expect(jwt.header).toEqual({ typ: "JWT", alg: "HS256" });
        expect(JSON.parse(jwt.payloadText)).toEqual({
            iss: "joe",
            exp: 1300819380,
            "http://example.com/is_root": true,
        });
        expect(jwt.claims).toEqual({ exp: 1300819380 });
        expect(jwt.signatureBytes).toBe(32);
        expect(jwt.warnings).toEqual([]);
    });

    it("keeps Persian text in the payload", () => {
        const jwt = decodeJwt(token({ alg: "HS256" }, { name: "سارا رضایی", role: "مدیر" }));
        expect(jwt.payloadText).toBe('{\n  "name": "سارا رضایی",\n  "role": "مدیر"\n}');
        expect(jwt.payloadIsJson).toBe(true);
    });

    it("accepts a Bearer prefix, quotes, line breaks, and padding", () => {
        const plain = token({ alg: "HS256" }, { a: 1 });
        const [h, p, s] = plain.split(".");
        expect(decodeJwt(`Bearer ${plain}`).payloadText).toBe('{\n  "a": 1\n}');
        expect(decodeJwt(`"${h}.\n${p}.${s}"`).payloadText).toBe('{\n  "a": 1\n}');
        expect(decodeJwt(`${h}==.${p}.${s}`).header).toEqual({ alg: "HS256" });
    });

    it("shows a payload that is not JSON as text", () => {
        const jwt = decodeJwt(token({ alg: "HS256" }, "hello"));
        expect(jwt).toMatchObject({ payloadText: "hello", payloadIsJson: false, claims: {} });
    });

    it("reads only numeric time claims", () => {
        const jwt = decodeJwt(token({ alg: "HS256" }, { exp: "soon", nbf: 10, iat: 5 }));
        expect(jwt.claims).toEqual({ nbf: 10, iat: 5 });
    });

    it("warns about alg none and a missing signature", () => {
        expect(decodeJwt(token({ alg: "none" }, { a: 1 }, "")).warnings).toEqual(["alg-none"]);
        expect(decodeJwt(token({ alg: "HS256" }, { a: 1 }, "")).warnings).toEqual(["no-signature"]);
    });

    it("reads only the header of a JWE", () => {
        const header = b64url(JSON.stringify({ alg: "RSA-OAEP", enc: "A256GCM" }));
        const jwt = decodeJwt(`${header}.a.b.c.d`);
        expect(jwt).toMatchObject({ kind: "jwe", payloadText: "", header: { enc: "A256GCM" } });
    });

    it("rejects a wrong number of parts", () => {
        expect(failure(() => decodeJwt("abc.def")).detail).toBe("2 parts");
        expect(failure(() => decodeJwt("   ")).code).toBe("invalid-input");
    });

    it("names the part with a bad character", () => {
        const [h, , s] = RFC.split(".");
        expect(failure(() => decodeJwt(`${h}.ab+cd.${s}`)).detail).toBe("payload position 3");
        expect(failure(() => decodeJwt(`${h}.e30.x/y`)).localized.en).toBe(
            'The signature has the character "/", which is not Base64url.',
        );
    });

    it("rejects a header that is not a JSON object", () => {
        expect(failure(() => decodeJwt(`${b64url("[1]")}.e30.`)).detail).toBe("header object");
        expect(failure(() => decodeJwt(`${b64url("{x")}.e30.`)).detail).toBe("header json");
    });
});

describe("timeState", () => {
    it("compares exp and nbf with the clock", () => {
        expect(timeState({ exp: 100 }, 100)).toBe("expired");
        expect(timeState({ exp: 100 }, 99)).toBe("in-window");
        expect(timeState({ nbf: 50, exp: 100 }, 49)).toBe("not-yet");
        expect(timeState({ iat: 10 }, 20)).toBeNull();
    });
});
