/**
 * Reading an amount a person typed.
 *
 * The confirm screen used to do `Number(text) || 1240`, which turned a
 * zero, a stray letter and an empty box alike into $1,240 of someone
 * else's money. Nothing here invents a figure: text that is not an
 * amount comes back as null, and the screen says so.
 */

/**
 * @param {string} text  what was typed, with or without $ and commas
 * @returns {number | null}  the amount in dollars, or null if it is not one
 */
export function readAmount(text) {
	const cleaned = String(text)
		.trim()
		.replace(/[$,\s]/g, '');
	if (cleaned === '') return null;
	if (!/^-?\d*\.?\d+$/.test(cleaned)) return null;
	const n = Number(cleaned);
	if (!Number.isFinite(n)) return null;
	/* Direction is a separate choice on these screens, so a minus sign
	   here would quietly contradict it. */
	if (n < 0) return null;
	return Math.round(n * 100) / 100;
}
