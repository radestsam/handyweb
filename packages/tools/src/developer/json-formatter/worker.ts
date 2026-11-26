import { exposeWorker } from "@handyweb/core/worker";
import { processJson, type JsonInput, type JsonOutput } from "./logic";

// Large JSON input runs here, so formatting a big file does not freeze the page.
exposeWorker<JsonInput, JsonOutput>((input) => processJson(input));
