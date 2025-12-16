# jsoncst

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![Node](https://img.shields.io/badge/node-%3E=14-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/jsoncst.svg)](https://badge.fury.io/js/jsoncst)

一个用于修改 JSON 字符串的工具库，能够在修改值的同时保留原始格式、注释和空白字符。

## ✨ 特性

- 🎨 **保留格式** - 完整保留注释、空白字符和原始格式
- 🔄 **精准修改** - 仅修改指定的值，其他内容保持不变
- 🚀 **快速轻量** - 零依赖，体积小巧
- 📦 **开箱即用** - 无需配置，简单易用
- 💪 **TypeScript 支持** - 完整的类型定义
- 🎯 **多种路径语法** - 支持点号路径和 JSON Pointer

## 📦 安装

```bash
npm install jsoncst
```

或使用其他包管理器：

```bash
yarn add jsoncst
# 或
pnpm add jsoncst
```

## 🚀 快速开始

### 基础用法

```js
import { replace } from "jsoncst";

const source = '{"name": "Alice", "age": 30}';

// 修改单个值
const result = replace(source, [
  { path: "age", value: "31" }
]);

console.log(result);
// 输出: {"name": "Alice", "age": 31}
```

### 保留格式和注释

```js
const source = `{
  // 用户信息
  "name": "Alice",
  "age": 30, /* 年龄 */
  "city": "Beijing"
}`;

const result = replace(source, [
  { path: "age", value: "31" }
]);

console.log(result);
// 输出: {
//   // 用户信息
//   "name": "Alice",
//   "age": 31, /* 年龄 */
//   "city": "Beijing"
// }
```

## 📖 使用示例

### 修改嵌套对象

```js
const source = '{"user": {"name": "Alice", "profile": {"age": 30}}}';

const result = replace(source, [
  { path: "user.profile.age", value: "31" }
]);

// 结果: {"user": {"name": "Alice", "profile": {"age": 31}}}
```

### 修改数组元素

```js
const source = '{"scores": [85, 90, 95]}';

const result = replace(source, [
  { path: "scores[1]", value: "92" }
]);

// 结果: {"scores": [85, 92, 95]}
```

### 使用 JSON Pointer

```js
const source = '{"data": {"items": [1, 2, 3]}}';

const result = replace(source, [
  { path: "/data/items/2", value: "99" }
]);

// 结果: {"data": {"items": [1, 2, 99]}}
```

### 批量修改多个值

```js
const source = '{"x": 1, "y": 2, "arr": [3, 4]}';

const result = replace(source, [
  { path: "x", value: "10" },
  { path: "y", value: "20" },
  { path: "arr[0]", value: "30" }
]);

// 结果: {"x": 10, "y": 20, "arr": [30, 4]}
```

### 修改字符串值

```js
const source = '{"message": "Hello"}';

const result = replace(source, [
  { path: "message", value: '"World"' }
]);

// 结果: {"message": "World"}
// 注意：value 需要包含引号
```

### 修改复杂值

```js
const source = '{"config": {"timeout": 3000}}';

// 替换为对象
const result1 = replace(source, [
  { path: "config", value: '{"timeout": 5000, "retry": 3}' }
]);

// 替换为数组
const result2 = replace(source, [
  { path: "config", value: '[1, 2, 3]' }
]);
```

### 处理特殊字符的键名

使用 JSON Pointer 处理包含特殊字符的键名：

```js
const source = '{"a/b": {"c~d": 5}}';

// 在 JSON Pointer 中：
// ~0 表示 ~
// ~1 表示 /
const result = replace(source, [
  { path: "/a~1b/c~0d", value: "42" }
]);

// 结果: {"a/b": {"c~d": 42}}
```

## 📚 API 文档

### `replace(sourceText, patches)`

修改 JSON 字符串中的值。

#### 参数

- **sourceText** (`string`): 原始 JSON 字符串
- **patches** (`Array<Patch>`): 要应用的修改数组

#### Patch 对象

```typescript
interface Patch {
  path: string;    // 值的路径
  value: string;   // 新值（字符串形式）
}
```

#### 路径语法

支持两种路径语法：

1. **点号路径**（推荐用于简单场景）
   - 对象属性：`"user.name"`
   - 数组索引：`"items[0]"`
   - 嵌套路径：`"data.users[0].name"`

2. **JSON Pointer**（RFC 6901）
   - 格式：以 `/` 开头
   - 对象属性：`"/user/name"`
   - 数组索引：`"/items/0"`
   - 转义字符：
     - `~0` 表示 `~`
     - `~1` 表示 `/`
   - 示例：`"/a~1b/c~0d"` 表示 `a/b` 对象的 `c~d` 属性

#### 值格式

`value` 参数必须是字符串形式的 JSON 值：

- 数字：`"42"`, `"3.14"`
- 字符串：`'"hello"'` (需要包含引号)
- 布尔值：`"true"`, `"false"`
- null：`"null"`
- 对象：`'{"key": "value"}'`
- 数组：`'[1, 2, 3]'`

#### 返回值

返回修改后的 JSON 字符串。

#### 错误处理

- 如果路径不存在，该修改会被忽略，不会抛出错误
- 如果多个修改的路径有冲突（重叠），会抛出错误

## 🎯 应用场景

### 配置文件修改

适合修改带注释的配置文件（如 `tsconfig.json`、`package.json` 等）：

```js
import { readFileSync, writeFileSync } from 'fs';
import { replace } from 'jsoncst';

// 读取配置文件
const config = readFileSync('tsconfig.json', 'utf-8');

// 修改配置
const updated = replace(config, [
  { path: "compilerOptions.target", value: '"ES2020"' },
  { path: "compilerOptions.strict", value: "true" }
]);

// 保存配置（保留了原始格式和注释）
writeFileSync('tsconfig.json', updated);
```

### JSON 数据转换

```js
// 批量更新 JSON 数据
const data = fetchDataAsString();

const updated = replace(data, [
  { path: "metadata.version", value: '"2.0"' },
  { path: "metadata.updatedAt", value: `"${new Date().toISOString()}"` }
]);
```

### 自动化脚本

```js
// 自动化更新版本号
const pkg = readFileSync('package.json', 'utf-8');
const version = '1.2.3';

const updated = replace(pkg, [
  { path: "version", value: `"${version}"` }
]);

writeFileSync('package.json', updated);
```

## 💻 TypeScript 支持

本包包含完整的 TypeScript 类型定义：

```typescript
import { replace } from "jsoncst";

interface Patch {
  path: string;
  value: string;
}

const source: string = '{"count": 0}';
const patches: Patch[] = [
  { path: "count", value: "1" }
];

const result: string = replace(source, patches);
```

## 🔧 工作原理

jsoncst 使用具体语法树（CST, Concrete Syntax Tree）技术：

1. **词法分析**（Tokenizer）：将 JSON 字符串分解为 tokens，包括值、空白字符、注释等
2. **语法分析**（CSTBuilder）：构建保留所有格式信息的语法树
3. **路径解析**（PathResolver）：根据路径定位要修改的节点
4. **精准替换**：仅替换目标值，保留其他所有内容

这种方式确保了除了被修改的值以外，其他所有内容（包括空白字符、注释、格式）都保持不变。

## ❓ 常见问题

### Q: 为什么 value 参数需要是字符串？

A: 为了保持灵活性和精确性。你可以完全控制输出格式，包括引号、空格等。

```js
// 数字不需要引号
replace(source, [{ path: "age", value: "30" }]);

// 字符串需要引号
replace(source, [{ path: "name", value: '"Alice"' }]);

// 可以控制格式
replace(source, [{ path: "data", value: '{\n  "key": "value"\n}' }]);
```

### Q: 如何处理不存在的路径？

A: 如果路径不存在，该修改会被自动忽略，不会抛出错误，原字符串保持不变。

### Q: 支持哪些 JSON 扩展语法？

A: 支持：
- ✅ 单行注释 `//`
- ✅ 块注释 `/* */`
- ✅ 所有标准 JSON 语法

不支持：
- ❌ JSON5 的其他特性（如无引号键名、尾随逗号等）

### Q: 性能如何？

A: jsoncst 是专门为精准修改而设计的，性能优秀。对于大型文件（数百 KB），解析和修改通常在毫秒级完成。

## 🤝 贡献指南

欢迎贡献！如果你想为项目做出贡献：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 [Anti 996 License](LICENSE) 许可证。

## 🔗 相关链接

- [npm 包](https://www.npmjs.com/package/jsoncst)
- [GitHub 仓库](https://github.com/axetroy/jsoncst)
- [问题反馈](https://github.com/axetroy/jsoncst/issues)

## 🌟 Star History

如果这个项目对你有帮助，请给它一个 ⭐️！
