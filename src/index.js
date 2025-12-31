import { replace } from "./function/replace.js";
import { remove } from "./function/delete.js";
import { insert } from "./function/insert.js";
import { batch } from "./function/batch.js";
import { formatValue } from "./value-helpers.js";
import { jsonmod, JsonMod } from "./JsonMod.js";

// Keep old API for backward compatibility
const jsoncst = {
	replace: replace,
	remove: remove,
	insert: insert,
	batch: batch,
	// Value formatting helper for better DX
	formatValue: formatValue,
};

// Export new chainable API as default
export default jsonmod;

// Export old API for backward compatibility
export { replace, remove, insert, batch, formatValue };

// Export new API
export { jsonmod, JsonMod };
