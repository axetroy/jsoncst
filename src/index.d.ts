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

interface DeletePatch {
	/**
	 * A JSON path to delete.
	 */
	path: string;
}

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
	 */
	position?: number;
	/**
	 * For object insertion: the key name for the new property.
	 */
	key?: string;
}

declare function replace(sourceText: string, patches: Array<Patch>): string;
declare function remove(sourceText: string, patches: Array<DeletePatch>): string;
declare function insert(sourceText: string, patches: Array<InsertPatch>): string;

export { replace, remove, insert, Patch, DeletePatch, InsertPatch };

interface JSONCTS {
	replace: typeof replace;
	remove: typeof remove;
	insert: typeof insert;
}

declare const jsoncts: JSONCTS;

export default jsoncts;
