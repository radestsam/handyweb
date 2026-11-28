import DOMPurify from "dompurify";
import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Reads an SVG, lists what in it is unsafe or loads from the network, and
 * makes a clean copy with DOMPurify (SVG profile). The page shows only the
 * clean copy, and only as an <img>, where no script can run and no remote
 * file loads.
 */

export type Risk =
    "script" | "event-handler" | "javascript-url" | "external-reference" | "foreign-object";

export interface SvgInfo {
    width: string | null;
    height: string | null;
    viewBox: string | null;
    /** The number of elements. */
    elements: number;
    risks: Risk[];
    /** The clean SVG text. */
    clean: string;
}

function invalid(): ToolFailure {
    return new ToolFailure(
        "invalid-input",
        { fa: "این متن SVG درست نیست.", en: "This is not valid SVG." },
        "svg",
    );
}

export function inspectSvg(text: string): SvgInfo {
    const source = text.trim();
    if (source === "")
        throw new ToolFailure(
            "invalid-input",
            { fa: "ورودی خالی است.", en: "The input is empty." },
            "empty",
        );
    const doc = new DOMParser().parseFromString(source, "image/svg+xml");
    const root = doc.documentElement;
    if (doc.getElementsByTagName("parsererror").length > 0 || root.localName !== "svg")
        throw invalid();
    const risks = new Set<Risk>();
    const all = [root, ...Array.from(root.getElementsByTagName("*"))];
    for (const element of all) {
        const name = element.localName.toLowerCase();
        if (name === "script") risks.add("script");
        if (name === "foreignobject") risks.add("foreign-object");
        for (const attribute of Array.from(element.attributes)) {
            const key = attribute.name.toLowerCase();
            const value = attribute.value.trim().toLowerCase();
            if (key.startsWith("on")) risks.add("event-handler");
            if ((key === "href" || key === "xlink:href") && value.startsWith("javascript:"))
                risks.add("javascript-url");
            if (
                (key === "href" || key === "xlink:href" || key === "src") &&
                /^(https?:)?\/\//.test(value)
            )
                risks.add("external-reference");
            if (key === "style" && /url\(\s*['"]?(https?:)?\/\//.test(value))
                risks.add("external-reference");
        }
        if (
            name === "style" &&
            /@import|url\(\s*['"]?(https?:)?\/\//i.test(element.textContent ?? "")
        )
            risks.add("external-reference");
    }
    const purified = DOMPurify.sanitize(source, {
        USE_PROFILES: { svg: true, svgFilters: true },
        // <use> is safe once every href that is not "#id" is removed below.
        ADD_TAGS: ["use"],
    });
    // DOMPurify keeps http(s) links in href; remove them so the image loads nothing.
    const cleanDoc = new DOMParser().parseFromString(
        purified || '<svg xmlns="http://www.w3.org/2000/svg"/>',
        "image/svg+xml",
    );
    for (const element of Array.from(cleanDoc.getElementsByTagName("*"))) {
        for (const key of ["href", "xlink:href"]) {
            const value = element.getAttribute(key);
            if (value && !value.startsWith("#") && !value.startsWith("data:image/"))
                element.removeAttribute(key);
        }
    }
    const cleanRoot = cleanDoc.documentElement;
    if (!cleanRoot.getAttribute("xmlns"))
        cleanRoot.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return {
        width: root.getAttribute("width"),
        height: root.getAttribute("height"),
        viewBox: root.getAttribute("viewBox"),
        elements: all.length,
        risks: [...risks],
        clean: new XMLSerializer().serializeToString(cleanRoot),
    };
}

/** The pixel size to draw a PNG at, from the width, height, or viewBox, scaled to the longest side. */
export function pngSize(
    info: Pick<SvgInfo, "width" | "height" | "viewBox">,
    longest: number,
): { width: number; height: number } {
    const box = info.viewBox?.split(/[\s,]+/).map(Number);
    let w = parseFloat(info.width ?? "") || (box && box.length === 4 ? (box[2] as number) : 0);
    let h = parseFloat(info.height ?? "") || (box && box.length === 4 ? (box[3] as number) : 0);
    if (!(w > 0) || !(h > 0)) {
        w = 1;
        h = 1;
    }
    const scale = longest / Math.max(w, h);
    return {
        width: Math.max(1, Math.round(w * scale)),
        height: Math.max(1, Math.round(h * scale)),
    };
}
