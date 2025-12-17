import { Node } from "./CSTBuilder.js";

/**
 * Parse a path string into an array of keys and indices.
 * @param path
 * @returns An array of strings and numbers representing the path.
 * @example
 * ```js
 * const pathArray = parsePath('a.b[0].c');
 * console.log(pathArray); // ['a', 'b', 0, 'c']
 * ```
 */
export declare function parsePath(path: string): Array<string | number>;

/**
 * Extract the string value from a CST node.
 * @param node - The CST node to extract the string from.
 * @param sourceText - The original source text.
 */
export declare function extractString(node: Node, sourceText: string): string;
