/**
 * Does this PocketBase match what Chief's client expects?
 *
 * The repo and the server drifted apart once already: the checked-in
 * schema described spheres and people while the client called people
 * and organizations, and nothing said so until a screen came back
 * empty. This says so.
 *
 *   node infra/pocketbase/check-schema.mjs http://127.0.0.1:8092
 *
 * Reads only. It needs a superuser to list collections; set
 * PB_SUPERUSER and PB_PASSWORD, or it will ask.
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, argv, env, exit } from 'node:process';

/** What each collection must have for the client to work. */
const EXPECTED = {
	spheres: ['name', 'blurb', 'hue', 'retired', 'owner'],
	organizations: ['name', 'code', 'charter', 'blurb', 'spheres', 'controlled_by', 'owner'],
	people: [
		'first_name',
		'last_name',
		'role',
		'relationship',
		'email',
		'phone',
		'notes',
		'organization',
		'spheres',
		'owner'
	]
};

/** Every collection holding a person's records is owner-scoped, all five ways. */
const RULES = ['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule'];

const base = (argv[2] ?? 'http://127.0.0.1:8092').replace(/\/$/, '');

const ask = async (q, hide = false) => {
	const rl = createInterface({ input: stdin, output: stdout, terminal: true });
	if (hide) stdout.write(q);
	const answer = hide ? await rl.question('') : await rl.question(q);
	rl.close();
	return answer.trim();
};

const email = env.PB_SUPERUSER || (await ask('Superuser email: '));
const password = env.PB_PASSWORD || (await ask('Password: ', true));

const res = await fetch(`${base}/api/collections/_superusers/auth-with-password`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ identity: email, password })
});
if (!res.ok) {
	console.error(`Could not sign in to ${base}: ${res.status} ${await res.text()}`);
	exit(1);
}
const { token } = await res.json();

const list = await fetch(`${base}/api/collections?perPage=200`, {
	headers: { Authorization: token }
});
const { items } = await list.json();
const byName = Object.fromEntries(items.map((c) => [c.name, c]));

let faults = 0;
const fault = (line) => {
	faults += 1;
	console.log(`  ✗ ${line}`);
};

for (const [name, fields] of Object.entries(EXPECTED)) {
	console.log(`${name}`);
	const c = byName[name];
	if (!c) {
		fault('missing');
		continue;
	}
	const have = new Set((c.fields ?? []).map((f) => f.name));
	const missing = fields.filter((f) => !have.has(f));
	if (missing.length) fault(`missing fields: ${missing.join(', ')}`);
	const extra = [...have].filter(
		(f) => !fields.includes(f) && !['id', 'created', 'updated'].includes(f)
	);
	if (extra.length) console.log(`  · also has: ${extra.join(', ')}`);
	for (const rule of RULES) {
		const v = c[rule];
		if (typeof v !== 'string' || !v.includes('@request.auth.id')) {
			fault(`${rule} is ${v === null ? 'open to everyone' : JSON.stringify(v)}`);
		}
	}
	if (!faults) console.log('  ✓ as expected');
}

const users = byName.users;
if (users && users.createRule === null) {
	console.log('users');
	fault('anyone can create an account — close sign-up before real records go in');
}

console.log(faults ? `\n${faults} to fix.` : '\nSchema matches.');
exit(faults ? 1 : 0);
