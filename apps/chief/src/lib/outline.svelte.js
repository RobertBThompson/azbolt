/**
 * A RemNote-style outline, held as a flat list of { id, text, depth }.
 *
 * Flat-with-depth rather than nested children. Every operation here is
 * about a node *and everything under it* — indent, outdent, move, delete
 * — and on a flat list that is one contiguous slice, found by scanning
 * forward while depth is greater. The nested version of the same code
 * needs parent pointers and recursive splicing to do what a slice does
 * here, and gets the edge cases wrong more often.
 */

let seq = 0;
const nextId = () => `n${Date.now().toString(36)}${(seq++).toString(36)}`;

/** @typedef {{ id: string, text: string, depth: number }} Node */

/**
 * The end of the slice owned by the node at `i`, exclusive.
 * @param {Node[]} list @param {number} i
 */
export function subtreeEnd(list, i) {
	let j = i + 1;
	while (j < list.length && list[j].depth > list[i].depth) j++;
	return j;
}

/** @param {Node[]} list @param {string} id */
export const indexOf = (list, id) => list.findIndex((n) => n.id === id);

/**
 * Indent under the node above. Refused when there is nothing above, or
 * when the node above is already shallower — a node cannot be indented
 * more than one level past its own parent without skipping a generation.
 *
 * @param {Node[]} list @param {string} id
 */
export function indent(list, id) {
	const i = indexOf(list, id);
	if (i <= 0 || list[i].depth > list[i - 1].depth) return list;
	const end = subtreeEnd(list, i);
	return list.map((n, k) => (k >= i && k < end ? { ...n, depth: n.depth + 1 } : n));
}

/**
 * Outdent. Any following siblings deeper than the node become its
 * children, which is what an outliner is expected to do.
 *
 * @param {Node[]} list @param {string} id
 */
export function outdent(list, id) {
	const i = indexOf(list, id);
	if (i < 0 || list[i].depth === 0) return list;
	const end = subtreeEnd(list, i);
	return list.map((n, k) => (k >= i && k < end ? { ...n, depth: n.depth - 1 } : n));
}

/** @param {Node[]} list @param {string} id */
export function moveUp(list, id) {
	const i = indexOf(list, id);
	if (i <= 0) return list;
	const depth = list[i].depth;
	let prev = i - 1;
	while (prev >= 0 && list[prev].depth > depth) prev--;
	// Nothing above at this level, or the thing above is the parent.
	if (prev < 0 || list[prev].depth < depth) return list;
	const end = subtreeEnd(list, i);
	const block = list.slice(i, end);
	const rest = [...list.slice(0, i), ...list.slice(end)];
	return [...rest.slice(0, prev), ...block, ...rest.slice(prev)];
}

/** @param {Node[]} list @param {string} id */
export function moveDown(list, id) {
	const i = indexOf(list, id);
	if (i < 0) return list;
	const end = subtreeEnd(list, i);
	if (end >= list.length || list[end].depth < list[i].depth) return list;
	const after = subtreeEnd(list, end);
	const block = list.slice(i, end);
	return [...list.slice(0, i), ...list.slice(end, after), ...block, ...list.slice(after)];
}

/**
 * A new sibling, after everything the node owns.
 * @param {Node[]} list @param {string} id
 */
export function addAfter(list, id) {
	const i = indexOf(list, id);
	const node = { id: nextId(), text: '', depth: i < 0 ? 0 : list[i].depth };
	const at = i < 0 ? list.length : subtreeEnd(list, i);
	return { list: [...list.slice(0, at), node, ...list.slice(at)], id: node.id };
}

/**
 * Remove a node, promoting its children rather than taking them with it.
 * Deleting a parent should not silently destroy work filed under it.
 *
 * @param {Node[]} list @param {string} id
 */
export function remove(list, id) {
	const i = indexOf(list, id);
	if (i < 0) return list;
	const end = subtreeEnd(list, i);
	const promoted = list.slice(i + 1, end).map((n) => ({ ...n, depth: n.depth - 1 }));
	return [...list.slice(0, i), ...promoted, ...list.slice(end)];
}

/** @param {Node[]} list @param {string} id @param {string} text */
export function setText(list, id, text) {
	return list.map((n) => (n.id === id ? { ...n, text } : n));
}

/** @param {string} text @param {number} depth */
export const node = (text, depth) => ({ id: nextId(), text, depth });
