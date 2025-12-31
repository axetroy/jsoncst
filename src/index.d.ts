import { replace, ReplacePatch } from "./function/replace.js";
import { remove, DeletePatch } from "./function/delete.js";
import { insert, InsertPatch } from "./function/insert.js";
import { batch, BatchPatch, ExplicitReplacePatch, ExplicitDeletePatch, ExplicitInsertPatch } from "./function/batch.js";
import { formatValue } from "./value-helpers.js";
import { jsonmod, JsonMod } from "./JsonMod.js";

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
	jsonmod,
	JsonMod,
};

// New chainable API is the default export
export default jsonmod;
