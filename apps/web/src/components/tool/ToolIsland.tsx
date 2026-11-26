import {
    Component,
    lazy,
    Suspense,
    useMemo,
    type ComponentType,
    type LazyExoticComponent,
    type ReactNode,
} from "react";
import type { Locale } from "@handyweb/core";
import { standardError } from "@handyweb/core/runtime";
import { ErrorMessage, UI_STRINGS, type ToolUiProps } from "@handyweb/core/ui";
import { loaders } from "@handyweb/tools/loaders";

interface Props {
    toolId: string;
    locale: Locale;
    presets: ReadonlyArray<{ id: string; options: Readonly<Record<string, unknown>> }>;
}

type LazyTool = LazyExoticComponent<ComponentType<ToolUiProps>>;

/** One lazy component per tool, created once, outside of render. */
const LAZY_TOOLS: Readonly<Record<string, LazyTool>> = Object.fromEntries(
    Object.entries(loaders).map(([id, load]) => [
        id,
        lazy(async () => {
            const module = await load();
            return { default: module.default as ComponentType<ToolUiProps> };
        }),
    ]),
);

/**
 * The only island on a tool page. It loads the UI chunk of one tool on demand,
 * so a page never loads the code of another tool.
 */
export default function ToolIsland({ toolId, locale, presets }: Props) {
    const presetOptions = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        const id = new URLSearchParams(window.location.search).get("preset");
        return presets.find((preset) => preset.id === id)?.options;
    }, [presets]);

    const Tool = LAZY_TOOLS[toolId];
    if (!Tool)
        return <ErrorMessage error={standardError("internal", "no-loader")} locale={locale} />;

    return (
        <ToolErrorBoundary locale={locale}>
            <Suspense
                fallback={
                    <p className="text-sm text-muted" role="status">
                        {UI_STRINGS.working[locale]}
                    </p>
                }
            >
                <Tool locale={locale} presetOptions={presetOptions} />
            </Suspense>
        </ToolErrorBoundary>
    );
}

/** Keeps a crash inside one tool from breaking the page. */
class ToolErrorBoundary extends Component<
    { locale: Locale; children: ReactNode },
    { failed: boolean }
> {
    override state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    override render() {
        if (this.state.failed) {
            return (
                <ErrorMessage
                    error={standardError("internal", "render")}
                    locale={this.props.locale}
                />
            );
        }
        return this.props.children;
    }
}
