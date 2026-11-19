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
	import { Alert, Banner, Missing, Select, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		CASH_TYPES,
		EXPENSE_CATEGORIES,
		FREQUENCIES,
		ASSETS,
		LIABILITIES,
		ORGS,
		direction,
		dollars,
		isMoneyCategory,
		money,
		moneyAssets,
		ownBook
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createCashEntry } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();
	const inward = $page.url.searchParams.get('dir') === 'in';
	/* No fallback figure. Arriving here without a readable amount means
	   the previous screen was skipped, and the answer is to go back for
	   it, not to invent one. */
	const amount = readAmount($page.url.searchParams.get('amount') ?? '');

	const types = CASH_TYPES.filter((t) => direction(t) === (inward ? 'in' : 'out'));
	const INCOME = ['Product', 'Services', 'Consulting', 'Other'];
	const orgs = Object.entries(ORGS)
		.sort(([, a], [, b]) => Number(!!b.self) - Number(!!a.self))
		.map(([id, o]) => ({ value: id, label: o.self ? `${o.name} · you` : o.name }));
	/* Yours unless told otherwise; the samples have no "you". */
	const me = Object.entries(ORGS).find(([, o]) => o.self)?.[0];

	/* The money account it moves through, and what it is for: a loan or
	   other debt, something held, or nothing — a bill going out or income
	   coming in. Everyday spending is not entered at all; the balances
	   already show it. */
	const accounts = moneyAssets().map((a) => ({ value: a.id, label: a.name }));
	const ties = [
		{ value: '', label: inward ? 'Nothing — income' : 'Nothing — a bill' },
		...Object.entries(ASSETS)
			.filter(([, a]) => !isMoneyCategory(a.category))
			.map(([id, a]) => ({ value: `asset:${id}`, label: a.name })),
		...Object.entries(LIABILITIES).map(([id, l]) => ({
			value: `liability:${id}`,
			label: `${l.name} · owed`
		}))
	];
	const asked = $page.url.searchParams.get('for') ?? '';

	let account = $state(accounts[0]?.value ?? '');
	let tie = $state(ties.some((t) => t.value === asked) ? asked : '');

	let label = $state('');
	let type = $state(types[0]);
	let org = $state(me ?? (own ? '' : 'azbolt'));
	let category = $state(inward ? 'Services' : 'Office');
	let frequency = $state('Once');
	let date = $state(today());
	let busy = $state(false);
	let fault = $state('');

	const moved = $derived(type === types[0]);
	/* Something that has moved cannot have moved tomorrow. What is only
	   expected may be dated ahead — that is the point of it. */
	const tooSoon = $derived(moved && date > today());
	const ready = $derived(label.trim() !== '' && org !== '' && date !== '' && !tooSoon);

	const sentence = $derived(
		[
			`${inward ? '+' : '−'}${money(dollars(amount ?? 0))}`,
			type,
			ORGS[org]?.name ?? 'No organization',
			category
		]
			.filter(Boolean)
			.join(' · ')
	);

	async function save() {
		if (amount === null || !ready || busy) return;
		busy = true;
		fault = '';
		try {
			await createCashEntry({
				label,
				organization: org,
				type,
				category,
				amount: dollars(amount),
				frequency,
				day: date,
				account,
				asset: tie.startsWith('asset:') ? tie.slice(6) : '',
				liability: tie.startsWith('liability:') ? tie.slice(10) : ''
			});
			await reopenBook();
			await goto('/records/money', { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Confirm · Chief</title></svelte:head>

<Screen back="/records/money/amount" nav={false}>
	{#if amount === null}
		<Missing what="amount was not given" back="/records/money/amount" backLabel="Enter an amount" />
	{:else}
		<Banner t="warm" title={sentence} meta="{frequency} · {date}. Change any part below." />
		{#if own}
			<Field
				label="What it was"
				placeholder={inward ? 'For example: paycheck' : 'For example: car payment'}
				bind:value={label}
				required
			/>
			<Select label="For" options={ties} bind:value={tie} />
			{#if accounts.length}
				<Select
					label={inward ? 'Paid into' : 'Paid from'}
					options={accounts}
					bind:value={account}
				/>
			{/if}
		{/if}
		<Select label="Cash type" options={types} bind:value={type} />
		<Select label="Organization" options={orgs} bind:value={org} />
		<Select label="Category" options={inward ? INCOME : EXPENSE_CATEGORIES} bind:value={category} />
		<Select label="Frequency" options={FREQUENCIES} bind:value={frequency} />
		<Field label="Date" type="date" bind:value={date} />
		{#if own}
			{#if tooSoon}<Note>Money that has moved cannot be dated in the future.</Note>{/if}
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				t="warm"
				label={busy ? 'Saving…' : 'Save payment'}
				onclick={save}
				disabled={!ready || busy}
			/>
		{:else}
			<Btn t="warm" label="Save transaction" soon />
		{/if}
		<Note>
			{#if moved}
				This has moved, so it counts toward {inward ? 'cash in' : 'cash out'} and net.
			{:else}
				{type} is expected, not moved. It is listed with the others and left out of the totals until it
				lands.
			{/if}
			{#if own && frequency !== 'Once'}
				It repeats from this date. The later dates are shown as expected, and each one counts only
				when you record it as having happened.
			{/if}
		</Note>
	{/if}
</Screen>
