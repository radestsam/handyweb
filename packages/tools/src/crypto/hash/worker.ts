import { exposeWorker } from "@handyweb/core/worker";
import { hashBlob } from "./logic";

export interface HashFileInput {
    file: Blob;
}

// Files are hashed here, so a large file does not freeze the page.
exposeWorker<HashFileInput, Uint8Array>(
    ({ file }, { signal, progress }) => hashBlob(file, { signal, onProgress: progress }),
    { transferResult: (digest) => [digest.buffer as ArrayBuffer] },
);
