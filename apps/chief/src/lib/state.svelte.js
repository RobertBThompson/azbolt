import { browser } from '$app/environment';

/**
 * Active sphere. Set by the sphere switcher (SH1). 'all' is every
 * sphere at once, and the default.
 *
 * Remembered per account, because coming back to All life every time
 * the app reloads makes the switch feel like it did not take. It is
 * kept in this browser rather than on the server: which sphere you are
 * looking through is a property of the moment, not of the records.
 */
export const shell = $state({ sphere: 'all' });

let key = 'azbolt.chief.sphere.anon';

/**
 * Point the memory at an account and read back what it was last
 * looking at. Called when sign-in settles, and again on sign-out.
 * @param {string|null} userId
 */
export function rememberSphereFor(userId) {
	key = `azbolt.chief.sphere.${userId ?? 'anon'}`;
	if (!browser) return;
	try {
		shell.sphere = localStorage.getItem(key) || 'all';
	} catch {
		shell.sphere = 'all';
	}
}

/** @param {string} sphere */
export function setSphere(sphere) {
	shell.sphere = sphere;
	if (!browser) return;
	try {
		localStorage.setItem(key, sphere);
	} catch {
		// A browser that will not keep it still switches for this session.
	}
}
