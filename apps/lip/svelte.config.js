import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * LIP runs as a Node server behind Caddy, not as flat static files.
 * It needs server-side routes: the scoring/attribution math and the
 * service-role Supabase calls must not run in the browser.
 *
 * Build output is build/index.js — run under systemd, reverse-proxied
 * by Caddy (see infra/caddy/lip.caddy and infra/deploy/azbolt-lip.service).
 */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ out: 'build', precompress: true })
	}
};
