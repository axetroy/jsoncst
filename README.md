# json-codemod

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![Node](https://img.shields.io/badge/node-%3E=14-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/json-codemod.svg)](https://badge.fury.io/js/json-codemod)

A utility to patch JSON strings while preserving the original formatting, including comments and whitespace.

## ✨ Features

-   🎨 **Format Preservation** - Maintains comments, whitespace, and original formatting
-   🔄 **Precise Modifications** - Replace, delete, and insert values while leaving everything else intact
-   ⚡ **Unified Patch API** - Apply multiple operations efficiently in a single call
-   🚀 **Fast & Lightweight** - Zero dependencies, minimal footprint
-   📦 **Dual module support** - Works with both ESM and CommonJS
-   💪 **TypeScript Support** - Full type definitions included
-   🎯 **Flexible Path Syntax** - Supports both dot notation and JSON Pointer

## 📦 Installation

```bash
npm install json-codemod
```

Or using other package managers:

```bash
yarn add json-codemod
# or
pnpm add json-codemod
```

## 🚀 Quick Start

### Using Patch (Recommended for Multiple Operations)

```js
import { batch } from "json-codemod";

const source = '{"name": "Alice", "age": 30, "items": [1, 2]}';

// Apply multiple operations at once (most efficient)
const result = batch(source, [
	{ path: "age", value: "31" }, // Replace
	{ path: "name" }, // Delete (no value means delete)
	{ path: "items", position: 2, value: "3" }, // Insert
]);

console.log(result);
// Output: {"age": 31, "items": [1, 2, 3]}
```

### Replace Values

```js
import { replace } from "json-codemod";

const source = '{"name": "Alice", "age": 30}';

// Replace a single value
const result = replace(source, [{ path: "age", value: "31" }]);

console.log(result);
// Output: {"name": "Alice", "age": 31}
```

### Delete Properties and Elements

```js
import { remove } from "json-codemod";

const source = '{"name": "Alice", "age": 30, "city": "Beijing"}';

// Delete a property
const result = remove(source, [{ path: "age" }]);

console.log(result);
// Output: {"name": "Alice", "city": "Beijing"}
```

### Insert Properties and Elements

```js
import { insert } from "json-codemod";

// Insert into object
const source1 = '{"name": "Alice"}';
const result1 = insert(source1, [{ path: "", key: "age", value: "30" }]);
console.log(result1);
// Output: {"name": "Alice", "age": 30}

// Insert into array
const source2 = '{"numbers": [1, 3, 4]}';
const result2 = insert(source2, [{ path: "numbers", position: 1, value: "2" }]);
console.log(result2);
// Output: {"numbers": [1, 2, 3, 4]}
```

### Preserving Format and Comments

```js
const source = `{
  // User information
  "name": "Alice",
  "age": 30, /* years old */
  "city": "Beijing"
}`;

const result = replace(source, [{ path: "age", value: "31" }]);

console.log(result);
// Output: {
//   // User information
//   "name": "Alice",
//   "age": 31, /* years old */
//   "city": "Beijing"
// }
```

## 📖 Usage Examples

### Replace Operations

#### Modifying Nested Objects

```js
const source = '{"user": {"name": "Alice", "profile": {"age": 30}}}';

const result = replace(source, [{ path: "user.profile.age", value: "31" }]);

// Result: {"user": {"name": "Alice", "profile": {"age": 31}}}
```

#### Modifying Array Elements

```js
const source = '{"scores": [85, 90, 95]}';

const result = replace(source, [{ path: "scores[1]", value: "92" }]);

// Result: {"scores": [85, 92, 95]}
```

#### Using JSON Pointer

```js
const source = '{"data": {"items": [1, 2, 3]}}';

const result = replace(source, [{ path: "/data/items/2", value: "99" }]);

// Result: {"data": {"items": [1, 2, 99]}}
```

#### Batch Modifications

```js
const source = '{"x": 1, "y": 2, "arr": [3, 4]}';

const result = replace(source, [
	{ path: "x", value: "10" },
	{ path: "y", value: "20" },
	{ path: "arr[0]", value: "30" },
]);

// Result: {"x": 10, "y": 20, "arr": [30, 4]}
```

#### Modifying String Values

```js
const source = '{"message": "Hello"}';

const result = replace(source, [{ path: "message", value: '"World"' }]);

// Result: {"message": "World"}
// Note: value needs to include quotes for strings
```

### Delete Operations

#### Deleting Object Properties

```js
import { remove } from "json-codemod";

const source = '{"name": "Alice", "age": 30, "city": "Beijing"}';

// Delete a single property
const result = remove(source, [{ path: "age" }]);

// Result: {"name": "Alice", "city": "Beijing"}
```

#### Deleting Array Elements

```js
const source = '{"items": [1, 2, 3, 4, 5]}';

// Delete an element by index
const result = remove(source, [{ path: "items[2]" }]);

// Result: {"items": [1, 2, 4, 5]}
```

#### Deleting Nested Properties

```js
const source = '{"user": {"name": "Alice", "age": 30, "email": "alice@example.com"}}';

const result = remove(source, [{ path: "user.email" }]);

// Result: {"user": {"name": "Alice", "age": 30}}
```

#### Batch Deletions

```js
const source = '{"a": 1, "b": 2, "c": 3, "d": 4}';

const result = remove(source, [{ path: "b" }, { path: "d" }]);

// Result: {"a": 1, "c": 3}
```

### Insert Operations

#### Inserting into Objects

```js
import { insert } from "json-codemod";

const source = '{"name": "Alice"}';

// Insert a new property (key is required for objects)
const result = insert(source, [{ path: "", key: "age", value: "30" }]);

// Result: {"name": "Alice", "age": 30}
```

#### Inserting into Arrays

```js
const source = '{"numbers": [1, 2, 4, 5]}';

// Insert at specific position
const result = insert(source, [{ path: "numbers", position: 2, value: "3" }]);

// Result: {"numbers": [1, 2, 3, 4, 5]}
```

#### Inserting at Array Start

```js
const source = '{"list": [2, 3, 4]}';

const result = insert(source, [{ path: "list", position: 0, value: "1" }]);

// Result: {"list": [1, 2, 3, 4]}
```

#### Appending to Array

```js
const source = '{"list": [1, 2, 3]}';

// Omit position to append at the end
const result = insert(source, [{ path: "list", value: "4" }]);

// Result: {"list": [1, 2, 3, 4]}
```

#### Inserting into Nested Structures

```js
const source = '{"data": {"items": [1, 2]}}';

// Insert into nested array
const result = insert(source, [{ path: "data.items", position: 1, value: "99" }]);

// Result: {"data": {"items": [1, 99, 2]}}
```

### Modifying Complex Values

```js
const source = '{"config": {"timeout": 3000}}';

// Replace with an object
const result1 = replace(source, [{ path: "config", value: '{"timeout": 5000, "retry": 3}' }]);

// Replace with an array
const result2 = replace(source, [{ path: "config", value: "[1, 2, 3]" }]);
```

### Handling Special Characters in Keys

Use JSON Pointer to handle keys with special characters:

```js
const source = '{"a/b": {"c~d": 5}}';

// In JSON Pointer:
// ~0 represents ~
// ~1 represents /
const result = replace(source, [{ path: "/a~1b/c~0d", value: "42" }]);

// Result: {"a/b": {"c~d": 42}}
```

## 📚 API Documentation

### `batch(sourceText, patches)` ⭐ Recommended

Applies multiple operations (replace, delete, insert) in a single call. This is the most efficient way to apply multiple changes as it only parses the source once.

#### Parameters

-   **sourceText** (`string`): The original JSON string
-   **patches** (`Array<ReplacePatch | DeletePatch | InsertPatch>`): Array of mixed operations to apply

#### Batch Types

The function automatically detects the operation type based on the batch properties:

```typescript
// Replace: has value but no key/position
{ path: string, value: string }

// Delete: no value, key, or position
{ path: string }

// Insert (object): has key and value
{ path: string, key: string, value: string }

// Insert (array): has position and value
{ path: string, position: number, value: string }
```

#### Return Value

Returns the modified JSON string with all patches applied.

#### Example

```js
const result = batch('{"a": 1, "b": 2, "items": [1, 2]}', [
	{ path: "a", value: "10" }, // Replace
	{ path: "b" }, // Delete
	{ path: "items", position: 2, value: "3" }, // Insert
]);
// Returns: '{"a": 10, "items": [1, 2, 3]}'
```

---

### `replace(sourceText, patches)`

Modifies values in a JSON string.

#### Parameters

-   **sourceText** (`string`): The original JSON string
-   **patches** (`Array<Patch>`): Array of modifications to apply

#### Patch Object

```typescript
interface Patch {
	/**
	 * A JSON path where the replacement should occur.
	 */
	path: string;
	/**
	 * The value to insert at the specified path.
	 */
	value: string;
}
```

#### Return Value

Returns the modified JSON string.

#### Error Handling

-   If a path doesn't exist, that modification is silently ignored without throwing an error
-   If multiple modifications have conflicting (overlapping) paths, an error is thrown

---

### `remove(sourceText, patches)`

Deletes properties from objects or elements from arrays in a JSON string.

#### Parameters

-   **sourceText** (`string`): The original JSON string
-   **patches** (`Array<DeletePatch>`): Array of deletions to apply

#### DeletePatch Object

```typescript
interface DeletePatch {
	/**
	 * A JSON path to delete.
	 */
	path: string;
}
```

#### Return Value

Returns the modified JSON string with specified paths removed.

#### Error Handling

-   If a path doesn't exist, the deletion is silently ignored
-   Whitespace and commas are automatically handled to maintain valid JSON

---

### `insert(sourceText, patches)`

Inserts new properties into objects or elements into arrays in a JSON string.

#### Parameters

-   **sourceText** (`string`): The original JSON string
-   **patches** (`Array<InsertPatch>`): Array of insertions to apply

#### InsertPatch Object

```typescript
interface InsertPatch {
	/**
	 * A JSON path where the insertion should occur.
	 * For arrays: the path should point to the array, and position specifies the index.
	 * For objects: the path should point to the object, and key specifies the property name.
	 */
	path: string;
	/**
	 * The value to insert.
	 */
	value: string;
	/**
	 * For array insertion: the index where to insert the value.
	 * If omitted, the value is appended to the end.
	 */
	position?: number;
	/**
	 * For object insertion: the key name for the new property.
	 * Required when inserting into objects.
	 */
	key?: string;
}
```

#### Return Value

Returns the modified JSON string with new values inserted.

#### Error Handling

-   For object insertions, `key` is required
-   For object insertions, if the key already exists, an error is thrown
-   For array insertions, position must be within valid bounds (0 to array.length)

---

### Path Syntax

Two path syntaxes are supported for all operations:

1. **Dot Notation** (recommended for simple cases)

    - Object properties: `"user.name"`
    - Array indices: `"items[0]"`
    - Nested paths: `"data.users[0].name"`

2. **JSON Pointer** (RFC 6901)
    - Format: starts with `/`
    - Object properties: `"/user/name"`
    - Array indices: `"/items/0"`
    - Escape sequences:
        - `~0` represents `~`
        - `~1` represents `/`
    - Example: `"/a~1b/c~0d"` refers to the `c~d` property of the `a/b` object

### Value Format

The `value` parameter must be a string representation of a JSON value:

-   Numbers: `"42"`, `"3.14"`
-   Strings: `'"hello"'` (must include quotes)
-   Booleans: `"true"`, `"false"`
-   null: `"null"`
-   Objects: `'{"key": "value"}'`
-   Arrays: `'[1, 2, 3]'`

## 🎯 Use Cases

### Configuration File Modification

Perfect for modifying configuration files with comments (like `tsconfig.json`, `package.json`, etc.):

```js
import { readFileSync, writeFileSync } from "fs";
import { replace, remove, insert } from "json-codemod";

// Read configuration file
const config = readFileSync("tsconfig.json", "utf-8");

// Modify configuration
const updated = replace(config, [
	{ path: "compilerOptions.target", value: '"ES2020"' },
	{ path: "compilerOptions.strict", value: "true" },
]);

// Save configuration (preserving original format and comments)
writeFileSync("tsconfig.json", updated);
```

### Managing Dependencies

```js
import { readFileSync, writeFileSync } from "fs";
import { insert, remove } from "json-codemod";

const pkg = readFileSync("package.json", "utf-8");

// Add a new dependency
const withNewDep = insert(pkg, [{ path: "dependencies", key: "lodash", value: '"^4.17.21"' }]);

// Remove a dependency
const cleaned = remove(pkg, [{ path: "dependencies.old-package" }]);

writeFileSync("package.json", cleaned);
```

### JSON Data Transformation

```js
// Batch update JSON data
const data = fetchDataAsString();

const updated = replace(data, [
	{ path: "metadata.version", value: '"2.0"' },
	{ path: "metadata.updatedAt", value: `"${new Date().toISOString()}"` },
]);
```

### Array Manipulation

```js
import { insert, remove } from "json-codemod";

const data = '{"tasks": ["task1", "task2", "task4"]}';

// Insert a task in the middle
const withTask = insert(data, [{ path: "tasks", position: 2, value: '"task3"' }]);

// Remove a completed task
const updated = remove(withTask, [{ path: "tasks[0]" }]);
```

### Automation Scripts

```js
// Automated version number updates
const pkg = readFileSync("package.json", "utf-8");
const version = "1.2.3";

const updated = replace(pkg, [{ path: "version", value: `"${version}"` }]);

writeFileSync("package.json", updated);
```

## 💻 TypeScript Support

The package includes full TypeScript type definitions:

```typescript
import { replace, remove, insert, Patch, DeletePatch, InsertPatch } from "json-codemod";

const source: string = '{"count": 0}';

// Replace
const patches: Patch[] = [{ path: "count", value: "1" }];
const result: string = replace(source, patches);

// Delete
const deletePatches: DeletePatch[] = [{ path: "count" }];
const deleted: string = remove(source, deletePatches);

// Insert
const insertPatches: InsertPatch[] = [{ path: "", key: "name", value: '"example"' }];
const inserted: string = insert(source, insertPatches);
```

## 🔧 How It Works

json-codemod uses Concrete Syntax Tree (CST) technology:

1. **Tokenization** (Tokenizer): Breaks down the JSON string into tokens, including values, whitespace, and comments
2. **Parsing** (CSTBuilder): Builds a syntax tree that preserves all formatting information
3. **Path Resolution** (PathResolver): Locates the node to modify based on the path
4. **Precise Replacement**: Replaces only the target value, preserving everything else

This approach ensures that everything except the modified values (including whitespace, comments, and formatting) remains unchanged.

## ❓ FAQ

### Q: Why does the value parameter need to be a string?

A: For flexibility and precision. You have complete control over the output format, including quotes, spacing, etc.

```js
// Numbers don't need quotes
replace(source, [{ path: "age", value: "30" }]);

// Strings need quotes
replace(source, [{ path: "name", value: '"Alice"' }]);

// You can control formatting
replace(source, [{ path: "data", value: '{\n  "key": "value"\n}' }]);
```

### Q: How are non-existent paths handled?

A: If a path doesn't exist, that modification is automatically ignored without throwing an error. The original string remains unchanged.

### Q: What JSON extensions are supported?

A: Supported:

-   ✅ Single-line comments `//`
-   ✅ Block comments `/* */`
-   ✅ All standard JSON syntax

Not supported:

-   ❌ Other JSON5 features (like unquoted keys, trailing commas, etc.)

### Q: How is the performance?

A: json-codemod is specifically designed for precise modifications with excellent performance. For large files (hundreds of KB), parsing and modification typically complete in milliseconds.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to the project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [Anti 996 License](LICENSE).

## 🔗 Links

-   [npm package](https://www.npmjs.com/package/json-codemod)
-   [GitHub repository](https://github.com/axetroy/json-codemod)
-   [Issue tracker](https://github.com/axetroy/json-codemod/issues)

## 🌟 Star History

If this project helps you, please give it a ⭐️!
