import { ReplacePatch } from "./replace.js";
import { DeletePatch } from "./delete.js";
import { InsertPatch } from "./insert.js";

export type BatchPatch = ReplacePatch | DeletePatch | InsertPatch;

/**
 * Applies a batch of patches to the source text.
 * @param sourceText - The original source text.
 * @param patches - An array of patches to apply.
 * @returns The modified source text after applying all patches.
 */
export declare function batch(sourceText: string, patches: Array<BatchPatch>): string;
