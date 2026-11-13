<script>
	/**
	 * Ownership — add a link.
	 *
	 * A link joins two records that already exist. The owner may be an
	 * organization or an asset; what is owned may be an organization or
	 * an asset. Nothing is created here except the link.
	 *
	 * It reads back as a sentence before it is saved, because "A owns B"
	 * and "B owns A" are one mis-tap apart.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Select, Field, Btn, Note } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { OWNER_TYPES, activeAssets } from '$lib/assets.js';

	const orgs = Object.entries(ORGS).map(([id, o]) => ({
		value: `organization:${id}`,
		label: o.name
	}));
	const assets = activeAssets().map((a) => ({
		value: `asset:${a.id}`,
		label: `${a.name} · asset`
	}));
	const either = [...orgs, ...assets];

	const preset = $page.url.searchParams.get('owned');
	let owner = $state('');
	let owned = $state(preset ? `asset:${preset}` : '');
	let role = $state('Owner');
	let shares = $state('100');

	/** @param {string} v */
	const label = (v) => either.find((o) => o.value === v)?.label.replace(' · asset', '') ?? '…';
	const verb = $derived(role === 'Owner' ? 'owns' : role === 'Manager' ? 'manages' : 'guarantees');
	const same = $derived(owner !== '' && owner === owned);
	const ready = $derived(owner !== '' && owned !== '' && !same);

	/** @param {SubmitEvent} e */
	function save(e) {
		e.preventDefault();
		if (ready) goto('/records/ownership');
	}
</script>

<svelte:head><title>Add ownership link · Chief</title></svelte:head>

<Screen back="/records/ownership" nav={false}>
	<Banner
		t="warm"
		title="{label(owner)} {verb} {label(owned)}"
		meta="Link two records that already exist."
	/>
	<form onsubmit={save}>
		<Select label="Owner" options={either} bind:value={owner} placeholder="Organization or asset" />
		<Select label="Owned" options={either} bind:value={owned} placeholder="Organization or asset" />
		<Select label="Role" options={OWNER_TYPES} bind:value={role} />
		{#if role === 'Owner'}
			<Field label="Shares" placeholder="Percent held" bind:value={shares} />
		{/if}
		<Btn t="warm" type="submit" label="Create ownership link" disabled={!ready} />
	</form>
	{#if same}
		<Note>A thing cannot own itself.</Note>
	{:else if owner.startsWith('asset:')}
		<Note>
			An asset can own an asset, as long as the chain ends at an organization somewhere above it.
		</Note>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
