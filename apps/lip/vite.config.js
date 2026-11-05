import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { manifest, runtimeCaching } from '@azbolt/pwa';

export default {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: manifest({
				slug: 'lip',
				name: 'LIP',
				description: 'AZBOLT LIP',
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
