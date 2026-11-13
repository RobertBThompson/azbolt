<script>
	/**
	 * Ownership — one link.
	 *
	 * Read as a sentence first, then as its terms: the role, the share,
	 * what it was worth when the link began and what it is worth now.
	 *
	 * For an asset the current value is not stored here. It is the
	 * asset's own value times the share, so the two cannot come to
	 * disagree. A manager holds no share and so carries no value.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Stats, Row, Facts, SectionHead, Btn, Note } from '$lib/kit';
	import { page } from '$app/stores';
	import { LINKS, linkOf, money, nodeHref, nodeName, sharePercent } from '$lib/assets.js';

	/* The route guard in +layout.js has already turned an unknown id
	   into a not-found screen, so the link is there by the time this
	   component runs. */
	const l = $derived(
		/** @type {NonNullable<ReturnType<typeof linkOf>>} */ (linkOf($page.params.id ?? ''))
	);
	const verb = $derived(
		l.role === 'Owner' ? 'owns' : l.role === 'Manager' ? 'manages' : 'guarantees'
	);

	const values = $derived([
		{ label: 'Start value', value: money(l.startValue) },
		{ label: 'Current value', value: money(l.currentValue) },
		...(l.disposable !== null ? [{ label: 'Disposable', value: money(l.disposable) }] : []),
		{ label: 'Since', value: l.since || '—' }
	]);
</script>

<svelte:head><title>{nodeName(l.owner)} · {nodeName(l.owned)} · Chief</title></svelte:head>

<Screen back="/records/ownership" nav={false}>
	<PageHead eyebrow="Ownership" title="{nodeName(l.owner)} {verb} {nodeName(l.owned)}" />
	<Stats
		items={[
			[l.role, 'Role'],
			[sharePercent(l) !== null ? `${sharePercent(l)}%` : '—', 'Share'],
			['Active', 'Status']
		]}
	/>

	<Row
		t="warm"
		href={nodeHref(l.owner)}
		title="Owner"
		meta="{nodeName(l.owner)} · {l.owner.cls}"
		trailing={l.owner.cls === 'organization' ? '↗' : '›'}
	/>
	<Row
		t="warm"
		href={nodeHref(l.owned)}
		title="Owned"
		meta="{nodeName(l.owned)} · {l.owned.cls}"
		trailing={l.owned.cls === 'organization' ? '↗' : '›'}
	/>

	<SectionHead label="Value" t="warm" />
	<Facts items={values} />

	{#if l.owned.cls === 'asset'}
		<Row
			t="warm"
			href="/records/assets/{l.owned.id}/proof"
			title="Claims and documents"
			meta="{l.claims} on file for this asset"
			trailing="›"
		/>
	{:else}
		<Row t="warm" title="Claims and documents" meta="{l.claims} on file" trailing="›" />
	{/if}

	{#if l.role !== 'Owner'}
		<Note>
			A {l.role.toLowerCase()} answers for it without holding a share of it, so no value sits on this
			link.
		</Note>
	{/if}

	<Btn t="warm" href="/records/ownership/{l.id}/edit" label="Edit ownership" />
</Screen>
