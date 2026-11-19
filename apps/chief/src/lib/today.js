/**
 * Today as YYYY-MM-DD, by the clock on the wall rather than UTC: a
 * figure entered at nine in the evening belongs to that day, not to
 * tomorrow.
 * @param {Date} [d]
 */
export function today(d = new Date()) {
	const two = (/** @type {number} */ n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
}
