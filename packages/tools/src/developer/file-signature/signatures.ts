/*
 * File signatures (magic numbers) at the start of a file. Each entry gives
 * the bytes, as hex, and an optional offset. "??" matches any byte.
 * Sources: the specifications of each format and the list at
 * https://en.wikipedia.org/wiki/List_of_file_signatures.
 */

export interface Signature {
    name: string;
    mime: string;
    extensions: string[];
    hex: string;
    offset?: number;
    /** A broad kind, to explain the risk of a file. */
    kind:
        | "image"
        | "document"
        | "archive"
        | "audio"
        | "video"
        | "executable"
        | "font"
        | "data"
        | "text";
}

export const SIGNATURES: readonly Signature[] = [
    {
        name: "PNG image",
        mime: "image/png",
        extensions: ["png"],
        hex: "89504e470d0a1a0a",
        kind: "image",
    },
    {
        name: "JPEG image",
        mime: "image/jpeg",
        extensions: ["jpg", "jpeg"],
        hex: "ffd8ff",
        kind: "image",
    },
    {
        name: "GIF image",
        mime: "image/gif",
        extensions: ["gif"],
        hex: "474946383?61",
        kind: "image",
    },
    {
        name: "WebP image",
        mime: "image/webp",
        extensions: ["webp"],
        hex: "52494646????????57454250",
        kind: "image",
    },
    {
        name: "AVIF image",
        mime: "image/avif",
        extensions: ["avif"],
        hex: "6674797061766966",
        offset: 4,
        kind: "image",
    },
    {
        name: "HEIC image",
        mime: "image/heic",
        extensions: ["heic"],
        hex: "6674797068656963",
        offset: 4,
        kind: "image",
    },
    { name: "BMP image", mime: "image/bmp", extensions: ["bmp"], hex: "424d", kind: "image" },
    { name: "ICO icon", mime: "image/x-icon", extensions: ["ico"], hex: "00000100", kind: "image" },
    {
        name: "TIFF image",
        mime: "image/tiff",
        extensions: ["tif", "tiff"],
        hex: "49492a00",
        kind: "image",
    },
    {
        name: "TIFF image",
        mime: "image/tiff",
        extensions: ["tif", "tiff"],
        hex: "4d4d002a",
        kind: "image",
    },
    {
        name: "Photoshop document",
        mime: "image/vnd.adobe.photoshop",
        extensions: ["psd"],
        hex: "38425053",
        kind: "image",
    },
    {
        name: "PDF document",
        mime: "application/pdf",
        extensions: ["pdf"],
        hex: "255044462d",
        kind: "document",
    },
    {
        name: "Rich Text",
        mime: "application/rtf",
        extensions: ["rtf"],
        hex: "7b5c727466",
        kind: "document",
    },
    {
        name: "Microsoft Office (old) or MSI",
        mime: "application/x-ole-storage",
        extensions: ["doc", "xls", "ppt", "msi"],
        hex: "d0cf11e0a1b11ae1",
        kind: "document",
    },
    {
        name: "ZIP archive (also DOCX, XLSX, PPTX, APK, JAR, EPUB)",
        mime: "application/zip",
        extensions: ["zip", "docx", "xlsx", "pptx", "apk", "jar", "epub"],
        hex: "504b0304",
        kind: "archive",
    },
    {
        name: "ZIP archive (empty)",
        mime: "application/zip",
        extensions: ["zip"],
        hex: "504b0506",
        kind: "archive",
    },
    {
        name: "RAR archive",
        mime: "application/vnd.rar",
        extensions: ["rar"],
        hex: "526172211a07",
        kind: "archive",
    },
    {
        name: "7-Zip archive",
        mime: "application/x-7z-compressed",
        extensions: ["7z"],
        hex: "377abcaf271c",
        kind: "archive",
    },
    {
        name: "Gzip",
        mime: "application/gzip",
        extensions: ["gz", "tgz"],
        hex: "1f8b",
        kind: "archive",
    },
    {
        name: "Bzip2",
        mime: "application/x-bzip2",
        extensions: ["bz2"],
        hex: "425a68",
        kind: "archive",
    },
    {
        name: "XZ",
        mime: "application/x-xz",
        extensions: ["xz"],
        hex: "fd377a585a00",
        kind: "archive",
    },
    {
        name: "Zstandard",
        mime: "application/zstd",
        extensions: ["zst"],
        hex: "28b52ffd",
        kind: "archive",
    },
    {
        name: "TAR archive",
        mime: "application/x-tar",
        extensions: ["tar"],
        hex: "7573746172",
        offset: 257,
        kind: "archive",
    },
    {
        name: "MP3 audio (ID3)",
        mime: "audio/mpeg",
        extensions: ["mp3"],
        hex: "494433",
        kind: "audio",
    },
    {
        name: "FLAC audio",
        mime: "audio/flac",
        extensions: ["flac"],
        hex: "664c6143",
        kind: "audio",
    },
    {
        name: "Ogg media",
        mime: "audio/ogg",
        extensions: ["ogg", "oga", "opus"],
        hex: "4f676753",
        kind: "audio",
    },
    {
        name: "WAV audio",
        mime: "audio/wav",
        extensions: ["wav"],
        hex: "52494646????????57415645",
        kind: "audio",
    },
    {
        name: "MP4 / M4A / MOV video",
        mime: "video/mp4",
        extensions: ["mp4", "m4a", "mov"],
        hex: "66747970",
        offset: 4,
        kind: "video",
    },
    {
        name: "Matroska / WebM video",
        mime: "video/x-matroska",
        extensions: ["mkv", "webm"],
        hex: "1a45dfa3",
        kind: "video",
    },
    {
        name: "AVI video",
        mime: "video/x-msvideo",
        extensions: ["avi"],
        hex: "52494646????????41564920",
        kind: "video",
    },
    {
        name: "Windows program (EXE, DLL)",
        mime: "application/vnd.microsoft.portable-executable",
        extensions: ["exe", "dll", "sys"],
        hex: "4d5a",
        kind: "executable",
    },
    {
        name: "Linux program (ELF)",
        mime: "application/x-elf",
        extensions: ["", "so"],
        hex: "7f454c46",
        kind: "executable",
    },
    {
        name: "macOS program (Mach-O)",
        mime: "application/x-mach-binary",
        extensions: [""],
        hex: "cffaedfe",
        kind: "executable",
    },
    {
        name: "Java class",
        mime: "application/java-vm",
        extensions: ["class"],
        hex: "cafebabe",
        kind: "executable",
    },
    {
        name: "WebAssembly",
        mime: "application/wasm",
        extensions: ["wasm"],
        hex: "0061736d",
        kind: "executable",
    },
    {
        name: "Shell script",
        mime: "text/x-shellscript",
        extensions: ["sh"],
        hex: "2321",
        kind: "executable",
    },
    {
        name: "WOFF2 font",
        mime: "font/woff2",
        extensions: ["woff2"],
        hex: "774f4632",
        kind: "font",
    },
    { name: "WOFF font", mime: "font/woff", extensions: ["woff"], hex: "774f4646", kind: "font" },
    {
        name: "TrueType font",
        mime: "font/ttf",
        extensions: ["ttf"],
        hex: "0001000000",
        kind: "font",
    },
    { name: "OpenType font", mime: "font/otf", extensions: ["otf"], hex: "4f54544f", kind: "font" },
    {
        name: "SQLite database",
        mime: "application/vnd.sqlite3",
        extensions: ["sqlite", "db"],
        hex: "53514c69746520666f726d6174203300",
        kind: "data",
    },
    {
        name: "XML document",
        mime: "application/xml",
        extensions: ["xml", "svg"],
        hex: "3c3f786d6c",
        kind: "text",
    },
    {
        name: "UTF-8 text with BOM",
        mime: "text/plain",
        extensions: ["txt"],
        hex: "efbbbf",
        kind: "text",
    },
    {
        name: "UTF-16 text (little-endian BOM)",
        mime: "text/plain",
        extensions: ["txt"],
        hex: "fffe",
        kind: "text",
    },
];
