import { Node } from "./CSTBuilder.js";

type Path = string | Array<string>;

declare function resolvePath(root: Node, path: Path): Node | null;

export { resolvePath };
