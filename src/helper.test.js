import { describe, test } from "node:test";
import { parsePath, extractString } from "./helper.js";
import { Tokenizer } from "./Tokenizer.js";
import { CSTBuilder } from "./CSTBuilder.js";
import { resolvePath } from "./PathResolver.js";
import assert from "node:assert";

describe("parsePath", () => {
	test("should parse dot paths correctly", () => {
		const path1 = "a.b.c";
		const result1 = parsePath(path1);
		console.assert(JSON.stringify(result1) === JSON.stringify(["a", "b", "c"]), `Failed on path: ${path1}`);
	});

	test("should parse JSON Pointer paths correctly", () => {
		const path2 = "/a/b/c";
		const result2 = parsePath(path2);
		console.assert(JSON.stringify(result2) === JSON.stringify(["a", "b", "c"]), `Failed on path: ${path2}`);
	});

	test("should parse mixed paths correctly", () => {
		const path3 = "a.b[0].c";
		const result3 = parsePath(path3);
		console.assert(JSON.stringify(result3) === JSON.stringify(["a", "b", 0, "c"]), `Failed on path: ${path3}`);
	});

	test("should parse complex JSON Pointer paths correctly", () => {
		const path4 = "/a/b[0]/c";
		const result4 = parsePath(path4);
		console.assert(JSON.stringify(result4) === JSON.stringify(["a", "b", 0, "c"]), `Failed on path: ${path4}`);
	});
});

describe("extractString", () => {
	test("should extract string values correctly", () => {
		const obj = {
			name: "Test",
			details: {
				description: "This is a test",
				tags: ["sample", "test", 123],
			},
			count: 42,
		};

		const sourceText = JSON.stringify(obj);

		const tokens = new Tokenizer(sourceText).tokenize();

		const root = new CSTBuilder(tokens).build();

		const node = resolvePath(root, "/details/tags/0", sourceText);

		assert.ok(node !== null);

		const result = extractString(node, sourceText);

		assert.strictEqual(result, "sample");
	});
});
