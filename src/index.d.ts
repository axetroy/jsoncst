import { replace, ReplacePatch } from "./function/replace.js";
import { remove, DeletePatch } from "./function/delete.js";
import { insert, InsertPatch } from "./function/insert.js";
import { batch, BatchPatch } from "./function/batch.js";

export { ReplacePatch, DeletePatch, InsertPatch, BatchPatch, replace, remove, insert, batch };
interface JSONCTS {
	replace: typeof replace;
	remove: typeof remove;
	insert: typeof insert;
	batch: typeof batch;
}

declare const jsoncts: JSONCTS;

export default jsoncts;
