import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as common from "@zxcvbn-ts/language-common";
import * as en from "@zxcvbn-ts/language-en";
import { MAX_LENGTH, type Score, type StrengthSummary } from "./logic";

let factory: ZxcvbnFactory | null = null;

/**
 * Estimates the strength of a password with zxcvbn-ts and all of its common
 * and English dictionaries. No translations are given, so the feedback comes
 * back as keys, and the UI shows its own Persian and English text.
 */
export function estimate(password: string): StrengthSummary {
    factory ??= new ZxcvbnFactory({
        dictionary: { ...common.dictionary, ...en.dictionary },
        graphs: common.adjacencyGraphs,
        useLevenshteinDistance: true,
    });
    const result = factory.check(password.slice(0, MAX_LENGTH));
    return {
        score: result.score as Score,
        guessesLog10: result.guessesLog10,
        seconds: {
            online: result.crackTimes.onlineNoThrottlingXPerSecond.seconds,
            offlineSlow: result.crackTimes.offlineSlowHashingXPerSecond.seconds,
            offlineFast: result.crackTimes.offlineFastHashingXPerSecond.seconds,
        },
        warning: result.feedback.warning || null,
        suggestions: result.feedback.suggestions,
    };
}
