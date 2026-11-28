import type { ToolDefinition } from "@handyweb/core";
import { base64Meta } from "./encoding/base64/meta";
import { jsonFormatterMeta } from "./developer/json-formatter/meta";
import { hashMeta } from "./crypto/hash/meta";
import { persianNormalizerMeta } from "./persian/persian-normalizer/meta";
import { jalaliConverterMeta } from "./persian/jalali-converter/meta";
import { textCounterMeta } from "./text/text-counter/meta";
import { caseConverterMeta } from "./text/case-converter/meta";
import { removeDuplicateLinesMeta } from "./text/remove-duplicate-lines/meta";
import { sortLinesMeta } from "./text/sort-lines/meta";
import { textCleanerMeta } from "./text/text-cleaner/meta";
import { urlEncodingMeta } from "./encoding/url-encoding/meta";
import { htmlEntitiesMeta } from "./encoding/html-entities/meta";
import { unicodeEscapeMeta } from "./encoding/unicode-escape/meta";
import { unicodeExplorerMeta } from "./text/unicode-explorer/meta";
import { xmlFormatterMeta } from "./developer/xml-formatter/meta";
import { jwtDecoderMeta } from "./developer/jwt-decoder/meta";
import { hmacMeta } from "./crypto/hmac/meta";
import { passwordGeneratorMeta } from "./crypto/password-generator/meta";
import { randomTokenMeta } from "./crypto/random-token/meta";
import { uuidGeneratorMeta } from "./developer/uuid-generator/meta";
import { textDiffMeta } from "./text/text-diff/meta";
import { regexTesterMeta } from "./developer/regex-tester/meta";
import { unixTimestampMeta } from "./developer/unix-timestamp/meta";
import { numberBaseMeta } from "./developer/number-base/meta";
import { qrGeneratorMeta } from "./qr/qr-generator/meta";
import { reverseTextMeta } from "./text/reverse-text/meta";
import { textRepeaterMeta } from "./text/text-repeater/meta";
import { splitJoinMeta } from "./text/split-join/meta";
import { findReplaceMeta } from "./text/find-replace/meta";
import { jsonStringMeta } from "./developer/json-string/meta";
import { slugGeneratorMeta } from "./text/slug-generator/meta";
import { loremIpsumMeta } from "./text/lorem-ipsum/meta";
import { textExtractorMeta } from "./text/text-extractor/meta";
import { numberToWordsMeta } from "./persian/number-to-words/meta";
import { zwnjFixerMeta } from "./persian/zwnj-fixer/meta";

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
    caseConverterMeta,
    removeDuplicateLinesMeta,
    sortLinesMeta,
    textCleanerMeta,
    urlEncodingMeta,
    htmlEntitiesMeta,
    unicodeEscapeMeta,
    unicodeExplorerMeta,
    xmlFormatterMeta,
    jwtDecoderMeta,
    hmacMeta,
    passwordGeneratorMeta,
    randomTokenMeta,
    uuidGeneratorMeta,
    textDiffMeta,
    regexTesterMeta,
    unixTimestampMeta,
    numberBaseMeta,
    qrGeneratorMeta,
    reverseTextMeta,
    textRepeaterMeta,
    splitJoinMeta,
    findReplaceMeta,
    jsonStringMeta,
    slugGeneratorMeta,
    loremIpsumMeta,
    textExtractorMeta,
    numberToWordsMeta,
    zwnjFixerMeta,
];
