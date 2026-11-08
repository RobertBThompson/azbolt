<script>
	/**
	 * B6 Money — M2 Amount.
	 * Amount first: one required field and a keypad. Direction is the only
	 * other thing asked here, because it flips the sign and cannot be
	 * inferred safely. The keypad is custom, so the system keyboard stays
	 * reachable — see the accessibility notes in docs/chief.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Seg, Amt, Btn, Note } from '$lib/kit';

	let dir = $state(0);
	let amount = $state('1240.00');
</script>

<svelte:head><title>Amount · Chief</title></svelte:head>

<Screen back="/records/money" nav={false}>
	<Seg t="warm" a="Cash out" b="Cash in" bind:active={dir} />
	<Amt bind:value={amount} meta="Type the amount. Everything else is a guess you can correct." />
	<Btn t="warm" href="/records/money/confirm" label="Next" />
	<Note
		>Direction is the only other thing asked here, because it flips the sign and cannot be inferred
		safely.</Note
	>
</Screen>
