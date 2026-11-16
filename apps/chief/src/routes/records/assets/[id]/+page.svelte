<script>
	/**
	 * Assets — one asset.
	 *
	 * The head answers the three things asked of anything owned: who
	 * holds it, what it is worth, and whether that can be shown. Under it
	 * the page is the record's five parts, in the order they are needed:
	 * the proof, the attributes, what is owed against it, what work it is
	 * tied to, and what has happened to it.
	 *
	 * Verified, Insured and Stored are read off the claims on file. They
	 * are never set by hand, so the word cannot outlive the evidence.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import {
		PageHead,
		Chips,
		SphereTags,
		Alert,
		Banner,
		Row,
		SectionHead,
		Facts,
		Btn,
		Blank,
		Delete
	} from '$lib/kit';
	import { ENDEAVORS } from '$lib/data.js';
	import { ORGS } from '$lib/assets.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy, updateAsset } from '$lib/pb.js';
	import {
		ASSETS,
		attention,
		categoryName,
		events,
		money,
		owedAgainst,
		ownBook,
		ownerLine,
		ownersOf,
		statuses,
		valuedLine
	} from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id]);
	const why = $derived(attention(id));
	const marks = $derived(statuses(a));
	const owners = $derived(ownersOf({ cls: 'asset', id }));
	const owed = $derived(owedAgainst(id));
	const history = $derived(events(id));

	const ownerHref = $derived(
		owners.length === 1
			? `/records/ownership/${owners[0].id}`
			: owners.length
				? `/records/ownership?owned=${id}`
				: `/records/ownership/add?owned=${id}`
	);

	let busy = $state(false);
	let fault = $state('');

	/* Letting go is a date on the record, so undoing a mistaken one is
	   clearing it. The line in the timeline stays: it did get recorded. */
	async function bringBack() {
		busy = true;
		fault = '';
		try {
			await updateAsset(id, { let_go: null });
			await reopenBook();
			await goto(`/records/assets/${id}/timeline`);
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}

	const facts = $derived([
		{ label: 'Rights', value: a.rights || '—' },
		{ label: 'Period', value: a.period || '—' },
		{ label: 'Tangibility', value: a.tangibility },
		{ label: 'Liquidity', value: a.liquidity },
		{ label: 'Inventory', value: a.inventory },
		{ label: 'Quantity', value: String(a.quantity) }
	]);
</script>

<svelte:head><title>{a.name} · Chief</title></svelte:head>

<Screen
	back={a.category ? `/records/assets/in/${a.category}` : '/records/assets/in/all'}
	nav={false}
>
	<PageHead eyebrow={categoryName(a.category)} title={a.name} meta={a.blurb} />
	{#if marks.length}<Chips t="warm" items={marks} active={-1} />{/if}
	<SphereTags keys={a.spheres} />

	{#if a.letGo}
		<Banner title="Let go" meta="No longer held. The record and its history stay." />
		{#if ownBook()}
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				primary={false}
				label={busy ? 'Saving…' : 'It is still held — bring it back'}
				onclick={bringBack}
				disabled={busy}
			/>
		{/if}
	{:else if why.length}
		<Alert title="Needs attention" meta={why.join(' · ')} />
	{/if}

	<Row
		t="warm"
		href={ownerHref}
		title="Owner"
		meta={ownerLine(id)}
		trailing={owners.length ? '›' : '⚠'}
	/>
	<Row
		t="warm"
		href="/records/assets/{id}/valuation"
		title="Value"
		meta={valuedLine(a)}
		trailing={a.value === null ? '⚠' : '›'}
	/>
	{#if a.tangibility === 'Tangible'}
		<Row
			t="warm"
			href="/records/assets/{id}/movement"
			title="Storage and movement"
			meta={a.storage || 'Not recorded'}
			trailing={a.movement ? '⚠' : '›'}
		/>
	{/if}

	<SectionHead label="Claims & files" t="warm" count={a.claims.length} />
	{#each a.claims as c, i (i)}
		<Row
			t="warm"
			href="/records/assets/{id}/proof"
			title={c.kind}
			meta={c.detail}
			trailing={c.verified ? '✓' : '—'}
		/>
	{:else}
		<Blank>No proof on file. A claim with nothing behind it is only a say-so.</Blank>
	{/each}
	<Btn primary={false} href="/records/assets/{id}/proof/new" label="Add proof" />

	<SectionHead label="Attributes" t="warm" />
	<Facts items={facts} />
	<Btn primary={false} href="/records/assets/{id}/details" label="Edit attributes" />

	<SectionHead label="Owed against it" t="warm" count={owed.length} />
	{#each owed as l (l.id)}
		<Row
			t="warm"
			href="/records/money/liabilities/{l.id}"
			title={l.name}
			meta="{money(l.balance)} left · {l.lender ? ORGS[l.lender]?.name : 'lender not linked'}"
			trailing="›"
		/>
	{:else}
		<Blank>Nothing is owed against it.</Blank>
	{/each}

	<SectionHead label="Linked endeavors" t="cool" count={a.endeavors.length} />
	{#each a.endeavors as e (e)}
		<Row
			t="cool"
			href="/work/endeavors/{e}"
			title={ENDEAVORS[e]?.name ?? e}
			meta={ENDEAVORS[e]?.next ? `Next: ${ENDEAVORS[e].next}` : ''}
			trailing="↗"
		/>
	{:else}
		<Blank>Not tied to an endeavor.</Blank>
	{/each}

	<SectionHead label="Timeline" t="warm" count={history.length} />
	{#each history.slice(0, 3) as h, i (i)}
		<Row t="warm" title={h.type} meta={h.detail} trailing={h.when} />
	{:else}
		<Blank>Nothing recorded yet.</Blank>
	{/each}
	{#if history.length > 3}
		<Btn primary={false} href="/records/assets/{id}/timeline" label="Whole timeline" />
	{/if}

	{#if ownBook() && !a.letGo}
		<Btn t="warm" href="/records/assets/{id}/record" label="Record what happened" />
	{/if}
	<Btn t="ai" primary={false} href="/" label="Jot an asset update" />
	{#if ownBook()}
		<Delete
			what={a.name}
			warn="Its values, history, proofs and ownership links go with it. If it was sold or given away, record that it was let go instead, and it keeps its history."
			label="Delete this asset"
			ondelete={async () => {
				await destroy('assets', id);
				await reopenBook();
				await goto('/records/assets', { replaceState: true });
			}}
		/>
	{/if}
</Screen>
