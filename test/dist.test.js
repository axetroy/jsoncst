import test, { before } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");

before(() => {
	execSync("npm run build", {
		cwd: rootDir,
		stdio: "inherit",
	});
});

test("test esm output", () => {
	const targetDir = path.join(rootDir, "fixtures", "esm");

	execSync("yarn", { cwd: targetDir, stdio: "inherit" });

	const output = execSync("npm run test --no-color", {
		cwd: targetDir,
		stdio: "pipe",
		env: {
			PATH: process.env.PATH,
			NO_COLOR: "1",
		},
	});

	const outputStr = output.toString();
	// Check that the output contains the expected exports
	// The default export is jsonmod function
	assert.match(outputStr, /\[Function: jsonmod\]/);
	// formatValue is available as named export
	assert.match(outputStr, /\[Function:.*formatValue.*\]/);
});

test("test cjs output", () => {
	const targetDir = path.join(rootDir, "fixtures", "cjs");

	execSync("yarn", { cwd: targetDir, stdio: "inherit" });

	const output = execSync("npm run test --no-color", {
		cwd: targetDir,
		stdio: "pipe",
		env: {
			PATH: process.env.PATH,
			NO_COLOR: "1",
		},
	});

	const outputStr = output.toString();
	// Check that the output contains the expected exports
	assert.match(outputStr, /\[Function: jsonmod\]/);
	assert.match(outputStr, /\[Function:.*formatValue.*\]/);
});
