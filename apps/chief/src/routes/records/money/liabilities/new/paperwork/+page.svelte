<script>
	/**
	 * Money — add a liability, from the paperwork.
	 * Step two is the look-up step, and it is skippable. The liability
	 * already exists after step one, so abandoning here loses nothing.
	 * "I don't know yet" is an explicit answer on the rate rather than a
	 * blocking required number — a missing rate is the single most common
	 * reason a debt never gets recorded.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Select, Btn } from '$lib/kit';

	let started = $state('');
	let amount = $state('');
	let rate = $state('');
	let payment = $state('');
	let frequency = $state('Monthly');
	let months = $state('');
</script>

<svelte:head><title>Paperwork · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/new" nav={false}>
	<Prog
		t="warm"
		title="From the paperwork"
		value={1}
		meta="Step 2 of 2 · you may need to look these up"
	/>
	<Field label="Starting date" type="date" bind:value={started} />
	<Field label="Start amount" type="money" placeholder="What was borrowed" bind:value={amount} />
	<Field label="Interest rate" type="money" placeholder="I don't know yet" bind:value={rate} />
	<Field label="Payment amount" type="money" placeholder="Each payment" bind:value={payment} />
	<Select label="Frequency" options={['Monthly', 'Quarterly']} bind:value={frequency} />
	<Field label="Term in months" type="money" placeholder="How long in all" bind:value={months} />
	<Btn t="warm" href="/records/money/liabilities" label="Save liability" />
	<Btn primary={false} href="/records/money/liabilities" label="Save without this" />
</Screen>
