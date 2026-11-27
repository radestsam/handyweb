import type { ToolLoader } from "@handyweb/core";

/*
 * The UI module of each tool, loaded on demand. Each import() becomes its own
 * chunk, so a tool page loads only its own code.
 */
export const loaders: Readonly<Record<string, ToolLoader>> = {
    base64: () => import("./encoding/base64/ui"),
    "json-formatter": () => import("./developer/json-formatter/ui"),
    hash: () => import("./crypto/hash/ui"),
    "persian-normalizer": () => import("./persian/persian-normalizer/ui"),
    "jalali-converter": () => import("./persian/jalali-converter/ui"),
    "text-counter": () => import("./text/text-counter/ui"),
    "case-converter": () => import("./text/case-converter/ui"),
    "remove-duplicate-lines": () => import("./text/remove-duplicate-lines/ui"),
    "sort-lines": () => import("./text/sort-lines/ui"),
    "text-cleaner": () => import("./text/text-cleaner/ui"),
    "url-encoding": () => import("./encoding/url-encoding/ui"),
    "html-entities": () => import("./encoding/html-entities/ui"),
    "unicode-escape": () => import("./encoding/unicode-escape/ui"),
    "unicode-explorer": () => import("./text/unicode-explorer/ui"),
    "xml-formatter": () => import("./developer/xml-formatter/ui"),
    "jwt-decoder": () => import("./developer/jwt-decoder/ui"),
    hmac: () => import("./crypto/hmac/ui"),
    "password-generator": () => import("./crypto/password-generator/ui"),
    "random-token": () => import("./crypto/random-token/ui"),
    "uuid-generator": () => import("./developer/uuid-generator/ui"),
    "text-diff": () => import("./text/text-diff/ui"),
    "regex-tester": () => import("./developer/regex-tester/ui"),
    "unix-timestamp": () => import("./developer/unix-timestamp/ui"),
};
