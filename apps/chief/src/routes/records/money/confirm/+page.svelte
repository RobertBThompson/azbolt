<script>
	/**
	 * Money — add a transaction, the rest.
	 *
	 * The entry is read back as one sentence, and each part of it is a
	 * short picker underneath. The guesses come from the last similar
	 * entry, and are right most of the time.
	 *
	 * Cash type is the one that matters most: it is what separates money
	 * that has moved from money that is only expected, and only the first
	 * kind is counted in cash in, cash out and net.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Missing, Select, Field, Btn, Note } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import { CASH_TYPES, EXPENSE_CATEGORIES, FREQUENCIES, direction, money } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';

	const inward = $page.url.searchParams.get('dir') === 'in';
	/* No fallback figure. Arriving here without a readable amount means
	   the previous screen was skipped, and the answer is to go back for
	   it, not to invent one. */
	const amount = readAmount($page.url.searchParams.get('amount') ?? '');

	const types = CASH_TYPES.filter((t) => direction(t) === (inward ? 'in' : 'out'));
	const INCOME = ['Product', 'Services', 'Consulting', 'Other'];
	const orgs = Object.entries(ORGS).map(([id, o]) => ({ value: id, label: o.name }));

	let type = $state(types[0]);
	let org = $state('azbolt');
	let category = $state(inward ? 'Services' : 'Office');
	let frequency = $state('Once');
	let date = $state(new Date().toISOString().slice(0, 10));

	const sentence = $derived(
		[
			`${inward ? '+' : '−'}${money(amount ?? 0)}`,
			type,
			ORGS[org]?.name ?? 'No organization',
			category
		]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<svelte:head><title>Confirm · Chief</title></svelte:head>

<Screen back="/records/money/amount" nav={false}>
	{#if amount === null}
		<Missing what="amount was not given" back="/records/money/amount" backLabel="Enter an amount" />
	{:else}
		<Banner t="warm" title={sentence} meta="{frequency} · {date}. Change any part below." />
		<Select label="Cash type" options={types} bind:value={type} />
		<Select label="Organization" options={orgs} bind:value={org} />
		<Select label="Category" options={inward ? INCOME : EXPENSE_CATEGORIES} bind:value={category} />
		<Select label="Frequency" options={FREQUENCIES} bind:value={frequency} />
		<Field label="Date" type="date" bind:value={date} />
		<Btn t="warm" label="Save transaction" soon />
		<Note>
			{#if type === types[0]}
				This has moved, so it counts toward {inward ? 'cash in' : 'cash out'} and net.
			{:else}
				{type} is expected, not moved. It is listed with the others and left out of the totals until it
				lands.
			{/if}
		</Note>
	{/if}
</Screen>
