import type { ToolUiProps } from "@handyweb/core/ui";
import { TransformTool } from "../transform/TransformTool";

export default function ImageFlip(props: ToolUiProps) {
    return <TransformTool {...props} focus="flip" />;
}
