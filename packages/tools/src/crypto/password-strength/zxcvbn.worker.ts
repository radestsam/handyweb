/*
 * The password strength worker. It builds the zxcvbn dictionaries once and
 * then answers each check. It keeps no password: each message is checked and
 * dropped. The page stops the worker when the tool closes.
 */
import { estimate } from "./estimator";
import type { StrengthSummary } from "./logic";

export interface StrengthRequest {
    id: number;
    password: string;
}

export interface StrengthResponse {
    id: number;
    summary: StrengthSummary;
}

self.addEventListener("message", (event: MessageEvent<StrengthRequest>) => {
    const { id, password } = event.data;
    const response: StrengthResponse = { id, summary: estimate(password) };
    self.postMessage(response);
});

// Build the dictionaries at once, so the first check is fast. Message 0
// tells the page that the worker is ready.
self.postMessage({ id: 0, summary: estimate("") } satisfies StrengthResponse);
