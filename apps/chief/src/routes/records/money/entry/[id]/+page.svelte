<script>
	/**
	 * Money — one cash entry.
	 *
	 * Everything about a recorded entry can be corrected here, and the
	 * entry can be deleted. An entry is a fact about money, so a wrong
	 * one is fixed or removed, not worked around with a second entry.
	 *
	 * Deleting a repeating entry takes its later dates with it: they were
	 * worked out from it, never recorded. Months of it already settled
	 * are entries of their own and stay.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Select, Btn, Delete, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
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
		ownBook,
		transactions
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy, updateCashEntry } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const e = /** @type {import('$lib/assets.js').Tx} */ (
		transactions().find((t) => t.id === data.id && !t.of)
	);
	const inward = direction(e.type) === 'in';
	const types = CASH_TYPES.filter((t) => direction(t) === (inward ? 'in' : 'out'));
	const INCOME = ['Product', 'Services', 'Consulting', 'Other'];
	const orgs = Object.entries(ORGS).map(([id, o]) => ({
		value: id,
		label: o.self ? `${o.name} · you` : o.name
	}));
	const two = (/** @type {number} */ n) => String(n).padStart(2, '0');

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

	let account = $state(e.account ?? '');
	let tie = $state(e.liability ? `liability:${e.liability}` : e.asset ? `asset:${e.asset}` : '');
	let label = $state(e.label);
	let amount = $state(String(e.amount / 100));
	let type = $state(e.type);
	let org = $state(e.org);
	let category = $state(e.category);
	let frequency = $state(e.frequency);
	let day = $state(
		`${e.date.getFullYear()}-${two(e.date.getMonth() + 1)}-${two(e.date.getDate())}`
	);
	let busy = $state(false);
	let fault = $state('');

	const read = $derived(readAmount(amount));
	const moved = $derived(type === types[0]);
	const wrong = $derived(
		!label.trim()
			? 'Say what it was.'
			: read === null || read <= 0
				? 'That is not an amount.'
				: day === ''
					? 'Give the date.'
					: moved && day > today()
						? 'Money that has moved cannot be dated in the future.'
						: ''
	);

	async function save() {
		if (wrong || read === null || busy) return;
		busy = true;
		fault = '';
		try {
			await updateCashEntry(e.id, {
				label,
				organization: org,
				type,
				category,
				amount: dollars(read),
				frequency,
				day,
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

<svelte:head><title>{e.label} · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Banner t="warm" title={e.label} meta="{e.type} · {inward ? '+' : '−'}{money(e.amount)}" />
	{#if ownBook()}
		<Field label="What it was" bind:value={label} required />
		<Field label="Amount" type="money" bind:value={amount} required />
		<Select label="For" options={ties} bind:value={tie} />
		{#if accounts.length}
			<Select
				label={inward ? 'Paid into' : 'Paid from'}
				options={[{ value: '', label: 'Not said' }, ...accounts]}
				bind:value={account}
			/>
		{/if}
		<Select label="Cash type" options={types} bind:value={type} />
		<Select label="Organization" options={orgs} bind:value={org} />
		<Select
			label={inward ? 'Income source' : 'Expense category'}
			options={inward ? INCOME : EXPENSE_CATEGORIES}
			bind:value={category}
		/>
		<Select label="Frequency" options={FREQUENCIES} bind:value={frequency} />
		<Field label="Date" type="date" bind:value={day} required />
		{#if wrong}<Note>{wrong}</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Save changes'}
			onclick={save}
			disabled={!!wrong || busy}
		/>
		<Delete
			what="this entry"
			warn={e.frequency !== 'Once'
				? 'Its later dates go with it. Months already recorded as paid stay.'
				: 'It leaves cash in, cash out and every total.'}
			label="Delete this entry"
			ondelete={async () => {
				await destroy('cash_entries', e.id);
				await reopenBook();
				await goto('/records/money', { replaceState: true });
			}}
		/>
	{:else}
		<Note>This is a sample entry. Sign in to keep, change and delete your own.</Note>
	{/if}
</Screen>
