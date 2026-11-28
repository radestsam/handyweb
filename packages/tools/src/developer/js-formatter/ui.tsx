import { js_beautify } from "js-beautify/js/lib/beautify.js";
import type { ToolUiProps } from "@handyweb/core/ui";
import { FormatterTool } from "../web-format/FormatterTool";

export default function JsFormatter(props: ToolUiProps) {
    return <FormatterTool {...props} beautify={js_beautify} />;
}
