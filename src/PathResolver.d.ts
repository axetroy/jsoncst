import { Node } from "./CSTBuilder.js";

type Path = string | Array<string>;

/**
 * Resolve a path within a JSON CST.
 * @param root - The root node of the JSON CST.
 * @param path - The path to resolve, either as a dot-separated string or an array of strings.
 * @param sourceText - The original JSON source text.
 * @returns The node at the specified path, or null if not found.
 * @example
 */
export declare function resolvePath(root: Node, path: Path, sourceText: string): Node | null;
