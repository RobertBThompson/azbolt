<script>
	/**
	 * Money — it happened.
	 *
	 * Turns something owed into something paid or received. Decision 9:
	 * cash counts when it moves, so this is the one step that moves a
	 * line from "owed" into cash in or cash out — on the day it really
	 * moved, for the amount it really was.
	 *
	 * A later date of a repeating line becomes an entry of its own and
	 * that month stops showing as owed. A one-off that was only expected
	 * is the same entry, now moved.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Field, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import {
		ORGS,
		dayLabel,
		direction,
		dollars,
		inSentence,
		money,
		ownBook,
		transactions
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createCashEntry, settleCashEntry } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	let { data } = $props();

	/* Guarded in +page.js. Read once: saving takes the line out of the
	   list a moment before this screen is left. */
	// svelte-ignore state_referenced_locally
	const line = /** @type {import('$lib/assets.js').Tx} */ (
		transactions().find((t) => t.id === data.id)
	);
	const inward = direction(line.type) === 'in';
	const moved = inward ? 'Cash In' : 'Actual Expense';

	let amount = $state(String(line.amount / 100));
	let day = $state(today());
	let busy = $state(false);
	let fault = $state('');

	const read = $derived(readAmount(amount));
	const ready = $derived(read !== null && read > 0 && day !== '' && day <= today());

	async function save() {
		if (read === null || !ready || busy) return;
		busy = true;
		fault = '';
		try {
			if (line.of) {
				await createCashEntry({
					label: line.label,
					organization: line.org,
					type: moved,
					category: line.category,
					amount: dollars(read),
					frequency: 'Once',
					day,
					settles: line.of,
					period: line.period
				});
			} else {
				await settleCashEntry(line.id, moved, dollars(read), day);
			}
			await reopenBook();
			await goto('/records/money', { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>{inward ? 'Received' : 'Paid'} · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Banner
		t="warm"
		title={line.label}
		meta="{line.type} · {money(line.amount)} · {inSentence(dayLabel(line.date))} · {ORGS[line.org]
			?.name ?? ''}"
	/>
	{#if ownBook()}
		<Field
			label={inward ? 'What came in' : 'What was paid'}
			type="money"
			bind:value={amount}
			required
		/>
		<Field
			label={inward ? 'The day it came in' : 'The day it was paid'}
			type="date"
			bind:value={day}
			required
		/>
		{#if day > today()}<Note>It has to have happened already.</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : inward ? 'Record it as received' : 'Record it as paid'}
			onclick={save}
			disabled={!ready || busy}
		/>
		<Note>
			It moves from owed into {inward ? 'cash in' : 'cash out'}, on that day and for that amount.
			{#if line.of}The line keeps repeating; only this month is settled.{/if}
		</Note>
	{:else}
		<Btn t="warm" label="Record it" soon />
	{/if}
</Screen>
