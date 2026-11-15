// Chief is a static SPA: no SSR, no prerender. Caddy falls back to 200.html.
export const ssr = false;
export const prerender = false;

import { session } from '$lib/session.svelte.js';
import { load as loadSpheres, spheres } from '$lib/spheres.svelte.js';

/**
 * The spheres, and how they overlap, are read before any screen is
 * built: which sphere is in focus decides what every list shows, so a
 * list drawn without them would be drawn wrong and then jump.
 */
export async function load() {
	/* The session first. It is what points the remembered focus at this
	   account; a screen that never mentions the session would otherwise
	   keep, and read, somebody else's. */
	void session.signedIn;
	if (!spheres.loaded) await loadSpheres();
	return {};
}
