<script>
	/**
	 * Ownership — add a link.
	 *
	 * A link joins two records that already exist. The owner may be an
	 * organization or an asset; what is owned may be an organization or
	 * an asset. Nothing is created here except the link. The owner is
	 * never a person: you own through your own organization, which
	 * leads the list.
	 *
	 * It reads back as a sentence before it is saved, because "A owns B"
	 * and "B owns A" are one mis-tap apart.
	 *
	 * The share is typed as a percentage and kept as whole units out of
	 * the 10,000 a thing is divided into, so 2.25% is exactly 225 units
	 * and three thirds never add up to 99.99.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Select, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ASSETS,
		LINKS,
		ORGS,
		OWNER_TYPES,
		SHARE_UNITS,
		activeAssets,
		ownBook
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createOwnership } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();

	const orgs = Object.entries(ORGS)
		.sort(([, a], [, b]) => Number(!!b.self) - Number(!!a.self))
		.map(([id, o]) => ({
			value: `organization:${id}`,
			label: o.self ? `${o.name} · you` : o.name
		}));
	const assets = activeAssets().map((a) => ({
		value: `asset:${a.id}`,
		label: `${a.name} · asset`
	}));
	const either = [...orgs, ...assets];

	const preset = $page.url.searchParams.get('owned');
	const me = Object.entries(ORGS).find(([, o]) => o.self)?.[0];
	let owner = $state(own && me ? `organization:${me}` : '');
	let owned = $state(preset ? `asset:${preset}` : '');
	let role = $state('Owner');
	let shares = $state('100');
	let day = $state(today());
	let busy = $state(false);
	let fault = $state('');

	/** @param {string} v */
	const label = (v) =>
		either.find((o) => o.value === v)?.label.replace(/ · (asset|you)$/, '') ?? '…';
	const verb = $derived(role === 'Owner' ? 'owns' : role === 'Manager' ? 'manages' : 'guarantees');
	const same = $derived(owner !== '' && owner === owned);

	/** @param {string} v */
	const node = (v) => {
		const at = v.indexOf(':');
		/** @type {'organization'|'asset'} */
		const kind = v.slice(0, at) === 'asset' ? 'asset' : 'organization';
		return { cls: kind, id: v.slice(at + 1) };
	};

	/** How many units the owned thing is divided into, and how many are spoken for. */
	const total = $derived(
		owned.startsWith('asset:') ? (ASSETS[node(owned).id]?.units ?? SHARE_UNITS) : SHARE_UNITS
	);
	const taken = $derived(
		owned === ''
			? 0
			: LINKS.filter(
					(l) =>
						l.role === 'Owner' && l.owned.cls === node(owned).cls && l.owned.id === node(owned).id
				).reduce((n, l) => n + (l.units ?? 0), 0)
	);
	const percent = $derived(readAmount(shares));
	const units = $derived(percent === null ? null : Math.round((percent / 100) * total));
	const left = $derived(Number((((total - taken) / total) * 100).toFixed(2)));

	const shareFault = $derived(
		role !== 'Owner'
			? ''
			: units === null || units < 1
				? 'Give the share as a percentage above zero.'
				: percent !== null && percent > 100
					? 'Nobody owns more than all of a thing.'
					: owned !== '' && taken + units > total
						? left <= 0
							? 'All of it is already owned.'
							: `Only ${left}% of it is not already owned.`
						: ''
	);
	const already = $derived(
		owner !== '' &&
			owned !== '' &&
			LINKS.some(
				(l) =>
					l.owner.cls === node(owner).cls &&
					l.owner.id === node(owner).id &&
					l.owned.cls === node(owned).cls &&
					l.owned.id === node(owned).id &&
					l.role === role
			)
	);
	const ready = $derived(
		owner !== '' && owned !== '' && !same && !shareFault && !already && day !== '' && day <= today()
	);

	/** @param {SubmitEvent} e */
	async function save(e) {
		e.preventDefault();
		if (!ready || busy) return;
		if (!own) return goto('/records/ownership');
		busy = true;
		fault = '';
		try {
			const id = await createOwnership(
				node(owner),
				node(owned),
				/** @type {'Owner'|'Manager'|'Guarantor'} */ (role),
				role === 'Owner' ? units : null,
				day
			);
			await reopenBook();
			await goto(`/records/ownership/${id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
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
			<Field label="Share, as a percentage" type="money" placeholder="100" bind:value={shares} />
		{/if}
		{#if own}<Field label="Since" type="date" bind:value={day} required />{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			type="submit"
			label={busy ? 'Saving…' : 'Create ownership link'}
			disabled={!ready || busy}
		/>
	</form>
	{#if same}
		<Note>A thing cannot own itself.</Note>
	{:else if already}
		<Note>That link is already on file. Open it to change the share.</Note>
	{:else if shareFault && owned !== ''}
		<Note>{shareFault}</Note>
	{:else if day > today()}
		<Note>A link cannot begin in the future.</Note>
	{:else if owner.startsWith('asset:')}
		<Note>
			An asset can own an asset, as long as the chain ends at an organization somewhere above it.
		</Note>
	{:else if !own}
		<Note>This is the sample flow: nothing chosen here is kept. Sign in to record your own.</Note>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
