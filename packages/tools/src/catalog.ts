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
import { punctuationFixerMeta } from "./persian/punctuation-fixer/meta";
import { directionFixerMeta } from "./persian/direction-fixer/meta";
import { yamlFormatterMeta } from "./developer/yaml-formatter/meta";
import { jsonYamlMeta } from "./developer/json-yaml/meta";
import { sqlFormatterMeta } from "./developer/sql-formatter/meta";
import { htmlFormatterMeta } from "./developer/html-formatter/meta";
import { cssFormatterMeta } from "./developer/css-formatter/meta";
import { jsFormatterMeta } from "./developer/js-formatter/meta";
import { jsonCsvMeta } from "./developer/json-csv/meta";
import { jsonDiffMeta } from "./developer/json-diff/meta";
import { jsonSchemaValidatorMeta } from "./developer/json-schema-validator/meta";
import { colorConverterMeta } from "./developer/color-converter/meta";
import { urlParserMeta } from "./developer/url-parser/meta";
import { cronParserMeta } from "./developer/cron-parser/meta";
import { httpHeaderParserMeta } from "./developer/http-header-parser/meta";
import { userAgentParserMeta } from "./developer/user-agent-parser/meta";
import { hexMeta } from "./encoding/hex/meta";
import { binaryMeta } from "./encoding/binary/meta";
import { base64FileMeta } from "./encoding/base64-file/meta";
import { gzipMeta } from "./encoding/gzip/meta";
import { subtitleConverterMeta } from "./text/subtitle-converter/meta";
import { aesGcmMeta } from "./crypto/aes-gcm/meta";
import { totpMeta } from "./crypto/totp/meta";
import { fileSignatureMeta } from "./developer/file-signature/meta";
import { pemDecoderMeta } from "./crypto/pem-decoder/meta";
import { htmlPreviewMeta } from "./developer/html-preview/meta";
import { markdownEditorMeta } from "./developer/markdown-editor/meta";
import { imageResizeMeta } from "./image/image-resize/meta";
import { imageRotateMeta } from "./image/image-rotate/meta";
import { imageFlipMeta } from "./image/image-flip/meta";
import { imageCropMeta } from "./image/image-crop/meta";
import { imageConverterMeta } from "./image/image-converter/meta";
import { imageCompressorMeta } from "./image/image-compressor/meta";
import { imageMetadataMeta } from "./image/image-metadata/meta";
import { imageColorPickerMeta } from "./image/image-color-picker/meta";
import { imagePaletteMeta } from "./image/image-palette/meta";
import { imageCompareMeta } from "./image/image-compare/meta";
import { imageBlurMeta } from "./image/image-blur/meta";
import { imagePixelateMeta } from "./image/image-pixelate/meta";
import { imageWatermarkMeta } from "./image/image-watermark/meta";
import { faviconGeneratorMeta } from "./image/favicon-generator/meta";
import { svgViewerMeta } from "./image/svg-viewer/meta";
import { svgOptimizerMeta } from "./image/svg-optimizer/meta";
import { pdfMergeMeta } from "./pdf/pdf-merge/meta";
import { unitConverterMeta } from "./calculators/unit-converter/meta";
import { percentageCalculatorMeta } from "./calculators/percentage-calculator/meta";
import { discountCalculatorMeta } from "./calculators/discount-calculator/meta";
import { vatCalculatorMeta } from "./calculators/vat-calculator/meta";
import { dateDifferenceMeta } from "./calculators/date-difference/meta";
import { aspectRatioMeta } from "./calculators/aspect-ratio/meta";
import { imageResolutionMeta } from "./calculators/image-resolution/meta";
import { cssUnitsMeta } from "./calculators/css-units/meta";
import { romanNumeralsMeta } from "./calculators/roman-numerals/meta";
import { binaryCalculatorMeta } from "./calculators/binary-calculator/meta";
import { colorContrastMeta } from "./calculators/color-contrast/meta";
import { timeZoneConverterMeta } from "./calculators/time-zone-converter/meta";
import { barcodeGeneratorMeta } from "./qr/barcode-generator/meta";
import { codeReaderMeta } from "./qr/code-reader/meta";
import { ipCalculatorMeta } from "./network/ip-calculator/meta";
import { macFormatterMeta } from "./network/mac-formatter/meta";
import { httpStatusMeta } from "./network/http-status/meta";
import { mimeTypesMeta } from "./network/mime-types/meta";
import { ipRangesMeta } from "./network/ip-ranges/meta";

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
    punctuationFixerMeta,
    directionFixerMeta,
    yamlFormatterMeta,
    jsonYamlMeta,
    sqlFormatterMeta,
    htmlFormatterMeta,
    cssFormatterMeta,
    jsFormatterMeta,
    jsonCsvMeta,
    jsonDiffMeta,
    jsonSchemaValidatorMeta,
    colorConverterMeta,
    urlParserMeta,
    cronParserMeta,
    httpHeaderParserMeta,
    userAgentParserMeta,
    hexMeta,
    binaryMeta,
    base64FileMeta,
    gzipMeta,
    subtitleConverterMeta,
    aesGcmMeta,
    totpMeta,
    fileSignatureMeta,
    pemDecoderMeta,
    htmlPreviewMeta,
    markdownEditorMeta,
    imageResizeMeta,
    imageRotateMeta,
    imageFlipMeta,
    imageCropMeta,
    imageConverterMeta,
    imageCompressorMeta,
    imageMetadataMeta,
    imageColorPickerMeta,
    imagePaletteMeta,
    imageCompareMeta,
    imageBlurMeta,
    imagePixelateMeta,
    imageWatermarkMeta,
    faviconGeneratorMeta,
    svgViewerMeta,
    svgOptimizerMeta,
    pdfMergeMeta,
    unitConverterMeta,
    percentageCalculatorMeta,
    discountCalculatorMeta,
    vatCalculatorMeta,
    dateDifferenceMeta,
    aspectRatioMeta,
    imageResolutionMeta,
    cssUnitsMeta,
    romanNumeralsMeta,
    binaryCalculatorMeta,
    colorContrastMeta,
    timeZoneConverterMeta,
    barcodeGeneratorMeta,
    codeReaderMeta,
    ipCalculatorMeta,
    macFormatterMeta,
    httpStatusMeta,
    mimeTypesMeta,
    ipRangesMeta,
];
