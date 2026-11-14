/**
 * Opens the asset book the Asset tab reads from.
 *
 * Signed in, it is the account's own records, turned into the shape
 * the arithmetic in assets.js already works on. Otherwise it is the
 * samples. A signed-in read that fails opens an empty book and says
 * so; it never falls back to the samples, which would look like
 * somebody's real figures.
 */
import { openOwnBook, openSampleBook } from './assets.js';
import { pb, readBook } from './pb.js';

const DAY = 86_400_000;

/** @type {{ source: import('./pb.js').Source, error: string }} */
export const book = $state({ source: 'fixture', error: '' });

/** Which account the open book belongs to, so a sign-in reopens it. */
let openFor = '';
let opened = false;

const account = () => (pb.authStore.isValid ? (pb.authStore.record?.id ?? '') : '');

/** Open the right book if it is not open already. */
export async function openBook() {
	if (opened && openFor === account()) return;
	await reopenBook();
}

/** Read the book again, after something in it was changed. */
export async function reopenBook() {
	const who = account();
	const { data, source, error } = await readBook();
	if (data && (source === 'live' || source === 'error')) openOwnBook(shape(data));
	else openSampleBook();
	book.source = source;
	book.error = error ?? '';
	openFor = who;
	opened = true;
}

/** @param {string} stamp */
const daysSince = (stamp) =>
	Math.max(0, Math.floor((Date.now() - new Date(stamp.replace(' ', 'T')).getTime()) / DAY));

/** @param {number} cents */
const dollarsOf = (cents) =>
	(cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/** @param {import('./pb.js').BookRows} rows */
function shape(rows) {
	/** @type {Record<string, import('./pb.js').ValuationRow[]>} */
	const byAsset = {};
	for (const v of rows.valuations) (byAsset[v.asset] ??= []).push(v);

	/** @type {Record<string, import('./assets.js').Asset>} */
	const assets = {};
	/** @type {{ asset: string, type: string, detail: string, age: number }[]} */
	const events = [];
	for (const r of rows.assets) {
		const history = byAsset[r.id] ?? [];
		const latest = history[history.length - 1] ?? null;
		assets[r.id] = {
			name: r.name,
			category: r.category || '',
			blurb: r.blurb ?? '',
			value: latest ? latest.amount : null,
			valuedDaysAgo: latest ? daysSince(latest.valued_on) : null,
			quantity: r.quantity || 1,
			rights: r.rights ?? '',
			period: r.period ?? '',
			tangibility: r.tangibility || 'Tangible',
			liquidity: r.liquidity || 'Not liquid',
			inventory: r.inventory || 'Not inventory',
			notes: r.notes ?? '',
			spheres: Array.isArray(r.spheres) ? r.spheres : [],
			claims: [],
			endeavors: [],
			storage: r.storage ?? '',
			units: r.units || 10_000,
			parent: r.parent || null,
			valuation: r.valuation === 'parts' ? 'parts' : 'whole',
			letGo: !!r.let_go
		};
		for (const v of history) {
			events.push({
				asset: r.id,
				type: 'Re-valued',
				detail: v.note ? `${dollarsOf(v.amount)} · ${v.note}` : dollarsOf(v.amount),
				age: daysSince(v.valued_on)
			});
		}
	}

	/** @type {Record<string, any>} */
	const orgs = {};
	for (const o of rows.organizations) {
		orgs[o.id] = { ...o, members: [], rights: [], stewardship: [], controlledBy: null };
	}

	return { assets, orgs, categories: rows.categories, events };
}
