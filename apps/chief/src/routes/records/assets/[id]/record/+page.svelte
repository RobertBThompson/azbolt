<script>
	/**
	 * Assets — record what happened.
	 *
	 * Five things happen to an asset besides being re-valued: it is
	 * acquired, moved, kept up, transferred, or let go. Each is a dated
	 * line in its history, and three of them change something else too:
	 *
	 *  - Moved changes where it is kept. Custody, never ownership.
	 *  - Transferred changes who holds it: the share passes whole from
	 *    one organization to another.
	 *  - Let go marks it no longer held. It leaves the lists and every
	 *    total; the record and its history stay.
	 *
	 * The change and the line are saved together, so the history never
	 * says something the record does not.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, PageHead, Select, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ASSETS,
		ORGS,
		dollars,
		money,
		nodeName,
		ownBook,
		ownersOf,
		sharePercent
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import {
		destroy,
		createAssetEvent,
		createOwnership,
		updateAsset,
		updateOwnership
	} from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();
	const id = $page.params.id ?? '';
	const a = ASSETS[id];

	const KINDS = [
		{ value: 'Upkeep', label: 'Kept up — repaired, serviced, renewed' },
		{ value: 'Moved', label: 'Moved — kept somewhere else now' },
		{ value: 'Transferred', label: 'Transferred — a different owner' },
		{ value: 'Acquired', label: 'Acquired — how it came to be held' },
		/* The one fixed money account is never let go (Robert, 19 Nov). */
		...(a?.fixed ? [] : [{ value: 'Let go', label: 'Let go — sold, given, lost' }])
	];
	const WAYS = ['Sold', 'Given away', 'Lost', 'Scrapped', 'Returned'];

	const asked = $page.url.searchParams.get('kind') ?? '';
	let kind = $state(KINDS.some((k) => k.value === asked) ? asked : 'Upkeep');
	let day = $state(today());
	let what = $state('');
	let cost = $state('');
	let where = $state('');
	let way = $state('Sold');

	/* Only a share held by an organization can be handed on from here. */
	const held = ownersOf({ cls: 'asset', id }).filter(
		(l) => l.role === 'Owner' && l.owner.cls === 'organization'
	);
	const fromOptions = held.map((l) => ({
		value: l.id,
		label: `${nodeName(l.owner)} · ${sharePercent(l)}%`
	}));
	let from = $state(held[0]?.id ?? '');
	let to = $state('');
	const giving = $derived(held.find((l) => l.id === from) ?? null);
	const toOptions = $derived(
		Object.entries(ORGS)
			.filter(([org]) => org !== giving?.owner.id)
			.map(([org, o]) => ({ value: org, label: o.self ? `${o.name} · you` : o.name }))
	);

	let busy = $state(false);
	let fault = $state('');

	const amount = $derived(readAmount(cost));
	const badAmount = $derived(cost.trim() !== '' && amount === null);
	const wrong = $derived(
		day === '' || day > today()
			? 'It has to have happened already: give today or an earlier day.'
			: badAmount
				? 'That is not an amount. Use figures, like 240.'
				: kind === 'Upkeep' && !what.trim()
					? 'Say what was done.'
					: kind === 'Moved' && !where.trim()
						? 'Say where it is kept now.'
						: kind === 'Transferred' && !held.length
							? 'Nobody is recorded as owning it, so there is nothing to hand on. Add an owner under Ownership instead.'
							: kind === 'Transferred' && (!giving || !to)
								? 'Choose who it passes from and to.'
								: ''
	);

	const cents = $derived(amount === null ? null : dollars(amount));
	const withAmount = (/** @type {string} */ text) => (cents ? `${text} · ${money(cents)}` : text);

	async function save() {
		if (wrong || busy) return;
		busy = true;
		fault = '';
		try {
			if (kind === 'Upkeep') {
				await createAssetEvent(id, 'Upkeep', withAmount(what.trim()), day, cents);
			} else if (kind === 'Acquired') {
				await createAssetEvent(id, 'Acquired', withAmount(what.trim() || 'Acquired'), day, cents);
			} else if (kind === 'Moved') {
				await updateAsset(id, { storage: where.trim() });
				await createAssetEvent(
					id,
					'Moved',
					what.trim() ? `To ${where.trim()} · ${what.trim()}` : `To ${where.trim()}`,
					day
				);
			} else if (kind === 'Let go') {
				// Let go is Done: no longer held, kept as a record.
				await updateAsset(id, { let_go: `${day} 12:00:00.000Z`, state: 'Done' });
				await createAssetEvent(
					id,
					'Let go',
					withAmount(what.trim() ? `${way} · ${what.trim()}` : way),
					day,
					cents
				);
			} else if (kind === 'Transferred' && giving) {
				const units = giving.units ?? 0;
				const already = ownersOf({ cls: 'asset', id }).find(
					(l) => l.role === 'Owner' && l.owner.cls === 'organization' && l.owner.id === to
				);
				// The new holder first, so a failure halfway leaves the share
				// held twice — visible and fixable — rather than held by nobody.
				if (already) {
					await updateOwnership(
						already.id,
						'Owner',
						(already.units ?? 0) + units,
						already.day ?? day
					);
				} else {
					await createOwnership(
						{ cls: 'organization', id: to },
						{ cls: 'asset', id },
						'Owner',
						units,
						day
					);
				}
				await destroy('ownerships', giving.id);
				await createAssetEvent(
					id,
					'Transferred',
					`${nodeName(giving.owner)} to ${ORGS[to]?.name ?? to} · ${sharePercent(giving)}%`,
					day
				);
			}
			await reopenBook();
			await goto(kind === 'Let go' ? `/records/assets/${id}` : `/records/assets/${id}/timeline`, {
				replaceState: true
			});
		} catch (/** @type {any} */ err) {
			// Part of it may have been saved. Read the book again so the
			// screen behind this one shows what is actually on record.
			await reopenBook().catch(() => {});
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Record what happened · {a.name} · Chief</title></svelte:head>

<Screen back="/records/assets/{id}" nav={false}>
	<PageHead eyebrow={a.name} title="What happened" />
	<Select label="What happened" options={KINDS} bind:value={kind} />
	<Field label="When" type="date" bind:value={day} required />

	{#if kind === 'Upkeep'}
		<Field label="What was done" placeholder="For example: new tyres" bind:value={what} required />
		<Field label="What it cost" type="money" placeholder="Optional" bind:value={cost} />
	{:else if kind === 'Acquired'}
		<Field label="How" placeholder="For example: bought from the dealer" bind:value={what} />
		<Field label="What was paid" type="money" placeholder="Optional" bind:value={cost} />
	{:else if kind === 'Moved'}
		<Field
			label="Where it is kept now"
			placeholder="For example: the garage"
			bind:value={where}
			required
		/>
		<Field label="Note" placeholder="Optional" bind:value={what} />
	{:else if kind === 'Transferred'}
		{#if held.length}
			<Select label="From" options={fromOptions} bind:value={from} />
			<Select label="To" options={toOptions} bind:value={to} placeholder="Organization" />
		{/if}
	{:else}
		<Select label="How" options={WAYS} bind:value={way} />
		<Field label="Note" placeholder="Optional: to whom, or why" bind:value={what} />
		<Field label="What it brought in" type="money" placeholder="Optional" bind:value={cost} />
	{/if}

	{#if wrong && (kind === 'Transferred' || day > today() || badAmount)}
		<Note>{wrong}</Note>
	{/if}
	{#if fault}<Alert title="Not all of it was saved" meta={fault} />{/if}
	{#if own}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Record it'}
			onclick={save}
			disabled={!!wrong || busy}
		/>
	{:else}
		<Btn t="warm" label="Record it" soon />
	{/if}

	<Note>
		{#if kind === 'Moved'}
			Moving changes where it is kept. Who owns it does not change.
		{:else if kind === 'Transferred'}
			The whole of that share passes to the new owner. To pass part of one, change the shares under
			Ownership.
		{:else if kind === 'Let go'}
			It leaves your lists and totals from that day. The record and its history stay, and it can be
			brought back if this was a mistake.
		{:else if kind === 'Upkeep'}
			The cost is a note on this line. It is not added to cash out; record that under Money.
		{:else}
			What was paid is a note on this line. What it is worth now is its value.
		{/if}
	</Note>
</Screen>
