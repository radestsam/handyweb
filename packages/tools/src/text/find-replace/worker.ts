import { exposeWorker } from "@handyweb/core/worker";
import { checkReplaceInput, findReplace, type ReplaceInput, type ReplaceOutput } from "./logic";

// Each replace runs here, so a slow pattern can be stopped.
exposeWorker<ReplaceInput, ReplaceOutput>((input) => {
    checkReplaceInput(input);
    return findReplace(input);
});
