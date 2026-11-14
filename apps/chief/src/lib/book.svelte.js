/**
 * Opens the asset book the Asset tab reads from.
 *
 * Signed in, it is the account's own records, turned into the shape
 * the arithmetic in assets.js already works on. Otherwise it is the
 * samples. A signed-in read that fails opens an empty book and says
 * so; it never falls back to the samples, which would look like
 * somebody's real figures.
 */
import { controllingOrgs, openOwnBook, openSampleBook, SHARE_UNITS } from './assets.js';
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

/** @param {string} stamp */
const monthOf = (stamp) =>
	stamp
		? new Date(stamp.replace(' ', 'T')).toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric'
			})
		: '';

/** @param {string} [stamp] the day of the month in a stored date */
const dayOf = (stamp) => Number(String(stamp ?? '').slice(8, 10)) || 0;

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
			// Filled in below, from whoever owns it.
			spheres: [],
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

	/** @type {import('./assets.js').Link[]} */
	const links = [];
	for (const o of rows.ownerships) {
		// A link to something since removed says nothing, so it is left out.
		const there = (/** @type {typeof o.holder} */ n) =>
			n.cls === 'asset' ? !!assets[n.id] : !!orgs[n.id];
		if (!there(o.holder) || !there(o.held)) continue;
		const a = o.held.cls === 'asset' ? assets[o.held.id] : null;
		const share = o.units === null || !a ? null : o.units / (a.units ?? SHARE_UNITS);
		const worth = a?.value == null || share === null ? null : Math.round(a.value * share);
		links.push({
			id: o.id,
			owner: o.holder,
			owned: o.held,
			role: o.role,
			units: o.units,
			startValue: null,
			currentValue: o.role === 'Owner' ? worth : null,
			disposable: a?.liquidity === 'Liquid' && o.role === 'Owner' ? worth : null,
			since: monthOf(o.since),
			day: o.since.slice(0, 10),
			claims: 0
		});
	}

	/* An asset is in the spheres of the organizations it ends up with.
	   It names none itself, so there is one place to change them. */
	for (const [id, a] of Object.entries(assets)) {
		a.spheres = [...new Set(controllingOrgs(id, links).flatMap((org) => orgs[org]?.spheres ?? []))];
	}

	/** @type {Record<string, import('./assets.js').Liability>} */
	const liabilities = {};
	for (const r of rows.liabilities) {
		// A debt whose borrower has been removed has nobody to count against.
		if (!orgs[r.borrower]) continue;
		liabilities[r.id] = {
			name: r.name,
			type: r.type || 'Other',
			lender: r.lender && orgs[r.lender] ? r.lender : null,
			asset: r.asset && assets[r.asset] ? r.asset : null,
			borrower: r.borrower,
			startAmount: r.start_amount ?? 0,
			balance: r.balance ?? 0,
			rate: r.rate ?? 0,
			payment: r.payment ?? 0,
			frequency: r.frequency || 'Monthly',
			months: r.months ?? 0,
			started: monthOf(r.started ?? ''),
			day: String(r.started ?? '').slice(0, 10),
			dueDay: r.due_day || dayOf(r.started) || 1,
			notes: r.notes ?? ''
		};
	}

	/** @type {import('./assets.js').Tx[]} */
	const cash = [];
	for (const r of rows.cash) {
		const [y, m, d] = String(r.date).slice(0, 10).split('-').map(Number);
		cash.push({
			id: r.id,
			label: r.label,
			org: r.organization,
			type: r.type,
			category: r.category ?? '',
			amount: r.amount ?? 0,
			frequency: r.frequency || 'Once',
			// The day as it was entered, on the wall clock here.
			date: new Date(y, m - 1, d)
		});
	}

	return { assets, links, liabilities, cash, orgs, categories: rows.categories, events };
}
