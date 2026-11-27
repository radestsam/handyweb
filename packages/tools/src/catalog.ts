import type { ToolDefinition } from "@handyweb/core";
import { base64Meta } from "./encoding/base64/meta";
import { jsonFormatterMeta } from "./developer/json-formatter/meta";
import { hashMeta } from "./crypto/hash/meta";
import { persianNormalizerMeta } from "./persian/persian-normalizer/meta";
import { jalaliConverterMeta } from "./persian/jalali-converter/meta";
import { textCounterMeta } from "./text/text-counter/meta";

/*
 * The metadata of every tool. Import only meta.ts files here: this module is
 * read by every page and by the search index, so it must not load tool code.
 */
export const catalog: readonly ToolDefinition[] = [
    base64Meta,
    jsonFormatterMeta,
    hashMeta,
    persianNormalizerMeta,
    jalaliConverterMeta,
    textCounterMeta,
];
