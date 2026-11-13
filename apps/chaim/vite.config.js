import { loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { manifest, runtimeCaching } from '@azbolt/pwa';

/**
 * The dev port lives here rather than in the dev script so that a second
 * checkout of this repo can run the same app at the same time: put
 * DEV_PORT=8171 in apps/chaim/.env.local, which git ignores, and that
 * copy answers there instead. strictPort means a clash is an error
 * rather than a silent move to another port.
 */
/** @param {{ mode: string }} config */
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const port = Number(env.DEV_PORT) || 7172;
	return {
		plugins: [
			sveltekit(),
			SvelteKitPWA({
				registerType: 'autoUpdate',
				manifest: manifest({
					slug: 'chaim',
					name: 'Chaim',
					description: 'AZBOLT Chaim',
					themeColor: '#17181a'
				}),
				workbox: {
					globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
					runtimeCaching
				},
				devOptions: { enabled: false }
			})
		],
		server: { port, strictPort: true, fs: { allow: ['../../packages'] } }
	};
};
