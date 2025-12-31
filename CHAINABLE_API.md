# New Chainable API

## Overview

Version 2.0.0 introduces a new chainable API that simplifies JSON modifications by allowing you to chain multiple operations together.

## Quick Start

### New Chainable API (Recommended)

```javascript
import jsonmod from "json-codemod";

const source = '{"name": "Alice", "age": 30, "items": [1, 2, 3]}';

const result = jsonmod(source)
  .replace("name", '"Bob"')
  .replace("age", "31")
  .delete("items[1]")
  .insert("items", 2, "4")
  .apply();

// Result: {"name": "Bob", "age": 31, "items": [1, 4, 3]}
```

### Benefits

- **Fluent API**: Chain operations naturally
- **Single export**: Only need to import `jsonmod`
- **Clear intent**: Operations are method names
- **Sequential execution**: Operations apply in order
- **Type-safe**: Full TypeScript support

## API Reference

### `jsonmod(sourceText)`

Creates a new JsonMod instance for chainable operations.

**Parameters:**
- `sourceText` (string): The JSON string to modify

**Returns:** `JsonMod` instance with chainable methods

### `.replace(path, value)`

Replace a value at the specified path.

**Parameters:**
- `path` (string | string[]): JSON path to the value
- `value` (string): New value as JSON string

**Returns:** `this` for chaining

**Example:**
```javascript
jsonmod(source)
  .replace("user.name", '"Bob"')
  .replace("user.age", "31")
  .apply();
```

### `.delete(path)` / `.remove(path)`

Delete a property or array element.

**Parameters:**
- `path` (string | string[]): JSON path to delete

**Returns:** `this` for chaining

**Example:**
```javascript
jsonmod(source)
  .delete("user.age")
  .remove("items[0]")  // remove is alias for delete
  .apply();
```

### `.insert(path, keyOrPosition, value)`

Insert a new property into an object or element into an array.

**Parameters:**
- `path` (string | string[]): JSON path to the container
- `keyOrPosition` (string | number): Property name (object) or index (array)
- `value` (string): Value to insert as JSON string

**Returns:** `this` for chaining

**Example:**
```javascript
// Insert into object
jsonmod(source)
  .insert("user", "email", '"test@example.com"')
  .apply();

// Insert into array
jsonmod(source)
  .insert("items", 0, '"newItem"')
  .apply();
```

### `.apply()`

Apply all queued operations and return the modified JSON string.

**Returns:** Modified JSON string

**Example:**
```javascript
const result = jsonmod(source)
  .replace("a", "1")
  .delete("b")
  .apply();  // Executes all operations
```

## Migration from Old API

### Old Functional API (Still Supported)

```javascript
import { batch } from "json-codemod";

const result = batch(source, [
  { operation: "replace", path: "a", value: "10" },
  { operation: "delete", path: "b" },
]);
```

### New Chainable API (Recommended)

```javascript
import jsonmod from "json-codemod";

const result = jsonmod(source)
  .replace("a", "10")
  .delete("b")
  .apply();
```

## Advanced Examples

### Complex Nested Operations

```javascript
import jsonmod from "json-codemod";

const config = jsonmod(configText)
  // Update compiler settings
  .replace("compilerOptions.target", '"ES2022"')
  .replace("compilerOptions.strict", "true")
  
  // Remove deprecated options
  .delete("compilerOptions.experimentalDecorators")
  
  // Add new options
  .insert("compilerOptions", "moduleResolution", '"bundler"')
  .insert("compilerOptions", "verbatimModuleSyntax", "true")
  
  .apply();
```

### Using with formatValue Helper

```javascript
import jsonmod, { formatValue } from "json-codemod";

const result = jsonmod(source)
  .replace("name", formatValue("Bob"))  // Auto quote handling
  .replace("age", formatValue(31))      // Numbers work too
  .replace("active", formatValue(true)) // Booleans
  .apply();
```

### Conditional Operations

```javascript
import jsonmod from "json-codemod";

let mod = jsonmod(source);

if (needsUpdate) {
  mod = mod.replace("version", '"2.0.0"');
}

if (removeOld) {
  mod = mod.delete("deprecated");
}

const result = mod.apply();
```

## TypeScript Support

Full TypeScript definitions are provided:

```typescript
import jsonmod, { JsonMod } from "json-codemod";

const instance: JsonMod = jsonmod(source);
const result: string = instance
  .replace("path", "value")
  .delete("other")
  .apply();
```

## Backward Compatibility

The old functional API (`replace`, `remove`, `insert`, `batch`) remains fully supported:

```javascript
import { replace, remove, insert, batch, formatValue } from "json-codemod";

// All old APIs still work
const result1 = replace(source, [{ path: "a", value: "1" }]);
const result2 = remove(source, [{ path: "b" }]);
const result3 = batch(source, [
  { operation: "replace", path: "c", value: "3" }
]);
```

## Performance

Operations are applied sequentially, re-parsing after each operation. This ensures:
- Correctness when operations affect each other
- Predictable behavior
- Format preservation

For best performance with many operations on independent paths, consider the `batch()` function from the old API.

## See Also

- [Main README](../README.md)
- [API Improvements](./API_IMPROVEMENTS.md)
- [Migration Guide](./MIGRATION.md)
