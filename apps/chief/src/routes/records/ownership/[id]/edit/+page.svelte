<script>
	/**
	 * Ownership — edit a link.
	 * The two ends are fixed; a different owner is a different link. What
	 * changes here is the terms between them.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Select, Field, Btn, Note } from '$lib/kit';
	import { page } from '$app/stores';
	import { LINKS, OWNER_TYPES, linkOf, nodeName, sharePercent } from '$lib/assets.js';

	/* Guarded in +layout.js — see the note on the detail screen. */
	const l = /** @type {NonNullable<ReturnType<typeof linkOf>>} */ (linkOf($page.params.id ?? ''));

	let role = $state(/** @type {string} */ (l.role));
	let shares = $state(sharePercent(l) !== null ? String(sharePercent(l)) : '');
	let start = $state(l.startValue !== null ? String(l.startValue) : '');
	let current = $state(l.currentValue !== null ? String(l.currentValue) : '');
	let since = $state(l.since);
</script>

<svelte:head><title>Edit ownership · Chief</title></svelte:head>

<Screen back="/records/ownership/{l.id}" nav={false}>
	<PageHead eyebrow="Edit ownership" title="{nodeName(l.owner)} → {nodeName(l.owned)}" />
	<Select label="Role" options={OWNER_TYPES} bind:value={role} />
	<Field label="Shares" type="money" placeholder="Percent held" bind:value={shares} />
	<Field label="Start value" type="money" placeholder="Worth when this began" bind:value={start} />
	{#if l.owned.cls === 'organization'}
		<Field label="Current value" type="money" placeholder="Worth now" bind:value={current} />
	{/if}
	<Field label="Since" type="date" bind:value={since} />
	<Btn t="warm" href="/records/ownership/{l.id}" label="Save changes" />
	{#if l.owned.cls === 'asset'}
		<Note>
			Current value is not edited here. It follows the asset's own value and the share, so change
			either of those instead.
		</Note>
	{/if}
</Screen>
