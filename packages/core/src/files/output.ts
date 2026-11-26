/**
 * Object URLs and downloads. Every object URL that a tool creates is revoked
 * on reset, on unmount, and before a new result replaces it, so no large
 * Blob stays alive after it is needed (plan section 4, Phase 4).
 */
export class ObjectUrls {
    readonly #urls = new Set<string>();

    create(blob: Blob): string {
        const url = URL.createObjectURL(blob);
        this.#urls.add(url);
        return url;
    }

    revoke(url: string): void {
        if (this.#urls.delete(url)) URL.revokeObjectURL(url);
    }

    revokeAll(): void {
        for (const url of this.#urls) URL.revokeObjectURL(url);
        this.#urls.clear();
    }

    get size(): number {
        return this.#urls.size;
    }
}

/**
 * Removes characters that are not safe in a file name on common systems. The
 * result is never empty.
 */
export function safeFileName(name: string, fallback = "handyweb-output"): string {
    const cleaned = name
        .normalize("NFC")
        // Control characters, path separators, and characters that Windows forbids.
        .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "_")
        .replace(/^[\s.]+|[\s.]+$/g, "")
        .slice(0, 180);
    return cleaned === "" ? fallback : cleaned;
}

/** Saves a Blob to the device of the user. Nothing leaves the browser. */
export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = safeFileName(fileName);
    link.rel = "noopener";
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    // The download has started. A short delay keeps older Safari from failing.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies text to the clipboard. Falls back to a hidden textarea where the
 * Clipboard API is missing or blocked. Returns false when both fail.
 */
export async function copyText(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // Fall through to the textarea method.
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch {
        copied = false;
    }
    area.remove();
    return copied;
}
