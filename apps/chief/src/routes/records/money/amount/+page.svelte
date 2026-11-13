<script>
	/**
	 * Money — add a transaction, the amount.
	 * Amount first: one required field and a keypad. Direction is the only
	 * other thing asked here, because it flips the sign and cannot be
	 * inferred safely. The keypad is custom, so the system keyboard stays
	 * reachable — see the accessibility notes in docs/chief.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Seg, Amt, Btn, Note } from '$lib/kit';
	import { readAmount } from '$lib/amount.js';

	let dir = $state(0);
	/* Empty, not a sample figure. A box that opens at $1,240.00 is one
	   mistap from an entry nobody meant to make. */
	let amount = $state('');
	const read = $derived(readAmount(amount));
	const next = $derived(
		`/records/money/confirm?dir=${dir === 0 ? 'out' : 'in'}&amount=${read ?? ''}`
	);
</script>

<svelte:head><title>Amount · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Seg t="warm" a="Cash out" b="Cash in" bind:active={dir} />
	<Amt bind:value={amount} meta="Type the amount. Everything else is a guess you can correct." />
	{#if read === null}
		<Btn t="warm" label="Next" disabled />
	{:else}
		<Btn t="warm" href={next} label="Next" />
	{/if}
	<Note
		>Direction is the only other thing asked here, because it flips the sign and cannot be inferred
		safely.</Note
	>
</Screen>
