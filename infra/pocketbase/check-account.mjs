/**
 * Does a whole account hold together — and come apart cleanly?
 *
 * Makes two accounts. As the first, writes one record in every
 * collection Chief keeps, the way the app writes them. Then checks:
 *
 *   1. every collection accepted its record (so every migration ran,
 *      and the app and the server agree on the fields);
 *   2. the second account can list none of it, in any collection;
 *   3. deleting the first account's records in the app's own order
 *      succeeds, and nothing owned by it is left behind.
 *
 *   node infra/pocketbase/check-account.mjs http://127.0.0.1:8092
 *
 * It creates accounts named account-check-a@… and -b@… on the
 * instance you point it at and removes them at the end. Do not run it
 * against a server real people are using.
 */
import { argv, env, exit } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const base = (argv[2] ?? 'http://127.0.0.1:8092').replace(/\/$/, '');
const stamp = Date.now();
const NOON = '2026-01-15 12:00:00.000Z';

/* The app's own order for deleting: children before what they point at.
   Keep in step with OWNED in apps/chief/src/lib/pb.js. */
const OWNED = [
	'sphere_overlaps',
	'claims',
	'tasks',
	'endeavors',
	'cash_entries',
	'liabilities',
	'ownerships',
	'asset_events',
	'valuations',
	'assets',
	'asset_categories',
	'jots',
	'people',
	'organizations',
	'spheres'
];

const ask = async (q) => {
	const rl = createInterface({ input: stdin, output: stdout, terminal: true });
	const a = await rl.question(q);
	rl.close();
	return a.trim();
};

/** @param {string} path @param {RequestInit & { token?: string }} [opts] */
async function call(path, opts = {}) {
	const { token, ...rest } = opts;
	const res = await fetch(`${base}${path}`, {
		...rest,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: token } : {}),
			...(rest.headers ?? {})
		}
	});
	const text = await res.text();
	let body = null;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		body = text;
	}
	return { status: res.status, ok: res.ok, body };
}

let faults = 0;
const ok = (line) => console.log(`  ✓ ${line}`);
const bad = (line) => {
	faults += 1;
	console.log(`  ✗ ${line}`);
};

const superEmail = env.PB_SUPERUSER || (await ask('Superuser email: '));
const superPass = env.PB_PASSWORD || (await ask('Password: '));
const su = await call('/api/collections/_superusers/auth-with-password', {
	method: 'POST',
	body: JSON.stringify({ identity: superEmail, password: superPass })
});
if (!su.ok) {
	console.error(`Could not sign in as superuser: ${su.status}`);
	exit(1);
}
const suToken = su.body.token;

console.log(`Checking ${base}\n`);

const ACCOUNTS = ['a', 'b'].map((l) => ({
	label: l.toUpperCase(),
	email: `account-check-${l}-${stamp}@example.invalid`,
	password: 'check-pass-1234',
	id: '',
	token: ''
}));
for (const a of ACCOUNTS) {
	const made = await call('/api/collections/users/records', {
		method: 'POST',
		token: suToken,
		body: JSON.stringify({
			email: a.email,
			password: a.password,
			passwordConfirm: a.password,
			name: `Account check ${a.label}`
		})
	});
	if (!made.ok) {
		console.error(
			`Could not create account ${a.label}: ${made.status} ${JSON.stringify(made.body)}`
		);
		exit(1);
	}
	a.id = made.body.id;
	const auth = await call('/api/collections/users/auth-with-password', {
		method: 'POST',
		body: JSON.stringify({ identity: a.email, password: a.password })
	});
	a.token = auth.body.token;
}
const [A, B] = ACCOUNTS;

/* ── 1. One record in every collection, as the app writes them ─────── */

console.log('Writing one of everything as A');
/** @type {Record<string, string>} */
const made = {};
/** @param {string} coll @param {Record<string, any>} body */
async function write(coll, body) {
	const res = await call(`/api/collections/${coll}/records`, {
		method: 'POST',
		token: A.token,
		body: JSON.stringify({ ...body, owner: A.id })
	});
	if (!res.ok) {
		bad(`${coll}: ${res.status} ${JSON.stringify(res.body?.data ?? res.body)}`);
		return '';
	}
	ok(coll);
	made[coll] = res.body.id;
	return res.body.id;
}

const sphere = await write('spheres', { name: `Check ${stamp}`, hue: '' });
const sphere2 = await call('/api/collections/spheres/records', {
	method: 'POST',
	token: A.token,
	body: JSON.stringify({ name: `Check other ${stamp}`, hue: '', owner: A.id })
});
if (sphere && sphere2.ok) {
	const [a, b] = [sphere, sphere2.body.id].sort();
	await write('sphere_overlaps', { a, b, share: '50' });
} else bad('second sphere: could not make one to overlap');
const org = await write('organizations', {
	name: `Check me ${stamp}`,
	code: 'C',
	is_self: true,
	spheres: sphere ? [sphere] : []
});
const org2 = await call('/api/collections/organizations/records', {
	method: 'POST',
	token: A.token,
	body: JSON.stringify({ name: `Check bank ${stamp}`, code: 'B', owner: A.id })
});
const lender = org2.ok ? org2.body.id : '';
if (!org2.ok) bad(`second organization: ${org2.status} ${JSON.stringify(org2.body?.data)}`);
const twice = await call('/api/collections/organizations/records', {
	method: 'POST',
	token: A.token,
	body: JSON.stringify({ name: `Check second me ${stamp}`, code: 'C', is_self: true, owner: A.id })
});
if (twice.ok) {
	bad('a second "you" was accepted: the one-per-account index is missing');
	await call(`/api/collections/organizations/records/${twice.body.id}`, {
		method: 'DELETE',
		token: A.token
	});
} else ok('a second "you" is refused');

await write('people', {
	first_name: 'Check',
	last_name: 'Person',
	spheres: sphere ? [sphere] : []
});
const jot = await write('jots', { text: 'A check jot', organization: org, sphered: NOON });
const category = await write('asset_categories', { name: `Check ${stamp}` });
const asset = await write('assets', {
	name: 'Check asset',
	category,
	quantity: 1,
	units: 10000,
	valuation: 'whole'
});
await write('valuations', { asset, amount: 0, currency: 'USD', valued_on: NOON, note: '' });
await write('asset_events', {
	asset,
	type: 'Upkeep',
	detail: 'Checked',
	amount: 0,
	currency: 'USD',
	happened_on: NOON
});
const claim = await write('claims', {
	asset,
	kind: 'Agreement',
	title: 'Check claim',
	source: '',
	storage: 'paper',
	location: 'A drawer',
	hash: '',
	size: 0,
	file_name: ''
});

/* A file kept on the server opens for its owner with a pass, and for
   nobody without one. */
if (claim) {
	const form = new FormData();
	form.append('file', new Blob(['chief check file']), 'check.txt');
	form.append('storage', 'server');
	const up = await fetch(`${base}/api/collections/claims/records/${claim}`, {
		method: 'PATCH',
		headers: { Authorization: A.token },
		body: form
	});
	const rec = up.ok ? await up.json() : null;
	if (!rec?.file) bad(`claims: the file was not stored (${up.status})`);
	else {
		ok('claims: a file is stored');
		const bare = await fetch(`${base}/api/files/claims/${claim}/${rec.file}`);
		bare.ok
			? bad('claims: the file opens with no pass at all')
			: ok('claims: the file is refused without a pass');
		const pass = await call('/api/files/token', { method: 'POST', token: A.token });
		const mine = await fetch(
			`${base}/api/files/claims/${claim}/${rec.file}?token=${pass.body?.token}`
		);
		mine.ok && (await mine.text()) === 'chief check file'
			? ok('claims: its owner reads back exactly what was stored')
			: bad(`claims: its owner could not read it back (${mine.status})`);
		const theirs = await call('/api/files/token', { method: 'POST', token: B.token });
		const other = await fetch(
			`${base}/api/files/claims/${claim}/${rec.file}?token=${theirs.body?.token}`
		);
		other.ok
			? bad("claims: B opened A's file with B's own pass")
			: ok("claims: B's pass does not open A's file");
	}
}

await write('ownerships', {
	holder_org: org,
	held_asset: asset,
	role: 'Owner',
	units: 10000,
	since: NOON
});
await write('liabilities', {
	name: 'Check loan',
	type: 'Other',
	borrower: org,
	lender,
	asset,
	balance: 0,
	start_amount: 0,
	payment: 0,
	currency: 'USD',
	rate: 0,
	frequency: 'Monthly',
	months: 0,
	due_day: 31,
	started: NOON
});
await write('cash_entries', {
	label: 'Check entry',
	organization: org,
	type: 'Actual Expense',
	category: 'Office',
	amount: 0,
	currency: 'USD',
	frequency: 'Once',
	date: NOON
});
const endeavor = await write('endeavors', {
	name: 'Check endeavor',
	outcome: '',
	organization: org,
	stage: 'Active'
});
await write('tasks', {
	name: 'Check task',
	state: 'Now',
	waiting_on: '',
	endeavor,
	from_jot: jot
});

/* The app sorts by these; a collection without them reads as an error. */
for (const [coll, sort] of [
	['spheres', 'created'],
	['jots', '-created'],
	['tasks', 'created'],
	['ownerships', 'created']
]) {
	const res = await call(`/api/collections/${coll}/records?sort=${sort}`, { token: A.token });
	res.ok ? ok(`${coll} sorts by created`) : bad(`${coll} cannot sort by created: ${res.status}`);
}

/* ── 2. B sees none of it ─────────────────────────────────────────── */

console.log('\nReading as B');
for (const coll of OWNED) {
	const res = await call(`/api/collections/${coll}/records`, { token: B.token });
	if (!res.ok) bad(`${coll}: B's list failed with ${res.status}`);
	else if (res.body.totalItems > 0)
		bad(`${coll}: B can list ${res.body.totalItems} of A's records`);
	else ok(`${coll}: nothing of A's`);
	if (made[coll]) {
		const one = await call(`/api/collections/${coll}/records/${made[coll]}`, { token: B.token });
		if (one.ok) bad(`${coll}: B read A's record by its id`);
	}
}

/* ── 3. A deletes everything, in the app's order ──────────────────── */

console.log('\nDeleting A, the way the app does');
for (const coll of OWNED) {
	const list = await call(`/api/collections/${coll}/records?perPage=200&fields=id`, {
		token: A.token
	});
	if (!list.ok) {
		bad(`${coll}: could not list to delete (${list.status})`);
		continue;
	}
	let failed = 0;
	for (const r of list.body.items) {
		const del = await call(`/api/collections/${coll}/records/${r.id}`, {
			method: 'DELETE',
			token: A.token
		});
		if (!del.ok) {
			failed += 1;
			bad(
				`${coll}: delete refused: ${del.status} ${JSON.stringify(del.body?.message ?? del.body)}`
			);
		}
	}
	if (!failed) ok(`${coll}: ${list.body.items.length} removed`);
}
const gone = await call(`/api/collections/users/records/${A.id}`, {
	method: 'DELETE',
	token: A.token
});
gone.ok
	? ok('A removed their own sign-in')
	: bad(`A could not remove their own sign-in: ${gone.status}`);

console.log('\nLooking for anything left behind');
for (const coll of OWNED) {
	const left = await call(
		`/api/collections/${coll}/records?filter=${encodeURIComponent(`owner = "${A.id}"`)}`,
		{ token: suToken }
	);
	if (!left.ok) bad(`${coll}: could not check (${left.status})`);
	else if (left.body.totalItems > 0) bad(`${coll}: ${left.body.totalItems} of A's records remain`);
	else ok(`${coll}: clean`);
}

/* Tidy up, whatever happened above. */
for (const a of ACCOUNTS) {
	await call(`/api/collections/users/records/${a.id}`, { method: 'DELETE', token: suToken });
}

console.log(
	faults
		? `\n${faults} problem${faults === 1 ? '' : 's'}. Send this output back before anyone else uses this server.`
		: '\nAn account holds together, is walled off, and deletes cleanly.'
);
exit(faults ? 1 : 0);
