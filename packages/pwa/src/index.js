/**
 * @typedef {object} ManifestInput
 * @property {string} slug   App slug, matches the subdomain and folder name.
 * @property {string} name   Display name.
 * @property {string} description
 * @property {string} [themeColor]
 * @property {string} [backgroundColor]  Splash ground while the app loads.
 */

/** Literal types, not widened strings — the PWA plugin's types require them. */
const DISPLAY = /** @type {const} */ ('standalone');
const ORIENTATION = /** @type {const} */ ('portrait');
const MASKABLE = /** @type {const} */ ('maskable');

/**
 * Shared PWA manifest factory. Each app calls this in its vite.config
 * so manifests stay structurally identical and only differ where they
 * must: name, slug, theme color, and the splash ground for an app whose
 * first screen is not paper.
 *
 * @param {ManifestInput} input
 */
export function manifest({
	slug,
	name,
	description,
	themeColor = '#17181a',
	backgroundColor = '#f6f5f0'
}) {
	return {
		id: `/?app=${slug}`,
		name,
		short_name: name,
		description,
		start_url: '/',
		scope: '/',
		display: DISPLAY,
		orientation: ORIENTATION,
		background_color: backgroundColor,
		theme_color: themeColor,
		icons: [
			{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
			{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
			{
				src: '/icons/icon-512-maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: MASKABLE
			}
		]
	};
}

const CACHE_FIRST = /** @type {const} */ ('CacheFirst');

/**
 * Workbox runtime caching shared by every app.
 *
 * The app shell is precached, so an installed app opens with no
 * connection. Records are not cached: a screen that quietly serves
 * yesterday's figures is worse than one that says it cannot reach the
 * server, and that is a decision each app's data layer makes, not the
 * service worker.
 *
 * workbox-build is not a direct dependency here, so the route callbacks
 * are typed explicitly rather than inferred from its RuntimeCaching type.
 */
export const runtimeCaching = [
	{
		/** @param {{ request: Request }} ctx */
		urlPattern: ({ request }) => request.destination === 'image',
		handler: CACHE_FIRST,
		options: {
			cacheName: 'images',
			expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 }
		}
	},
	{
		/** @param {{ request: Request }} ctx */
		urlPattern: ({ request }) => request.destination === 'font',
		handler: CACHE_FIRST,
		options: { cacheName: 'fonts', expiration: { maxEntries: 20 } }
	}
];
