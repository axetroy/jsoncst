import { replace } from "./function/replace.js";
import { remove } from "./function/delete.js";
import { insert } from "./function/insert.js";
import { batch } from "./function/batch.js";

const jsoncst = {
	replace: replace,
	remove: remove,
	insert: insert,
	batch: batch,
};

export { replace, remove, insert, batch };

export default jsoncst;
