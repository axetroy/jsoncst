import { replace, ReplacePatch } from "./function/replace.js";
import { remove, DeletePatch } from "./function/delete.js";
import { insert, InsertPatch } from "./function/insert.js";
import { batch, BatchPatch, ExplicitReplacePatch, ExplicitDeletePatch, ExplicitInsertPatch } from "./function/batch.js";
import { formatValue } from "./value-helpers.js";

export {
	ReplacePatch,
	DeletePatch,
	InsertPatch,
	BatchPatch,
	ExplicitReplacePatch,
	ExplicitDeletePatch,
	ExplicitInsertPatch,
	replace,
	remove,
	insert,
	batch,
	formatValue,
};

interface JSONCTS {
	replace: typeof replace;
	remove: typeof remove;
	insert: typeof insert;
	batch: typeof batch;
	// Value formatting helper
	formatValue: typeof formatValue;
}

declare const jsoncts: JSONCTS;

export default jsoncts;
