/**
 * The jot queue, for as long as Chief is open.
 *
 * Throw it used to empty the box and keep nothing, which is the one
 * thing the word promises not to do. Until there is a jots table on the
 * server, a thrown jot lives here: it joins the Sphere it queue, it
 * survives moving around the app, and it is gone when Chief is closed.
 * The composer says as much, so the loss is never a surprise.
 */
import { UNSPHERED } from './data.js';

/** @typedef {{ id: string, text: string, meta: string, thrown: string }} Jot */

/** @type {{ list: Jot[] }} */
export const jots = $state({
	list: Object.entries(UNSPHERED).map(([id, j]) => ({ id, ...j }))
});

let seq = 0;

/**
 * Keep a thrown jot and hand back its id, so the thrower can go
 * straight to it. A jot starts in all life: that is a real answer, not
 * a blank waiting to be filled.
 * @param {string} text
 * @returns {string}
 */
export function throwJot(text) {
	const body = text.trim();
	if (!body) return '';
	const id = `j-new-${++seq}`;
	const at = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
	jots.list.unshift({ id, text: body, meta: `Untitled · all life · ${at}`, thrown: at });
	return id;
}

/**
 * @param {string} id
 * @returns {Jot | null}
 */
export function jotOf(id) {
	return jots.list.find((j) => j.id === id) ?? null;
}
