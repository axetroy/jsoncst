import { Tokenizer } from "./Tokenizer.js";
import { CSTBuilder } from "./CSTBuilder.js";
import { resolvePath } from "./PathResolver.js";

function replace(sourceText, patches) {
	const tokenizer = new Tokenizer(sourceText);
	const tokens = tokenizer.tokenize();

	const builder = new CSTBuilder(tokens);
	const root = builder.build();

	// 倒叙替换
	const reverseNodes = patches
		.map((patch) => {
			const node = resolvePath(root, patch.path, sourceText);

			return {
				node,
				patch,
			};
		})
		.filter((v) => v.node)
		.sort((a, b) => b.node.start - a.node.start);

	// 确保不会冲突
	reverseNodes.reduce((lastEnd, { node }) => {
		if (node.end > lastEnd) {
			throw new Error(`Patch conflict at path: ${node.path}`);
		}

		return node.start;
	}, Infinity);

	let result = sourceText;

	for (const { node, patch } of reverseNodes) {
		result = result.slice(0, node.start) + patch.value + result.slice(node.end);
	}

	return result;
}

function remove(sourceText, patches) {
	const tokenizer = new Tokenizer(sourceText);
	const tokens = tokenizer.tokenize();

	const builder = new CSTBuilder(tokens);
	const root = builder.build();

	// Collect delete operations with their positions
	const deleteOps = patches
		.map((patch) => {
			const pathParts = parsePath(patch.path);
			if (pathParts.length === 0) {
				return null; // Cannot delete root
			}

			// Find parent and the item to delete
			const parentPath = pathParts.slice(0, -1);
			const lastKey = pathParts[pathParts.length - 1];
			const parentNode = parentPath.length > 0 ? resolvePath(root, parentPath, sourceText) : root;

			if (!parentNode) return null;

			// Get the actual range to delete
			const deleteRange = getDeleteRange(parentNode, lastKey, sourceText);
			if (!deleteRange) return null;

			return {
				start: deleteRange.start,
				end: deleteRange.end,
			};
		})
		.filter((v) => v !== null)
		.sort((a, b) => b.start - a.start); // Sort in reverse order

	let result = sourceText;

	// Apply deletions in reverse order
	for (const { start, end } of deleteOps) {
		result = result.slice(0, start) + result.slice(end);
	}

	return result;
}

function insert(sourceText, patches) {
	const tokenizer = new Tokenizer(sourceText);
	const tokens = tokenizer.tokenize();

	const builder = new CSTBuilder(tokens);
	const root = builder.build();

	// 倒叙插入
	const reverseNodes = patches
		.map((patch) => {
			const node = resolvePath(root, patch.path, sourceText);
			return {
				node,
				patch,
			};
		})
		.filter((v) => v.node)
		.sort((a, b) => b.node.start - a.node.start);

	let result = sourceText;

	for (const { node, patch } of reverseNodes) {
		result = insertIntoNode(result, node, patch, sourceText);
	}

	return result;
}

// Helper functions
function parsePath(path) {
	if (Array.isArray(path)) return path;
	
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

		if (ch === ".") {
			i++;
			continue;
		}

		if (ch === "[") {
			i++;
			let num = "";
			while (i < path.length && path[i] !== "]") {
				num += path[i++];
			}
			i++;
			result.push(Number(num));
			continue;
		}

		let name = "";
		while (i < path.length && /[a-zA-Z0-9_$-]/.test(path[i])) {
			name += path[i++];
		}
		if (name) {
			result.push(name);
		}
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

function getDeleteRange(parentNode, key, sourceText) {
	if (parentNode.type === "Object") {
		return getObjectPropertyDeleteRange(parentNode, key, sourceText);
	} else if (parentNode.type === "Array") {
		return getArrayElementDeleteRange(parentNode, key, sourceText);
	}
	return null;
}

function getObjectPropertyDeleteRange(objectNode, key, sourceText) {
	let propIndex = -1;
	for (let i = 0; i < objectNode.properties.length; i++) {
		const keyStr = extractString(objectNode.properties[i].key, sourceText);
		if (keyStr === key) {
			propIndex = i;
			break;
		}
	}

	if (propIndex === -1) return null;

	const prop = objectNode.properties[propIndex];
	let deleteStart = prop.key.start;
	let deleteEnd = prop.value.end;

	// Handle comma and whitespace
	if (propIndex < objectNode.properties.length - 1) {
		// Not the last property, look for comma after
		let pos = deleteEnd;
		while (pos < sourceText.length && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
			pos++;
		}
		if (sourceText[pos] === ',') {
			deleteEnd = pos + 1;
			// Skip trailing whitespace after comma
			while (deleteEnd < sourceText.length && (sourceText[deleteEnd] === ' ' || sourceText[deleteEnd] === '\t' || sourceText[deleteEnd] === '\n' || sourceText[deleteEnd] === '\r')) {
				deleteEnd++;
			}
		}
	} else if (propIndex > 0) {
		// Last property, look for comma before (and whitespace before the comma)
		let pos = deleteStart - 1;
		// Skip whitespace before the property
		while (pos >= 0 && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
			pos--;
		}
		if (sourceText[pos] === ',') {
			// Also skip whitespace before the comma
			let commaPos = pos;
			pos--;
			while (pos >= 0 && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
				pos--;
			}
			deleteStart = pos + 1;
		}
	}

	return { start: deleteStart, end: deleteEnd };
}

function getArrayElementDeleteRange(arrayNode, index, sourceText) {
	if (typeof index !== "number" || index < 0 || index >= arrayNode.elements.length) {
		return null;
	}

	const element = arrayNode.elements[index];
	let deleteStart = element.start;
	let deleteEnd = element.end;

	// Handle comma and whitespace
	if (index < arrayNode.elements.length - 1) {
		// Not the last element, look for comma after
		let pos = deleteEnd;
		while (pos < sourceText.length && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
			pos++;
		}
		if (sourceText[pos] === ',') {
			deleteEnd = pos + 1;
			// Skip trailing whitespace after comma
			while (deleteEnd < sourceText.length && (sourceText[deleteEnd] === ' ' || sourceText[deleteEnd] === '\t' || sourceText[deleteEnd] === '\n' || sourceText[deleteEnd] === '\r')) {
				deleteEnd++;
			}
		}
	} else if (index > 0) {
		// Last element, look for comma before (and whitespace before the comma)
		let pos = deleteStart - 1;
		// Skip whitespace before the element
		while (pos >= 0 && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
			pos--;
		}
		if (sourceText[pos] === ',') {
			// Also skip whitespace before the comma
			let commaPos = pos;
			pos--;
			while (pos >= 0 && (sourceText[pos] === ' ' || sourceText[pos] === '\t' || sourceText[pos] === '\n' || sourceText[pos] === '\r')) {
				pos--;
			}
			deleteStart = pos + 1;
		}
	}

	return { start: deleteStart, end: deleteEnd };
}

function extractString(stringNode, sourceText) {
	const raw = sourceText.slice(stringNode.start + 1, stringNode.end - 1);
	return raw.replace(/\\(.)/g, (_, ch) => {
		switch (ch) {
			case '"': return '"';
			case "\\": return "\\";
			case "/": return "/";
			case "b": return "\b";
			case "f": return "\f";
			case "n": return "\n";
			case "r": return "\r";
			case "t": return "\t";
			default: return ch;
		}
	});
}

function insertIntoNode(sourceText, node, patch, originalSource) {
	if (node.type === "Object") {
		return insertObjectProperty(sourceText, node, patch, originalSource);
	} else if (node.type === "Array") {
		return insertArrayElement(sourceText, node, patch, originalSource);
	}
	return sourceText;
}

function insertObjectProperty(sourceText, objectNode, patch, originalSource) {
	if (!patch.key) {
		throw new Error("Insert into object requires 'key' property");
	}

	// Check if key already exists
	for (const prop of objectNode.properties) {
		const keyStr = extractString(prop.key, originalSource);
		if (keyStr === patch.key) {
			throw new Error(`Key "${patch.key}" already exists in object`);
		}
	}

	const newEntry = `"${patch.key}": ${patch.value}`;

	if (objectNode.properties.length === 0) {
		// Empty object
		const insertPos = objectNode.start + 1;
		return sourceText.slice(0, insertPos) + newEntry + sourceText.slice(insertPos);
	} else {
		// Insert after last property
		const lastProp = objectNode.properties[objectNode.properties.length - 1];
		const insertPos = lastProp.value.end;
		return sourceText.slice(0, insertPos) + ", " + newEntry + sourceText.slice(insertPos);
	}
}

function insertArrayElement(sourceText, arrayNode, patch, originalSource) {
	const position = patch.position !== undefined ? patch.position : arrayNode.elements.length;

	if (position < 0 || position > arrayNode.elements.length) {
		throw new Error(`Invalid position ${position} for array of length ${arrayNode.elements.length}`);
	}

	if (arrayNode.elements.length === 0) {
		// Empty array
		const insertPos = arrayNode.start + 1;
		return sourceText.slice(0, insertPos) + patch.value + sourceText.slice(insertPos);
	} else if (position === 0) {
		// Insert at the beginning
		const insertPos = arrayNode.elements[0].start;
		return sourceText.slice(0, insertPos) + patch.value + ", " + sourceText.slice(insertPos);
	} else if (position >= arrayNode.elements.length) {
		// Insert at the end
		const lastElement = arrayNode.elements[arrayNode.elements.length - 1];
		const insertPos = lastElement.end;
		return sourceText.slice(0, insertPos) + ", " + patch.value + sourceText.slice(insertPos);
	} else {
		// Insert in the middle
		const insertPos = arrayNode.elements[position].start;
		return sourceText.slice(0, insertPos) + patch.value + ", " + sourceText.slice(insertPos);
	}
}

const jsoncst = {
	replace: replace,
	remove: remove,
	insert: insert,
};

export { replace, remove, insert };
export default jsoncst;
