<script>
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	/**
	 * Register the service worker.
	 *
	 * The PWA plugin normally injects this into generated HTML, but this
	 * app builds to a single 200.html fallback with prerendering off, so
	 * there is no page for it to inject into. Without this the worker
	 * never registered: the app was served over HTTPS with a manifest and
	 * icons sitting unused in the build, and still was not installable.
	 *
	 * Registered against the emitted file directly rather than through
	 * virtual:pwa-register, which drags in workbox-window — a dependency
	 * this app does not otherwise need. registerType is autoUpdate, so
	 * the worker takes over and refreshes itself without help from here.
	 */
	onMount(() => {
		if (!('serviceWorker' in navigator)) return;
		navigator.serviceWorker.register('/sw.js').catch(() => {
			// An app that fails to register is still a working app, just
			// not an installable one. Not worth breaking the page over.
		});
	});
</script>

{@render children()}
