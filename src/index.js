import { replace } from "./function/replace.js";
import { remove } from "./function/delete.js";
import { insert } from "./function/insert.js";
import { Tokenizer } from "./Tokenizer.js";
import { CSTBuilder } from "./CSTBuilder.js";

const jsoncst = {
	replace: replace,
	remove: remove,
	insert: insert,
	patch: patch,
};

/**
 * Applies a mixed array of patches (replace, delete, insert) to a JSON string while preserving formatting, comments, and whitespace.
 * This function is more efficient than calling replace, remove, and insert separately as it parses the source only once.
 * 
 * @param {string} sourceText - The original JSON string to modify
 * @param {Array<{path: string, value?: string, key?: string, position?: number}>} patches - Array of patch operations to apply
 * @returns {string} The modified JSON string with all patches applied
 * 
 * @example
 * // Apply mixed operations in a single call
 * patch('{"a": 1, "b": 2, "c": [1, 2]}', [
 *   { path: "a", value: "10" },              // Replace
 *   { path: "b" },                           // Delete (no value/key means delete)
 *   { path: "c", position: 1, value: "99" }  // Insert
 * ]);
 * // Returns: '{"a": 10, "c": [1, 99, 2]}'
 * 
 * @example
 * // Mix different operation types
 * patch('{"user": {"name": "Alice", "age": 30}}', [
 *   { path: "user.name", value: '"Bob"' },        // Replace
 *   { path: "user.age" },                         // Delete
 *   { path: "user", key: "email", value: '"bob@example.com"' }  // Insert
 * ]);
 */
function patch(sourceText, patches) {
	// Parse the source text once
	const tokenizer = new Tokenizer(sourceText);
	const tokens = tokenizer.tokenize();
	const builder = new CSTBuilder(tokens);
	const root = builder.build();

	// Categorize patches by operation type
	const replacePatches = [];
	const deletePatches = [];
	const insertPatches = [];

	for (const p of patches) {
		// Determine patch type based on properties
		if (p.value !== undefined && p.key === undefined && p.position === undefined) {
			// Has value but no key/position -> replace operation
			replacePatches.push({ path: p.path, value: p.value });
		} else if (p.value === undefined && p.key === undefined && p.position === undefined) {
			// No value, key, or position -> delete operation
			deletePatches.push({ path: p.path });
		} else if ((p.key !== undefined || p.position !== undefined) && p.value !== undefined) {
			// Has key or position with value -> insert operation
			insertPatches.push(p);
		} else {
			// Invalid patch - skip it
			continue;
		}
	}

	// Apply patches in order: replace, insert, delete
	// This order ensures that replacements happen first, then inserts, then deletes
	let result = sourceText;

	// Apply replacements
	if (replacePatches.length > 0) {
		result = replace(result, replacePatches, root);
	}

	// Apply insertions
	if (insertPatches.length > 0) {
		// Need to re-parse if we did replacements
		const currentRoot = replacePatches.length > 0 ? null : root;
		result = insert(result, insertPatches, currentRoot);
	}

	// Apply deletions
	if (deletePatches.length > 0) {
		// Need to re-parse if we did replacements or insertions
		const currentRoot = replacePatches.length > 0 || insertPatches.length > 0 ? null : root;
		result = remove(result, deletePatches, currentRoot);
	}

	return result;
}

export { replace, remove, insert, patch };
export default jsoncst;
