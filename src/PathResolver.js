import { extractString } from "./helper.js";

export function resolvePath(root, path, sourceText) {
	const parts = Array.isArray(path) ? path : parsePath(path);
	let node = root;

	for (const part of parts) {
		if (!node) return null;

		if (node.type === "Object") {
			node = resolveObjectProperty(node, part, sourceText);
		} else if (node.type === "Array") {
			node = resolveArrayElement(node, part);
		} else {
			return null;
		}
	}

	return node;
}

/**
 *
 * @param {import('./CSTBuilder.js').NodeObject} objectNode
 * @param {string} key
 * @param {string} sourceText
 * @returns {import('./CSTBuilder.js').Node | null}
 */
function resolveObjectProperty(objectNode, key, sourceText) {
	if (typeof key !== "string") return null;

	for (const prop of objectNode.properties) {
		const name = extractString(prop.key, sourceText);
		if (name === key) {
			return prop.value;
		}
	}
	return null;
}

/**
 *
 * @param {import('./CSTBuilder.js').NodeArray} arrayNode
 * @param {number} index
 * @returns {import('./CSTBuilder.js').Node | null}
 */
function resolveArrayElement(arrayNode, index) {
	if (typeof index !== "number") return null;
	return arrayNode.elements[index] || null;
}

function parsePath(path) {
	if (path.startsWith("/")) {
		return parseJSONPointer(path);
	}
	return parseDotPath(path);
}

function parseDotPath(path) {
	const result = [];
	let i = 0;

	while (i < path.length) {
		const ch = path[i];

		// skip dot
		if (ch === ".") {
			i++;
			continue;
		}

		// array index: [123]
		if (ch === "[") {
			i++;
			let num = "";
			while (i < path.length && path[i] !== "]") {
				num += path[i++];
			}
			i++; // skip ]
			result.push(Number(num));
			continue;
		}

		// identifier
		let name = "";
		while (i < path.length && /[a-zA-Z0-9_$]/.test(path[i])) {
			name += path[i++];
		}
		result.push(name);
	}

	return result;
}

function parseJSONPointer(pointer) {
	if (pointer === "") return [];

	if (pointer[0] !== "/") {
		throw new Error("Invalid JSON Pointer");
	}

	return pointer
		.slice(1)
		.split("/")
		.map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
		.map((seg) => {
			return /^\d+$/.test(seg) ? Number(seg) : seg;
		});
}
