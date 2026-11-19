/**
 * The Action tab's records, read once and shared by its screens.
 *
 * Signed in, they are the account's own. Signed out, the samples. A
 * signed-in read that fails leaves the lists empty and says so.
 */
import { pb, readWork } from './pb.js';

/**
 * @type {{
 *   tasks: import('./work.js').Task[],
 *   endeavors: import('./work.js').Endeavor[],
 *   orgs: import('./work.js').WorkOrg[],
 *   source: import('./pb.js').Source, error: string, loaded: boolean
 * }}
 */
export const work = $state({
	tasks: [],
	endeavors: [],
	orgs: [],
	source: 'fixture',
	error: '',
	loaded: false
});

let loadedFor = '';
const account = () => (pb.authStore.isValid ? (pb.authStore.record?.id ?? '') : '');

/** Whether what is typed here will be kept. */
export const kept = () => work.source === 'live';

/** Read the records if they have not been read for this account. */
export async function open() {
	if (work.loaded && loadedFor === account()) return;
	await load();
}

/** Read them again, after something changed. */
export async function load() {
	const who = account();
	const { data, source, error } = await readWork();
	work.tasks = data.tasks;
	work.endeavors = data.endeavors;
	work.orgs = data.orgs;
	work.source = source;
	work.error = error ?? '';
	work.loaded = true;
	loadedFor = who;
}

/** @param {string} id */
export const taskOf = (id) => work.tasks.find((t) => t.id === id) ?? null;
/** @param {string} id */
export const endeavorOf = (id) => work.endeavors.find((e) => e.id === id) ?? null;
/** @param {string} id */
export const orgOf = (id) => work.orgs.find((o) => o.id === id) ?? null;
