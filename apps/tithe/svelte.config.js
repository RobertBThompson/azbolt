import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Chief ships as a static SPA: Caddy serves the build directory directly,
 * with index.html as the fallback for client-side routing.
 * If this app ever needs server routes or secrets, swap to
 * @sveltejs/adapter-node (see apps/lip for that pattern).
 */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			precompress: true,
			strict: false
		})
	}
};
