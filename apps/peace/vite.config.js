import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { manifest, runtimeCaching } from '@azbolt/pwa';

export default {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: manifest({
				slug: 'peace',
				name: 'Peace',
				description: 'AZBOLT Peace',
				themeColor: '#17181a'
			}),
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
				runtimeCaching
			},
			devOptions: { enabled: false }
		})
	],
	server: { fs: { allow: ['../../packages'] } }
};
