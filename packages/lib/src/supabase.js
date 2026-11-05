import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client.
 *
 * NOTE: each app runs on its own subdomain, which means its own origin,
 * which means its own localStorage. A session created on one app does NOT
 * carry to another. If shared sign-on across the apps becomes a
 * requirement, move session storage to a cookie scoped to a shared parent
 * domain — that needs a real domain, not nip.io.
 *
 * @param {string} url  PUBLIC_SUPABASE_URL
 * @param {string} anonKey  PUBLIC_SUPABASE_ANON_KEY
 * @param {string} storageKey  unique per app, e.g. 'azbolt.chief.auth'
 */
export function createBrowserClient(url, anonKey, storageKey) {
	return createClient(url, anonKey, {
		auth: {
			storageKey,
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true
		}
	});
}

/**
 * Server-side client for load functions and endpoints.
 * Never pass a service-role key into anything that reaches the browser.
 */
export function createServerClient(url, key, accessToken) {
	return createClient(url, key, {
		auth: { persistSession: false, autoRefreshToken: false },
		global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}
	});
}
