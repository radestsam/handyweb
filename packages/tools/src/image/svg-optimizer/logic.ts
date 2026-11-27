import { ToolFailure } from "@handyweb/core/runtime";
import { inspectSvg } from "../svg-viewer/logic";

/*
 * A small SVG optimizer. It changes only things that do not change how the
 * picture looks: editor data, comments, empty groups, extra precision in
 * numbers, and white space. (SVGO, the common optimizer, is about 195 KB
 * gzip in the browser, far above the page budget.)
 */

export interface OptimizeOptions {
    /** Digits after the decimal point. */
    precision: number;
    /** Keep <title> and <desc>, which screen readers use. */
    keepTitle: boolean;
    /** Remove scripts, event handlers, and remote files first (the viewer's cleaner). */
    sanitize: boolean;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const KEEP_NAMESPACES = new Set([
    SVG_NS,
    "http://www.w3.org/1999/xlink",
    "http://www.w3.org/XML/1998/namespace",
]);
const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
const NUMERIC_ATTRIBUTES = new Set([
    "x",
    "y",
    "x1",
    "y1",
    "x2",
    "y2",
    "cx",
    "cy",
    "r",
    "rx",
    "ry",
    "width",
    "height",
    "stroke-width",
    "opacity",
    "fill-opacity",
    "stroke-opacity",
    "offset",
    "font-size",
]);
const EDITOR_ATTRIBUTES = /^(data-name|enable-background|version|xml:space)$/;

/** A number as short as possible: 0.50 is .5, -0.0 is 0. */
export function shortNumber(value: number, precision: number): string {
    const rounded = Number(value.toFixed(precision));
    if (Object.is(rounded, -0) || rounded === 0) return "0";
    return String(rounded).replace(/^(-?)0\./, "$1.");
}

/** Rounds every number in path data and removes the spaces that are not needed. */
export function minifyPath(d: string, precision: number): string {
    return d
        .replace(NUMBER, (n) => shortNumber(Number(n), precision))
        .replace(/[\s,]+/g, " ")
        .replace(/ ?([a-zA-Z]) ?/g, "$1")
        .replace(/ (-)/g, "$1")
        .trim();
}

function roundList(value: string, precision: number): string {
    return value
        .replace(NUMBER, (n) => shortNumber(Number(n), precision))
        .replace(/[\s,]+/g, " ")
        .trim();
}

export interface OptimizeResult {
    svg: string;
    before: number;
    after: number;
}

export function optimizeSvg(text: string, options: OptimizeOptions): OptimizeResult {
    const input = text.trim();
    // inspectSvg checks that it is SVG, and gives the cleaned copy.
    const source = options.sanitize ? inspectSvg(input).clean : (inspectSvg(input), input);
    const doc = new DOMParser().parseFromString(source, "image/svg+xml");
    const root = doc.documentElement;

    const walk = (node: Element) => {
        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === 8 || child.nodeType === 7 || child.nodeType === 10) {
                // Comments, processing instructions, and doctypes.
                node.removeChild(child);
                continue;
            }
            if (child.nodeType === 3) {
                // White space between elements, but not text in <text> or <style>.
                if (
                    !/^(text|tspan|textPath|style|title|desc)$/.test(node.localName) &&
                    !child.textContent?.trim()
                )
                    node.removeChild(child);
                continue;
            }
            if (child.nodeType !== 1) continue;
            const element = child as Element;
            const name = element.localName;
            if (
                !KEEP_NAMESPACES.has(element.namespaceURI ?? SVG_NS) ||
                name === "metadata" ||
                (!options.keepTitle && (name === "title" || name === "desc"))
            ) {
                node.removeChild(element);
                continue;
            }
            walk(element);
            // An empty <g> or <defs> does nothing.
            if ((name === "g" || name === "defs") && element.childNodes.length === 0) {
                node.removeChild(element);
                continue;
            }
            // A <g> without attributes is the same as its children.
            if (name === "g" && element.attributes.length === 0) {
                while (element.firstChild) node.insertBefore(element.firstChild, element);
                node.removeChild(element);
            }
        }
    };

    const cleanAttributes = (element: Element) => {
        for (const attribute of Array.from(element.attributes)) {
            const name = attribute.name;
            const ns = attribute.namespaceURI;
            const isXmlns = name.startsWith("xmlns:");
            if (
                (ns && !KEEP_NAMESPACES.has(ns) && ns !== "http://www.w3.org/2000/xmlns/") ||
                EDITOR_ATTRIBUTES.test(name)
            ) {
                element.removeAttribute(name);
                continue;
            }
            if (isXmlns && !["xmlns:xlink"].includes(name)) {
                element.removeAttribute(name);
                continue;
            }
            if (name === "d")
                element.setAttribute(name, minifyPath(attribute.value, options.precision));
            else if (name === "points" || name === "viewBox" || name === "transform")
                element.setAttribute(name, roundList(attribute.value, options.precision));
            else if (
                NUMERIC_ATTRIBUTES.has(name) &&
                /^-?[\d.]+(e[-+]?\d+)?(px)?$/i.test(attribute.value.trim())
            ) {
                const unit = attribute.value.trim().endsWith("px") ? "" : "";
                element.setAttribute(
                    name,
                    shortNumber(parseFloat(attribute.value), options.precision) + unit,
                );
            }
        }
        for (const child of Array.from(element.children)) cleanAttributes(child);
    };

    // Attributes first, so a group that had only editor attributes is unwrapped.
    cleanAttributes(root);
    walk(root);
    // xmlns:xlink is not needed when nothing uses xlink.
    if (!root.outerHTML.includes("xlink:")) root.removeAttribute("xmlns:xlink");
    const svg = new XMLSerializer().serializeToString(root).replace(/>\s+</g, "><");
    if (svg.length === 0)
        throw new ToolFailure(
            "internal",
            { fa: "بهینه‌سازی نشد.", en: "The SVG could not be optimized." },
            "empty",
        );
    const size = (value: string) => new TextEncoder().encode(value).length;
    return { svg, before: size(input), after: size(svg) };
}
