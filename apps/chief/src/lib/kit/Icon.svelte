<script>
	/**
	 * Inline stroke icons.
	 *
	 * Kept as paths in one file rather than files in static/: at this size
	 * each is a few dozen bytes, they inherit currentColor so they follow
	 * the tone they sit in, and bundling them means no second request and
	 * nothing to go missing from a cache.
	 *
	 * All drawn on a 24-grid with a 1.7 stroke so weights match across the
	 * set — the usual giveaway of icons assembled from several sources.
	 */
	/** @type {{ name: string, size?: number }} */
	let { name, size = 18 } = $props();

	/** Solid glyphs read as objects rather than diagrams at small sizes. */
	const solid = $derived(name.endsWith('-solid'));

	/** @type {Record<string, string>} */
	const PATHS = {
		// Throw it — a paper plane, mid-flight rather than at rest.
		throw: 'M21 3 10.5 13.5M21 3l-6.5 18-4-8.5L2 8.5 21 3Z',
		// Sphere it — one node joined to three, which is what placing is.
		sphere:
			'M12 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM19 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 5.5v6m0 0-5.5 5m5.5-5 5.5 5',
		// Task it — stacked layers, since a task is one of many.
		task: 'M12 2.5 2.5 7 12 11.5 21.5 7 12 2.5ZM2.5 12 12 16.5 21.5 12M2.5 17 12 21.5 21.5 17',
		today: 'M3 10.5 12 3l9 7.5M5.5 9v11.5h13V9',
		action: 'M13 2.5 4 14h7l-1 7.5L20 10h-7l0-7.5Z',
		people:
			'M9 11.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM2.5 20.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.75 3.75 0 0 1 0 7.3M18 14.9c2.1.6 3.5 2.3 3.5 4.6',
		asset: 'M12 2.5 21 7.5v9L12 21.5 3 16.5v-9L12 2.5ZM3 7.5l9 5 9-5M12 12.5v9',
		user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5',
		search: 'M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16.5 16.5 21 21',
		mic: 'M12 2.5a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0v-6a3 3 0 0 1 3-3ZM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',
		keyboard: 'M3 6.5h18v11H3v-11ZM7 10h.01M11 10h.01M15 10h.01M17 13.5h.01M7 13.5h6.5',
		spark: 'M12 3l1.8 4.9L18.5 9.7l-4.7 1.8L12 16.4l-1.8-4.9L5.5 9.7l4.7-1.8L12 3Z',
		dash: 'M3.5 4.5h7v7h-7v-7ZM13.5 4.5h7v7h-7v-7ZM3.5 14.5h7v6h-7v-6ZM13.5 14.5h7v6h-7v-6Z',
		// Filled. A hairline person at 17px reads as a wireframe placeholder;
		// a solid silhouette reads as somebody.
		'user-solid':
			'M12 12.4a4.45 4.45 0 1 0 0-8.9 4.45 4.45 0 0 0 0 8.9ZM12 14.2c-4.3 0-7.3 2.5-7.3 5.6 0 .9.7 1.2 1.5 1.2h11.6c.8 0 1.5-.3 1.5-1.2 0-3.1-3-5.6-7.3-5.6Z'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={solid ? 'currentColor' : 'none'}
	stroke={solid ? 'none' : 'currentColor'}
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	<path d={PATHS[name] ?? ''} />
</svg>

<style>
	svg {
		display: block;
		flex: none;
	}
</style>
