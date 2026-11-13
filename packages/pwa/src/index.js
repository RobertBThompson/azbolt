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

const NETWORK_FIRST = /** @type {const} */ ('NetworkFirst');
const CACHE_FIRST = /** @type {const} */ ('CacheFirst');

/**
 * Workbox runtime caching shared by every app.
 * The app shell is precached; Supabase reads get a short network-first
 * window so the app opens offline with last-known data; writes are never
 * cached.
 *
 * workbox-build is not a direct dependency here, so the route callbacks
 * are typed explicitly rather than inferred from its RuntimeCaching type.
 */
export const runtimeCaching = [
	{
		/** @param {{ url: URL }} ctx */
		urlPattern: ({ url }) => url.pathname.startsWith('/rest/v1/'),
		handler: NETWORK_FIRST,
		options: {
			cacheName: 'supabase-rest',
			networkTimeoutSeconds: 4,
			expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }
		}
	},
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
