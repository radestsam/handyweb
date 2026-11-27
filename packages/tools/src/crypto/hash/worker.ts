import { exposeWorker } from "@handyweb/core/worker";
import { hashBlob, type Algorithm } from "./logic";

export interface HashFileInput {
    file: Blob;
    algorithm: Algorithm;
}

// Files are hashed here, so a large file does not freeze the page.
exposeWorker<HashFileInput, Uint8Array>(
    ({ file, algorithm }, { signal, progress }) =>
        hashBlob(file, { algorithm, signal, onProgress: progress }),
    { transferResult: (digest) => [digest.buffer as ArrayBuffer] },
);
