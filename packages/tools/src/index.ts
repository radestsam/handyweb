import { coreVersion } from "@handyweb/core";

/** The metadata of every tool. It is empty until the registry exists (T0.9). */
export const catalog: readonly unknown[] = [];

/** The core version that the tools package was built against. */
export const builtWithCore = coreVersion;
