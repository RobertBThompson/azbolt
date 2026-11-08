import { pb } from './pb.js';

/**
 * Chief's session, mirrored out of the PocketBase auth store into runes.
 *
 * The SDK's auth store is not reactive, so components reading
 * `pb.authStore.record` directly would never re-render on sign-in. This
 * subscribes once and republishes the same state as `$state`, which is
 * the only thing the UI should read.
 */
class Session {
	/** @type {Record<string, any>|null} */
	user = $state(null);
	/** Set while a sign-in or sign-up request is in flight. */
	busy = $state(false);
	/** @type {string} Last failure, in words a person can act on. */
	error = $state('');

	constructor() {
		this.user = pb.authStore.record ?? null;
		// fireImmediately is false: the line above already did it, and
		// calling back during construction would assign before `user` exists.
		pb.authStore.onChange(() => {
			this.user = pb.authStore.record ?? null;
		});
	}

	get signedIn() {
		return this.user !== null;
	}

	/** Display name for the signed-in user, falling back to the email local part. */
	get label() {
		if (!this.user) return '';
		return this.user.name || String(this.user.email ?? '').split('@')[0] || 'Signed in';
	}

	/**
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<boolean>} true when the session is live
	 */
	async signIn(email, password) {
		return this.#attempt(() => pb.collection('users').authWithPassword(email, password));
	}

	/**
	 * Creates the account and signs straight into it. Chief has one user
	 * per install in practice, so a separate "now go and log in" step
	 * would be ceremony with nothing behind it.
	 *
	 * @param {string} email
	 * @param {string} password
	 */
	async signUp(email, password) {
		return this.#attempt(async () => {
			await pb.collection('users').create({
				email,
				password,
				passwordConfirm: password,
				emailVisibility: false
			});
			await pb.collection('users').authWithPassword(email, password);
		});
	}

	signOut() {
		pb.authStore.clear();
		this.error = '';
	}

	/** @param {() => Promise<unknown>} run */
	async #attempt(run) {
		this.busy = true;
		this.error = '';
		try {
			await run();
			return true;
		} catch (/** @type {any} */ err) {
			this.error = readableError(err);
			return false;
		} finally {
			this.busy = false;
		}
	}
}

/**
 * PocketBase returns field-level validation in `response.data`, and its
 * top-level message is usually just "Failed to authenticate." On its own
 * that tells someone nothing about which field was wrong.
 *
 * @param {any} err
 */
function readableError(err) {
	const fields = err?.response?.data ?? err?.data?.data;
	if (fields && typeof fields === 'object') {
		const first = Object.entries(fields)[0];
		if (first) {
			const [name, detail] = first;
			const message = /** @type {any} */ (detail)?.message;
			if (message) return `${name}: ${message}`;
		}
	}
	if (err?.status === 400) return 'Those credentials were not accepted.';
	if (err?.status === 0) return 'Could not reach the server.';
	return err?.message || 'Something went wrong.';
}

export const session = new Session();
