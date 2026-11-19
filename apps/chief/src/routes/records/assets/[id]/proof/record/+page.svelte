<script>
	/**
	 * B5 — E9 Evidence record.
	 * Verification is explainable at record level: source, checks, linked
	 * claim and history. A green word without those four things would be a
	 * trust badge, not evidence.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
	import { page } from '$app/stores';
	import { ASSETS } from '$lib/assets.js';

	const a = $derived(ASSETS[$page.params.id ?? '']);
</script>

<svelte:head><title>Evidence record · Chief</title></svelte:head>

<Screen back="/records/assets/{$page.params.id}/proof" nav={false}>
	<Banner t="warm" title="Storage confirmation" meta="Verified · current" />
	<Row t="warm" title="Source" meta="Secure facility · issued 12 August" trailing="›" />
	<Row t="warm" title="Checks" meta="Issuer, date and asset matched" trailing="›" />
	<Row
		t="warm"
		href="/records/assets/{$page.params.id}"
		title="Supports"
		meta="Storage claim · {a.name}"
		trailing="↗"
	/>
	<Row t="warm" title="Audit history" meta="Added, checked, linked" trailing="›" />
	<Btn primary={false} label="Replace this evidence" soon />
</Screen>
