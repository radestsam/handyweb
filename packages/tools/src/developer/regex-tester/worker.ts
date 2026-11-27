import { exposeWorker } from "@handyweb/core/worker";
import { runRegex, type RegexInput, type RegexOutput } from "./logic";

// Every pattern runs here. A pattern that backtracks without end can only be
// stopped by terminating the worker.
exposeWorker<RegexInput, RegexOutput>((input) => runRegex(input));
