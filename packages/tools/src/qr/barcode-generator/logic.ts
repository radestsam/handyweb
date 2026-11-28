import type { Encoded } from "./encode";

export * from "./encode";

/** The quiet zone on each side, in modules (10 for Code 128, 9 for EAN). */
export function quietZone(format: Encoded["format"]): number {
    return format === "code128" ? 10 : 9;
}

export interface SvgOptions {
    module: number;
    height: number;
    showText: boolean;
    dark: string;
    light: string;
}

/** An SVG of the barcode with a quiet zone and, when asked, the text below. */
export function toSvg(code: Encoded, options: SvgOptions): string {
    const quiet = quietZone(code.format) * options.module;
    const total = code.widths.reduce((sum, width) => sum + width, 0) * options.module + quiet * 2;
    const textHeight = options.showText ? Math.round(options.module * 10) : 0;
    let x = quiet;
    let path = "";
    code.widths.forEach((width, index) => {
        const w = width * options.module;
        if (index % 2 === 0) path += `M${x} 0h${w}v${options.height}h-${w}z`;
        x += w;
    });
    const label = options.showText
        ? `<text x="${total / 2}" y="${options.height + textHeight * 0.85}" text-anchor="middle" font-family="monospace" font-size="${textHeight * 0.8}" fill="${options.dark}">${code.text.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`)}</text>`
        : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${options.height + textHeight}" viewBox="0 0 ${total} ${options.height + textHeight}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${options.light}"/><path d="${path}" fill="${options.dark}"/>${label}</svg>`;
}
