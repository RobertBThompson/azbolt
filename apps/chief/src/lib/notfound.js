import { error } from '@sveltejs/kit';

/**
 * Stop a screen that was asked for a record that is not there.
 *
 * Chief used to answer an unknown id with a different record of the
 * same kind: an unknown asset opened as a piece of artwork, an unknown
 * person as Carmen. The screen looked right, carried someone else's
 * figures, and said nothing. A guard in a load function is better than
 * a fallback in a component, because it keeps every page below it free
 * of null checks.
 *
 * @template T
 * @param {T | null | undefined} record
 * @param {string} what  the kind of record, in a sentence: 'asset', 'person'
 * @param {string} back  the list this record belongs to
 * @param {string} backLabel  what to call that list on the button
 * @returns {T}
 */
export function mustExist(record, what, back, backLabel) {
	if (record === null || record === undefined) {
		error(404, { message: `${what} not found`, what, back, backLabel });
	}
	return record;
}
