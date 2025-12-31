import { replace } from "./function/replace.js";
import { remove } from "./function/delete.js";
import { insert } from "./function/insert.js";
import { batch } from "./function/batch.js";
import { formatValue } from "./value-helpers.js";

const jsoncst = {
	replace: replace,
	remove: remove,
	insert: insert,
	batch: batch,
	// Value formatting helper for better DX
	formatValue: formatValue,
};

export { replace, remove, insert, batch, formatValue };

export default jsoncst;
