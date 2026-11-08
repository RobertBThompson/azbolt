import PocketBase, { LocalAuthStore } from 'pocketbase';

/**
 * Browser-side PocketBase client.
 *
 * Same origin caveat as the Supabase client: each app runs on its own
 * subdomain, so its auth store is its own. A session on one app does not
 * carry to another.
 *
 * Chief proxies PocketBase under its own origin at /api and /_/ rather
 * than giving it a subdomain, which keeps requests same-origin and avoids
 * a CORS config that would otherwise have to list every app.
 *
 * @param {string} url  base URL, e.g. '' for same-origin or 'http://localhost:8091'
 * @param {string} storageKey  unique per app, e.g. 'azbolt.chief.pb'
 */
export function createPocketBase(url = '', storageKey = 'azbolt.pb') {
	// Each app gets its own storage key. The SDK's default LocalAuthStore
	// uses one shared key, so two apps served from the same origin during
	// development would sign each other out. Passing the store to the
	// constructor is what makes the key real for both reads and writes —
	// patching `save` after the fact only changed writing, leaving restore
	// on the shared key.
	return new PocketBase(url || undefined, new LocalAuthStore(storageKey));
}

/**
 * True when a PocketBase instance actually answers — not merely when
 * something returns HTTP 200.
 *
 * This matters because a SPA host answers every unknown path with the
 * fallback HTML at status 200, so `/api/health` looks "up" while being a
 * web page. The check therefore requires JSON with PocketBase's own
 * `code` field before believing it.
 *
 * @param {import('pocketbase').default} pb
 * @param {number} timeoutMs
 */
export async function pocketBaseReachable(pb, timeoutMs = 2500) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const base = (pb.baseURL ?? '').replace(/\/$/, '');
		const res = await fetch(`${base}/api/health`, {
			signal: ctrl.signal,
			headers: { accept: 'application/json' }
		});
		if (!res.ok) return false;
		if (!(res.headers.get('content-type') ?? '').includes('application/json')) return false;
		const body = await res.json();
		return typeof body?.code === 'number';
	} catch {
		return false;
	} finally {
		clearTimeout(t);
	}
}
