import type { ToolUiProps } from "@handyweb/core/ui";
import { ByteCodecTool } from "../byte-codec/ByteCodecTool";
import { strings } from "./i18n";

export default function HexTool(props: ToolUiProps) {
    return <ByteCodecTool {...props} radix={16} name={strings.name} />;
}
