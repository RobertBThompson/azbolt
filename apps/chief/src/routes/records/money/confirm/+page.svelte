<script>
	/**
	 * B6 Money — M3 Confirm.
	 * Four tokens, each a 45pt target opening a short picker. The default
	 * guess comes from the last similar entry and the active context, and is
	 * right most of the time.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Chips, Seg, Btn, Note } from '$lib/kit';

	let kind = $state(0);
</script>

<svelte:head><title>Confirm · Chief</title></svelte:head>

<Screen back="/records/money/amount" nav={false}>
	<Banner
		t="warm"
		title="Cash out · Azbolt · Software · today"
		meta="Tap any part of the sentence to change it."
	/>
	<Chips t="warm" items={['Cash out', 'Azbolt', 'Software', 'Today']} active={-1} />
	<Seg t="warm" a="One-off" b="Recurring" bind:active={kind} />
	<Btn t="warm" href="/records/money" label="Save it" />
	<Note
		>Recurring is asked here rather than during entry, because it is the only decision that changes
		what the number means later.</Note
	>
</Screen>
