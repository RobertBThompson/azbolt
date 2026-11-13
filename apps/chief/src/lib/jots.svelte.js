/**
 * The jot queue.
 *
 * Throw it used to empty the box and keep nothing, which is the one
 * thing the word promises not to do. A thrown jot is now written to
 * the server and is there tomorrow.
 *
 * It appears in the queue the moment it is thrown rather than when the
 * server answers, because a capture tool that makes you wait is one
 * you stop using mid-thought. The cost of that is that a write can
 * fail after the jot is on screen, so each one carries its own state
 * and a failed one says so and offers to go again. Nothing is ever
 * quietly dropped.
 *
 * Signed out, or with no server, jots live here for the session only
 * and the composer says so.
 */
import { listJots, writeJot } from './pb.js';

/**
 * @typedef {{
 *   id: string, text: string, meta: string, thrown: string,
 *   state: 'kept'|'saving'|'failed', fault: string
 * }} Jot
 */

/** @type {{ list: Jot[], source: import('./pb.js').Source, error: string, loaded: boolean }} */
export const jots = $state({ list: [], source: 'fixture', error: '', loaded: false });

/** Whether a thrown jot will outlive this session. */
export const kept = () => jots.source === 'live';

let seq = 0;

/** @param {string} iso */
function timeOf(iso) {
	const d = iso ? new Date(iso) : new Date();
	return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** @param {{ id: string, text: string, created?: string }} row @returns {Jot} */
function shape(row) {
	const at = timeOf(row.created ?? '');
	return {
		id: row.id,
		text: row.text,
		meta: `Untitled · all life · ${at}`,
		thrown: at,
		state: 'kept',
		fault: ''
	};
}

/** Read the queue once, and again whenever something asks. */
export async function load() {
	const { data, source, error } = await listJots();
	jots.list = data.map(shape);
	jots.source = source;
	jots.error = error ?? '';
	jots.loaded = true;
}

/**
 * Keep a thrown jot. It is in the list before the write finishes, and
 * tells the truth about itself either way.
 * @param {string} text
 */
export async function throwJot(text) {
	const body = text.trim();
	if (!body) return '';

	if (!kept()) {
		const jot = shape({ id: `j-local-${++seq}`, text: body });
		jots.list.unshift(jot);
		return jot.id;
	}

	const temp = `j-pending-${++seq}`;
	jots.list.unshift({ ...shape({ id: temp, text: body }), state: 'saving' });
	await send(temp, body);
	return temp;
}

/**
 * @param {string} tempId
 * @param {string} body
 */
async function send(tempId, body) {
	const at = jots.list.findIndex((j) => j.id === tempId);
	if (at < 0) return;
	try {
		const row = await writeJot(body);
		jots.list[at] = shape(row);
	} catch (/** @type {any} */ err) {
		jots.list[at] = {
			...jots.list[at],
			state: 'failed',
			fault: err?.message || 'The server did not answer.'
		};
	}
}

/** Try a failed write again. @param {string} id */
export function retry(id) {
	const jot = jots.list.find((j) => j.id === id);
	if (!jot || jot.state !== 'failed') return;
	jot.state = 'saving';
	jot.fault = '';
	return send(id, jot.text);
}

/** @param {string} id */
export function jotOf(id) {
	return jots.list.find((j) => j.id === id) ?? null;
}
