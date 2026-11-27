import type { ToolUiProps } from "@handyweb/core/ui";
import { EffectTool } from "../effect/EffectTool";

export default function ImageBlur({ locale, presetOptions }: ToolUiProps) {
    return <EffectTool locale={locale} effect="blur" presetTarget={presetOptions?.["target"]} />;
}
