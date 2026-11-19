// See https://svelte.dev/docs/kit/types#app
declare global {
	namespace App {
		/**
		 * A record that cannot be found carries the words a person needs:
		 * what was being looked for, and the list it belongs to.
		 */
		interface Error {
			message: string;
			what?: string;
			back?: string;
			backLabel?: string;
		}
	}
}

export {};
