import { openBook } from '$lib/book.svelte.js';
import { jots, load as loadJots } from '$lib/jots.svelte.js';
import { listPeople } from '$lib/pb.js';
import { open as openWork } from '$lib/work.svelte.js';

/** Search asks every kind of record at once, so every kind is read first. */
export async function load() {
	const [people] = await Promise.all([
		listPeople(),
		openWork(),
		openBook(),
		jots.loaded ? null : loadJots()
	]);
	return { people };
}
