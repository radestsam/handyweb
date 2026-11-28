import { exposeWorker } from "@handyweb/core/worker";
import { compareTexts, type DiffInput, type DiffOutput } from "./logic";

// Large texts are compared here, so the page stays responsive.
exposeWorker<DiffInput, DiffOutput>((input) => compareTexts(input));
