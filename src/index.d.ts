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

declare function replace(sourceText: string, patches: Array<Patch>): string;

export { replace, Patch };

interface JSONCTS {
	replace: typeof replace;
}

declare const jsoncts: JSONCTS;

export default jsoncts;
