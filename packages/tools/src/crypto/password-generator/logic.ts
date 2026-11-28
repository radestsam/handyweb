import { ToolFailure } from "@handyweb/core/runtime";

/*
 * Every random choice comes from crypto.getRandomValues, through randomInt.
 * randomInt uses rejection sampling, so each value is equally likely (no
 * modulo bias). Math.random is never used.
 */

/** A source of random 32-bit values. Tests pass a fixed source. */
export type RandomSource = (values: Uint32Array<ArrayBuffer>) => Uint32Array<ArrayBuffer>;

export const cryptoSource: RandomSource = (values) => crypto.getRandomValues(values);

/** A uniform random integer in [0, max). */
export function randomInt(max: number, random: RandomSource = cryptoSource): number {
    if (!Number.isInteger(max) || max < 1 || max > 2 ** 32) throw new RangeError("max");
    // The largest multiple of max below 2^32. Values at or above it are drawn again.
    const limit = 2 ** 32 - (2 ** 32 % max);
    const buffer = new Uint32Array(1);
    for (;;) {
        const value = random(buffer)[0] as number;
        if (value < limit) return value % max;
    }
}

export const SETS = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    digits: "0123456789",
    // No quotes, backslash, or space: they break many forms and shells.
    symbols: "!#$%&()*+,-./:;<=>?@[]^_{|}~",
} as const;
export type SetName = keyof typeof SETS;
export const SET_NAMES: readonly SetName[] = ["lower", "upper", "digits", "symbols"];

/** Characters that look alike in many fonts. */
export const SIMILAR = "Il1|O0o";

export interface PasswordOptions {
    length: number;
    sets: Readonly<Record<SetName, boolean>>;
    /** Leave out characters that look alike, such as l, 1, I, O, and 0. */
    excludeSimilar: boolean;
}

export const DEFAULT_PASSWORD: PasswordOptions = {
    length: 20,
    sets: { lower: true, upper: true, digits: true, symbols: true },
    excludeSimilar: false,
};

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 128;

function fail(fa: string, en: string, detail: string): ToolFailure {
    return new ToolFailure("invalid-input", { fa, en }, detail);
}

function pools(options: PasswordOptions): string[] {
    return SET_NAMES.filter((name) => options.sets[name]).map((name) =>
        options.excludeSimilar
            ? [...SETS[name]].filter((char) => !SIMILAR.includes(char)).join("")
            : SETS[name],
    );
}

/**
 * A password with at least one character from each chosen set. A candidate
 * that misses a set is drawn again (rejection), so every valid password is
 * equally likely.
 */
export function generatePassword(
    options: PasswordOptions,
    random: RandomSource = cryptoSource,
): string {
    const { length } = options;
    if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
        throw fail(
            `درازا باید میان ${MIN_LENGTH} و ${MAX_LENGTH} باشد.`,
            `The length must be from ${MIN_LENGTH} to ${MAX_LENGTH}.`,
            "length",
        );
    }
    const chosen = pools(options);
    if (chosen.length === 0) {
        throw fail(
            "دست‌کم یک دسته نویسه را برگزینید.",
            "Choose at least one character set.",
            "no sets",
        );
    }
    const all = chosen.join("");
    for (;;) {
        let password = "";
        for (let i = 0; i < length; i++) password += all[randomInt(all.length, random)];
        if (chosen.every((pool) => [...pool].some((char) => password.includes(char)))) {
            return password;
        }
    }
}

/**
 * The strength in bits, as length × log2(pool size). The rule "one of each
 * set" makes the true value a little lower, by less than one bit for normal
 * lengths.
 */
export function passwordBits(options: PasswordOptions): number {
    const size = pools(options).join("").length;
    return size === 0 ? 0 : options.length * Math.log2(size);
}

export interface PassphraseOptions {
    words: number;
    separator: string;
    capitalize: boolean;
    /** Add one random digit to the end of one random word. */
    addDigit: boolean;
}

export const DEFAULT_PASSPHRASE: PassphraseOptions = {
    words: 6,
    separator: "-",
    capitalize: false,
    addDigit: false,
};

export const MIN_WORDS = 3;
export const MAX_WORDS = 20;

export function generatePassphrase(
    options: PassphraseOptions,
    wordList: readonly string[],
    random: RandomSource = cryptoSource,
): string {
    const { words } = options;
    if (!Number.isInteger(words) || words < MIN_WORDS || words > MAX_WORDS) {
        throw fail(
            `شمار واژه‌ها باید میان ${MIN_WORDS} و ${MAX_WORDS} باشد.`,
            `The number of words must be from ${MIN_WORDS} to ${MAX_WORDS}.`,
            "words",
        );
    }
    const picked = Array.from({ length: words }, () => {
        const word = wordList[randomInt(wordList.length, random)] as string;
        return options.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });
    if (options.addDigit) {
        const index = randomInt(words, random);
        picked[index] = `${picked[index] as string}${randomInt(10, random)}`;
    }
    return picked.join(options.separator);
}

/** words × log2(list size), plus log2(10 × words) for the added digit. */
export function passphraseBits(options: PassphraseOptions, listSize: number): number {
    const base = options.words * Math.log2(listSize);
    return options.addDigit ? base + Math.log2(10 * options.words) : base;
}

export type Strength = "weak" | "fair" | "strong" | "very-strong";

export function strength(bits: number): Strength {
    if (bits < 50) return "weak";
    if (bits < 70) return "fair";
    if (bits < 100) return "strong";
    return "very-strong";
}
