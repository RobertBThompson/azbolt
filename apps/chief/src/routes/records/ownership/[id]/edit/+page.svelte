<script>
	/**
	 * Ownership — edit a link.
	 * The two ends are fixed; a different owner is a different link. What
	 * changes here is the terms between them: the role, the share, and
	 * when it began. What the share is worth is never typed in — it
	 * follows the asset's own value.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, PageHead, Select, Field, Btn, Note, Delete } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ASSETS,
		LINKS,
		OWNER_TYPES,
		SHARE_UNITS,
		linkOf,
		nodeName,
		ownBook,
		sharePercent
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy, updateOwnership } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();

	/* Guarded in +layout.js — see the note on the detail screen. */
	const l = /** @type {NonNullable<ReturnType<typeof linkOf>>} */ (linkOf($page.params.id ?? ''));

	let role = $state(/** @type {string} */ (l.role));
	let shares = $state(sharePercent(l) !== null ? String(sharePercent(l)) : '');
	let start = $state(l.startValue !== null ? String(l.startValue / 100) : '');
	let since = $state(own ? (l.day ?? today()) : l.since);
	let busy = $state(false);
	let fault = $state('');

	const total = l.owned.cls === 'asset' ? (ASSETS[l.owned.id]?.units ?? SHARE_UNITS) : SHARE_UNITS;
	/* What everyone else holds of it. */
	const others = LINKS.filter(
		(o) =>
			o.id !== l.id &&
			o.role === 'Owner' &&
			o.owned.cls === l.owned.cls &&
			o.owned.id === l.owned.id
	).reduce((n, o) => n + (o.units ?? 0), 0);

	const percent = $derived(readAmount(shares));
	const units = $derived(percent === null ? null : Math.round((percent / 100) * total));
	const left = Number((((total - others) / total) * 100).toFixed(2));
	const shareFault = $derived(
		role !== 'Owner'
			? ''
			: units === null || units < 1
				? 'Give the share as a percentage above zero.'
				: others + units > total
					? `The others hold the rest: at most ${left}% is free.`
					: ''
	);
	const ready = $derived(!shareFault && since !== '' && since <= today());

	async function save() {
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			await updateOwnership(
				l.id,
				/** @type {'Owner'|'Manager'|'Guarantor'} */ (role),
				role === 'Owner' ? units : null,
				since
			);
			await reopenBook();
			await goto(`/records/ownership/${l.id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Edit ownership · Chief</title></svelte:head>

<Screen back="/records/ownership/{l.id}" nav={false}>
	<PageHead eyebrow="Edit ownership" title="{nodeName(l.owner)} → {nodeName(l.owned)}" />
	<Select label="Role" options={OWNER_TYPES} bind:value={role} />
	{#if role === 'Owner'}
		<Field label="Share, as a percentage" type="money" bind:value={shares} />
	{/if}
	{#if own}
		<Field label="Since" type="date" bind:value={since} required />
		{#if shareFault}<Note>{shareFault}</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Save changes'}
			onclick={save}
			disabled={!ready || busy}
		/>
		<Delete
			what="this link"
			warn="{nodeName(l.owner)} stops holding {nodeName(l.owned)}. Both stay on file."
			label="Delete this link"
			ondelete={async () => {
				await destroy('ownerships', l.id);
				await reopenBook();
				await goto('/records/ownership', { replaceState: true });
			}}
		/>
	{:else}
		<Field
			label="Start value"
			type="money"
			placeholder="Worth when this began"
			bind:value={start}
		/>
		<Field label="Since" bind:value={since} />
		<Btn t="warm" label="Save changes" soon />
	{/if}
	<Note>
		What the share is worth is not edited here. It follows the value of what is owned, so change
		that instead.
	</Note>
</Screen>
