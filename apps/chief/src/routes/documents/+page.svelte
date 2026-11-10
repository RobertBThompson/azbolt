<script>
	/**
	 * Sphere — Documents.
	 *
	 * Documents are not re-implemented here. The VPS already runs
	 * Nextcloud, and a file manager is a solved problem not worth
	 * rebuilding badly inside a capture app.
	 *
	 * The constraint worth understanding: Nextcloud sends
	 * X-Frame-Options SAMEORIGIN, so it cannot be embedded from another
	 * origin no matter what this page does. Proxying it under Chief's own
	 * origin at /cloud makes it same-origin, and then it embeds. That is
	 * a Caddy change, not a code change, so this page checks whether it
	 * has been made and says plainly which state it is in.
	 *
	 * status.php is the check: Nextcloud serves it unauthenticated and
	 * returns JSON with `installed`. A 404 means nothing is proxied; HTML
	 * means something answered that is not Nextcloud — probably Chief's
	 * own SPA fallback.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import LensSwitch from '$lib/shell/LensSwitch.svelte';
	import { Alert, Note, SectionHead } from '$lib/kit';

	const LENSES = [
		{ label: 'Notes', href: '/notes', icon: 'notes' },
		{ label: 'Documents', href: '/documents', icon: 'doc' }
	];

	const CLOUD = '/cloud';

	/** @returns {Promise<'connected'|'absent'|'not-nextcloud'>} */
	async function probe() {
		try {
			const res = await fetch(`${CLOUD}/status.php`, { headers: { accept: 'application/json' } });
			if (!res.ok) return 'absent';
			if (!(res.headers.get('content-type') ?? '').includes('json')) return 'not-nextcloud';
			const body = await res.json();
			return body?.installed ? 'connected' : 'not-nextcloud';
		} catch {
			return 'absent';
		}
	}

	const state = probe();
</script>

<svelte:head><title>Documents · Chief</title></svelte:head>

<Screen>
	<LensSwitch label="Sphere view" items={LENSES} at="/documents" />

	{#await state}
		<SectionHead label="Documents" />
		<p class="lede">Looking for a cloud…</p>
	{:then where}
		{#if where === 'connected'}
			<SectionHead label="Documents" t="cool" />
			<p class="lede">Your Nextcloud files, in place.</p>
			<iframe src="{CLOUD}/apps/files" title="Documents"></iframe>
			<Note>
				This is the real Nextcloud, served under Chief's own origin. Anything you do here happens
				there.
			</Note>
		{:else}
			<SectionHead label="Documents" t="warm" />
			{#if where === 'not-nextcloud'}
				<Alert
					title="Something answered, but not Nextcloud"
					meta="/cloud returned a page rather than Nextcloud's status. Most likely Chief's own fallback is catching the path before the proxy does."
				/>
			{:else}
				<Alert title="No cloud connected yet" meta="Nothing is serving /cloud on this origin." />
			{/if}

			<p class="lede">
				Nextcloud refuses to be framed by another origin — that is its own
				<code>X-Frame-Options</code> header, and no change here can talk it out of it. Serving it under
				Chief's origin makes it same-origin, and then it embeds.
			</p>

			<pre><code
					># chief.extra.caddy
handle_path /cloud/* &lbrace;
	reverse_proxy localhost:8080
&rbrace;</code
				></pre>

			<Note>
				Point that at wherever Apache serves Nextcloud. Until then the files stay one tap away in
				the browser rather than pretending to live here.
			</Note>
		{/if}
	{/await}
</Screen>

<style>
	.lede {
		margin: 0 2px;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	code {
		font-family: var(--font-mono);
		font-size: 0.92em;
	}
	pre {
		margin: 0;
		padding: 11px 13px;
		border: 1px solid var(--line-3);
		border-radius: 11px;
		background: var(--sunk);
		overflow-x: auto;
		font-size: 11.5px;
		line-height: 1.6;
		color: var(--ink-2);
	}
	iframe {
		width: 100%;
		min-height: 60vh;
		border: 1px solid var(--line-3);
		border-radius: 12px;
		background: var(--card);
	}
</style>
