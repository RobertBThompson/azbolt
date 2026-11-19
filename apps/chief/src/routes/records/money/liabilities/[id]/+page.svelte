<script>
	/**
	 * Money — one liability.
	 * Who it is owed to and what it is secured on come first, as links to
	 * those records, because a debt is a relationship between an asset
	 * and an organization before it is a row of terms.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Stats, Row, Facts, SectionHead, Alert, Btn, Blank, Delete } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy } from '$lib/pb.js';
	import { ORGS } from '$lib/assets.js';
	import { page } from '$app/stores';
	import {
		ASSETS,
		LIABILITIES,
		dayLabel,
		liabilityGaps,
		money,
		nextDue,
		ownBook,
		short,
		transactions
	} from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const l = $derived(LIABILITIES[id]);
	const gaps = $derived(liabilityGaps(l));
	const payments = $derived(transactions().filter((t) => t.liability === id));

	const terms = $derived([
		{ label: 'Loan type', value: l.type },
		{ label: 'Started', value: l.started },
		{ label: 'Start amount', value: money(l.startAmount) },
		{ label: 'Interest rate', value: l.rate ? `${l.rate}%` : 'None' },
		{ label: 'Payment', value: `${money(l.payment)} ${l.frequency.toLowerCase()}` },
		{ label: 'Term', value: `${l.months} months` }
	]);
</script>

<svelte:head><title>{l.name} · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<PageHead
		eyebrow={l.type}
		title={l.name}
		meta="{ORGS[l.borrower]?.name ?? l.borrower} owes this"
	/>
	{#if gaps.length}
		<Alert title="Not fully tied in" meta={gaps.join(' · ')} />
	{/if}
	<Stats
		items={[
			[short(l.balance), 'Balance'],
			[money(l.payment), l.frequency],
			[dayLabel(nextDue(l)), 'Next due']
		]}
	/>

	{#if l.lender}
		<Row
			t="warm"
			href="/organizations/{l.lender}"
			title="Lender"
			meta={ORGS[l.lender]?.name ?? l.lender}
			trailing="↗"
		/>
	{:else}
		<Row
			t="alert"
			href="/records/money/liabilities/{id}/edit"
			title="Lender"
			meta="Not linked to an organization"
			trailing="⚠"
		/>
	{/if}
	{#if l.asset}
		<Row
			t="warm"
			href="/records/assets/{l.asset}"
			title="Secured against"
			meta={ASSETS[l.asset]?.name ?? l.asset}
			trailing="↗"
		/>
	{:else}
		<Row
			t="alert"
			href="/records/money/liabilities/{id}/edit"
			title="Secured against"
			meta="Not tied to an asset"
			trailing="⚠"
		/>
	{/if}

	<SectionHead label="Terms" t="warm" />
	<Facts items={terms} />

	{#if ownBook()}
		<SectionHead label="Payments" t="warm" count={payments.length} />
		{#each payments as p (p.id)}
			<Row
				t="warm"
				href="/records/money/entry/{p.id}"
				title={money(p.amount)}
				meta="Paid · {dayLabel(p.date)}"
				trailing="›"
			/>
		{:else}
			<Blank>No payment recorded.</Blank>
		{/each}
		<Btn t="warm" href="/records/money/liabilities/{id}/pay" label="Record a payment" />
		<Btn primary={false} href="/records/money/liabilities/{id}/edit" label="Edit liability" />
		<Delete
			what={l.name}
			warn="The debt and its terms go, and it stops counting against net worth. Payments already recorded stay in cash."
			label="Delete this liability"
			ondelete={async () => {
				await destroy('liabilities', id);
				await reopenBook();
				await goto('/records/money/liabilities', { replaceState: true });
			}}
		/>
	{:else}
		<Btn t="warm" href="/records/money/liabilities/{id}/edit" label="Edit liability" />
	{/if}
</Screen>
