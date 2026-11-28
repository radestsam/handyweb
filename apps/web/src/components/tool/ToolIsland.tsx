import {
    Component,
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
    useSyncExternalStore,
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

const subscribe = () => () => undefined;
const readPresetId = () => new URLSearchParams(window.location.search).get("preset");

/**
 * The only island on a tool page. It loads the UI chunk of one tool on demand,
 * so a page never loads the code of another tool.
 */
export default function ToolIsland({ toolId, locale, presets }: Props) {
    // The page is built on the server without a query string, so the first
    // render has no preset, the same as the HTML. A ?preset= in the URL is read
    // after hydration, and the tool starts again with it (the key changes).
    const presetId = useSyncExternalStore(subscribe, readPresetId, () => null);
    const preset = presets.find((item) => item.id === presetId);
    // The tool HTML is on the page before its code runs. Until React has taken
    // it over, the tool is inert, so that text typed into it is not lost.
    const [ready, setReady] = useState(false);
    const markReady = useCallback(() => setReady(true), []);

    const Tool = LAZY_TOOLS[toolId];
    if (!Tool)
        return <ErrorMessage error={standardError("internal", "no-loader")} locale={locale} />;

    return (
        <ToolErrorBoundary locale={locale}>
            <div inert={!ready} aria-busy={!ready} data-tool-ready={ready ? "" : undefined}>
                <Suspense
                    fallback={
                        <p className="text-sm text-muted" role="status">
                            {UI_STRINGS.working[locale]}
                        </p>
                    }
                >
                    <Tool key={preset?.id ?? ""} locale={locale} presetOptions={preset?.options} />
                    <Ready onReady={markReady} />
                </Suspense>
            </div>
        </ToolErrorBoundary>
    );
}

/** Calls onReady when the tool next to it has been hydrated or rendered. */
function Ready({ onReady }: { onReady: () => void }) {
    useEffect(onReady, [onReady]);
    return null;
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
