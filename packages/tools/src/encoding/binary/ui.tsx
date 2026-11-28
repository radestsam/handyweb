import type { ToolUiProps } from "@handyweb/core/ui";
import { ByteCodecTool } from "../byte-codec/ByteCodecTool";
import { strings } from "./i18n";

export default function BinaryTool(props: ToolUiProps) {
    return <ByteCodecTool {...props} radix={2} name={strings.name} />;
}
