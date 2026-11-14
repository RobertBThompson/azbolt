<script>
	/**
	 * Money — add a liability, from memory.
	 *
	 * Step one is what you already know without looking anything up: what
	 * it is, who owes it, who it is owed to, what it is secured on and
	 * roughly how much is left. That is enough for the liability to exist
	 * and to be counted against net worth, so this is where it is saved.
	 * The paperwork — rate, payment, term — is a second step that can be
	 * left for the day the papers are in hand.
	 *
	 * The borrower is an organization, never a person: you owe through
	 * your own, which is offered first.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Prog, Field, Select, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { LOAN_TYPES, ORGS, activeAssets, dollars, ownBook } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { createLiability } from '$lib/pb.js';

	const own = ownBook();

	const orgs = Object.entries(ORGS)
		.sort(([, a], [, b]) => Number(!!b.self) - Number(!!a.self))
		.map(([key, o]) => ({ value: key, label: o.self ? `${o.name} · you` : o.name }));
	const assets = activeAssets().map((a) => ({ value: a.id, label: a.name }));
	const me = Object.entries(ORGS).find(([, o]) => o.self)?.[0] ?? '';

	let name = $state('');
	let type = $state('');
	let borrower = $state(me);
	let lender = $state('');
	let asset = $state('');
	let balance = $state('');
	let busy = $state(false);
	let fault = $state('');

	const left = $derived(readAmount(balance));
	const badBalance = $derived(balance.trim() !== '' && left === null);
	const sameOrg = $derived(lender !== '' && lender === borrower);
	const ready = $derived(name.trim() !== '' && borrower !== '' && !badBalance && !sameOrg);

	/** @param {SubmitEvent} e */
	async function save(e) {
		e.preventDefault();
		if (!own) return goto('/records/money/liabilities/new/paperwork');
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			const id = await createLiability({
				name,
				type: type || 'Other',
				borrower,
				lender,
				asset,
				balance: left === null ? 0 : dollars(left)
			});
			await reopenBook();
			await goto(`/records/money/liabilities/${id}/edit?paperwork=1`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Add liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<Prog t="warm" title="From memory" value={0.5} meta="Step 1 of 2 · what you already know" />
	<form onsubmit={save}>
		<Field label="Name" placeholder="For example: house note" bind:value={name} required />
		<Select
			label="Loan type"
			options={LOAN_TYPES}
			bind:value={type}
			placeholder="Loan, lease, contract…"
		/>
		{#if own}
			<Select label="Who owes it" options={orgs} bind:value={borrower} placeholder="Organization" />
		{/if}
		<Select label="Lender" options={orgs} bind:value={lender} placeholder="Organization" />
		<Select label="Secured against" options={assets} bind:value={asset} placeholder="Asset" />
		<Field
			label="Current balance"
			type="money"
			placeholder="Approximate is fine"
			bind:value={balance}
		/>
		{#if badBalance}<Note>That is not an amount. Use figures, like 24,500.</Note>{/if}
		{#if sameOrg}<Note>An organization does not owe itself.</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			type="submit"
			label={own ? (busy ? 'Saving…' : 'Save, then the paperwork') : 'Next: the paperwork'}
			disabled={own && (!ready || busy)}
		/>
	</form>
	{#if !own}
		<Note>This is the sample flow: nothing typed here is kept. Sign in to record your own.</Note>
	{/if}
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
