import { loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { manifest, runtimeCaching } from '@azbolt/pwa';

/**
 * The dev port lives here rather than in the dev script so that a second
 * checkout of this repo can run the same app at the same time: put
 * DEV_PORT=8171 in apps/chief/.env.local, which git ignores, and that
 * copy answers there instead. strictPort means a clash is an error
 * rather than a silent move to another port.
 */
/** @param {{ mode: string }} config */
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const port = Number(env.DEV_PORT) || 7171;
	/*
	 * PocketBase in development, proxied under Chief's own origin exactly
	 * as Caddy does in production, so the client needs no base URL and no
	 * CORS allowlist in either place. Each working copy points at its own
	 * instance with PB_URL in .env.local, beside its DEV_PORT.
	 */
	const pb = env.PB_URL || 'http://127.0.0.1:8092';
	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({
				registerType: 'autoUpdate',
				// Same reason as the manifest link in app.html: with a single
				// 200.html fallback there is no page to inject into, so the
				// registration is imported from the root layout instead.
				injectRegister: null,
				manifest: manifest({
					slug: 'chief',
					name: 'Chief',
					description: 'AZBOLT Chief',
					themeColor: '#2c2580',
					// The splash is this colour until the first paint. Paper before
					// an indigo app is a white flash on every launch.
					backgroundColor: '#2c2580'
				}),
				/*
				 * Chief is a single-page app: the adapter writes one 200.html
				 * and Caddy serves it for every path. Without this the service
				 * worker precaches the scripts but no page to run them in, and
				 * the installed app shows the browser's error page with no
				 * connection — which is what it did until now.
				 */
				kit: { spa: true, adapterFallback: '200.html' },
				workbox: {
					globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
					runtimeCaching
				},
				devOptions: { enabled: false }
			})
		],
		server: {
			port,
			strictPort: true,
			proxy: {
				'/api': { target: pb, changeOrigin: false },
				/* A regular expression, because the plain prefix '/_' would
				   also swallow /_app/immutable, which is the build's own. */
				'^/_/': { target: pb, changeOrigin: false }
			},
			fs: { allow: ['../../packages'] }
		}
	};
};
