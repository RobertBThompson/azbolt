<script>
	/**
	 * Money — a payment on a liability.
	 *
	 * One act, two records that have to agree: cash went out, and the
	 * debt went down. The balance is asked for rather than worked out,
	 * because how much of a payment is interest is on the lender's
	 * statement, not in Chief — the box is filled with the payment taken
	 * straight off, to be corrected from the statement.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, PageHead, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { LIABILITIES, dollars, money, ownBook } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createCashEntry, updateLiability } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const id = $page.params.id ?? '';
	const l = LIABILITIES[id];

	const typed = (/** @type {number} */ cents) => String(cents / 100);
	let amount = $state(l.payment ? typed(l.payment) : '');
	let day = $state(today());
	/* Left empty, the balance is the payment taken straight off, shown
	   in the box as what will be saved. Typed in, it is what was typed. */
	let after = $state('');
	let busy = $state(false);
	let fault = $state('');

	const paid = $derived(readAmount(amount));
	const straight = $derived(paid === null ? null : Math.max(0, l.balance - dollars(paid)) / 100);
	const left = $derived(after.trim() === '' ? straight : readAmount(after));

	const wrong = $derived(
		paid === null || paid <= 0
			? 'Give what was paid.'
			: left === null
				? 'Give the balance after it.'
				: dollars(left) > l.balance
					? 'A payment does not raise the balance. To correct the balance, edit the liability.'
					: day === '' || day > today()
						? 'It has to have been paid already.'
						: ''
	);

	async function save() {
		if (wrong || paid === null || left === null || busy) return;
		busy = true;
		fault = '';
		try {
			// Cash first: if the second write fails, the payment is on record
			// and the balance is simply still to be corrected.
			await createCashEntry({
				label: l.name,
				organization: l.borrower,
				type: 'Actual Expense',
				category: 'Mortgages, leases',
				amount: dollars(paid),
				frequency: 'Once',
				day,
				liability: id
			});
			await updateLiability(id, { balance: dollars(left) });
			await reopenBook();
			await goto(`/records/money/liabilities/${id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			await reopenBook().catch(() => {});
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Payment · {l.name} · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/{id}" nav={false}>
	<PageHead eyebrow={l.name} title="A payment" meta="{money(l.balance)} left before it" />
	{#if ownBook()}
		<Field label="What was paid" type="money" bind:value={amount} required />
		<Field label="The day it was paid" type="date" bind:value={day} required />
		<Field
			label="Balance after it"
			type="money"
			placeholder={straight === null
				? ''
				: `${straight.toLocaleString('en-US')} if all of it came off`}
			bind:value={after}
		/>
		{#if wrong && (amount.trim() !== '' || after.trim() !== '')}<Note>{wrong}</Note>{/if}
		{#if fault}<Alert title="Not all of it was saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Record the payment'}
			onclick={save}
			disabled={!!wrong || busy}
		/>
		<Note>
			It goes into cash out, and the balance comes down to the figure above. Some of a payment is
			usually interest, so check that figure against the lender's statement.
		</Note>
	{:else}
		<Btn t="warm" label="Record the payment" soon />
	{/if}
</Screen>
