import type { ToolUiProps } from "@handyweb/core/ui";
import { EffectTool } from "../effect/EffectTool";

export default function ImagePixelate({ locale, presetOptions }: ToolUiProps) {
    return (
        <EffectTool locale={locale} effect="pixelate" presetTarget={presetOptions?.["target"]} />
    );
}
