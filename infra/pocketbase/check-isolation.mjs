/**
 * Can one account reach another's records?
 *
 * Owner-scoped rules are written in the migrations, but a rule is a
 * claim until something tries to break it. This signs in as two
 * accounts, writes a record as each, and then tries every way one has
 * of reaching the other's: listing, reading by the id it was told,
 * changing it, and deleting it.
 *
 *   node infra/pocketbase/check-isolation.mjs http://127.0.0.1:8092
 *
 * It creates two accounts on the instance you point it at, named
 * isolation-check-a@… and -b@…, and deletes them again at the end. Do
 * not run it against the live server while real people are using it.
 */
import { argv, env, exit } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const base = (argv[2] ?? 'http://127.0.0.1:8092').replace(/\/$/, '');
const stamp = Date.now();
const ACCOUNTS = [
	{ label: 'A', email: `isolation-check-a-${stamp}@example.invalid`, password: 'check-pass-1234' },
	{ label: 'B', email: `isolation-check-b-${stamp}@example.invalid`, password: 'check-pass-1234' }
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

/* Two accounts, made as the superuser so a closed sign-up does not
   stop the check from running. */
for (const a of ACCOUNTS) {
	const made = await call('/api/collections/users/records', {
		method: 'POST',
		token: suToken,
		body: JSON.stringify({
			email: a.email,
			password: a.password,
			passwordConfirm: a.password,
			name: `Isolation check ${a.label}`
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

/* Each writes one organization of their own. */
for (const a of ACCOUNTS) {
	const made = await call('/api/collections/organizations/records', {
		method: 'POST',
		token: a.token,
		body: JSON.stringify({ name: `Isolation ${a.label} ${stamp}`, code: 'B', owner: a.id })
	});
	if (!made.ok) {
		bad(`${a.label} could not write their own record: ${made.status} ${JSON.stringify(made.body)}`);
	} else {
		ok(`${a.label} wrote their own record`);
		a.record = made.body.id;
	}
}

if (A.record && B.record) {
	const list = await call('/api/collections/organizations/records?perPage=200', { token: A.token });
	const ids = (list.body?.items ?? []).map((r) => r.id);
	ids.includes(B.record)
		? bad("A's list contains B's record")
		: ok("A's list holds only A's records");

	const read = await call(`/api/collections/organizations/records/${B.record}`, { token: A.token });
	read.ok ? bad("A read B's record by id") : ok(`A cannot read B's record by id (${read.status})`);

	const write = await call(`/api/collections/organizations/records/${B.record}`, {
		method: 'PATCH',
		token: A.token,
		body: JSON.stringify({ name: 'Taken over' })
	});
	write.ok ? bad("A changed B's record") : ok(`A cannot change B's record (${write.status})`);

	const gone = await call(`/api/collections/organizations/records/${B.record}`, {
		method: 'DELETE',
		token: A.token
	});
	gone.ok ? bad("A deleted B's record") : ok(`A cannot delete B's record (${gone.status})`);

	const steal = await call('/api/collections/organizations/records', {
		method: 'POST',
		token: A.token,
		body: JSON.stringify({ name: `Planted ${stamp}`, code: 'B', owner: B.id })
	});
	steal.ok
		? bad('A wrote a record owned by B')
		: ok(`A cannot write a record owned by B (${steal.status})`);

	const anon = await call('/api/collections/organizations/records?perPage=1');
	(anon.body?.items ?? []).length
		? bad('a signed-out request can list records')
		: ok('a signed-out request sees nothing');
}

/* Clear up: deleting the account takes its records with it. */
for (const a of ACCOUNTS) {
	if (a.id)
		await call(`/api/collections/users/records/${a.id}`, { method: 'DELETE', token: suToken });
}

console.log(
	faults
		? `\n${faults} way${faults === 1 ? '' : 's'} through. Fix before real records.`
		: '\nAccounts are separate.'
);
exit(faults ? 1 : 0);
