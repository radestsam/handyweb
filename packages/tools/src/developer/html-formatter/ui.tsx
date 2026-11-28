import { html_beautify } from "js-beautify/js/lib/beautify-html.js";
import type { ToolUiProps } from "@handyweb/core/ui";
import { FormatterTool } from "../web-format/FormatterTool";

export default function HtmlFormatter(props: ToolUiProps) {
    return <FormatterTool {...props} beautify={html_beautify} />;
}
