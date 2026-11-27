import { css_beautify } from "js-beautify/js/lib/beautify-css.js";
import type { ToolUiProps } from "@handyweb/core/ui";
import { FormatterTool } from "../web-format/FormatterTool";

export default function CssFormatter(props: ToolUiProps) {
    return <FormatterTool {...props} beautify={css_beautify} />;
}
