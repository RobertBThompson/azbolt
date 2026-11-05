import { browser } from '$app/environment';
import { computePosition } from '../data/instrument.js';

/**
 * The user's own position lives only in their browser for now.
 *
 * Private by default is a product rule, not a convenience: nothing here
 * is sent anywhere, and only the derived bin would ever be shared — and
 * then anonymously, to balance a QC quorum.
 *
 * localStorage throws in private windows and with site data blocked, and
 * each app subdomain is its own origin, so every access is guarded.
 */
const KEY = 'lip.position.v1';

/**
 * @typedef {object} StoredPosition
 * @property {Record<string, string>} answers
 * @property {number} fiscal
 * @property {number} social
 * @property {number} coverage
 * @property {string} instrumentVersion
 * @property {string} completedAt  ISO date
 */

/** @returns {StoredPosition | null} */
export function loadPosition() {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		// Guard against a half-written or hand-edited value.
		if (typeof parsed?.fiscal !== 'number' || typeof parsed?.social !== 'number') return null;
		return parsed;
	} catch {
		return null;
	}
}

/**
 * @param {Record<string, string>} answers
 * @returns {StoredPosition | null} the stored value, or null if it could not be saved
 */
export function savePosition(answers) {
	const computed = computePosition(answers);
	/** @type {StoredPosition} */
	const record = { answers, ...computed, completedAt: new Date().toISOString() };
	if (!browser) return record;
	try {
		localStorage.setItem(KEY, JSON.stringify(record));
		return record;
	} catch {
		// Storage unavailable. The caller still gets the computed position so
		// the session works; it just will not survive a reload.
		return record;
	}
}

export function clearPosition() {
	if (!browser) return;
	try {
		localStorage.removeItem(KEY);
	} catch {
		/* nothing to do */
	}
}
