<script>
	/**
	 * B6 Money — M6 Add · from paperwork.
	 * Step two is the look-up step, and it is skippable. The liability
	 * already exists after step one, so abandoning here loses nothing.
	 * "I don't know yet" is an explicit answer on the rate rather than a
	 * blocking required number — a missing rate is the single most common
	 * reason a debt never gets recorded.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Row, Btn } from '$lib/kit';
</script>

<svelte:head><title>Paperwork · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/new" nav={false}>
	<Prog
		t="warm"
		title="From the paperwork"
		value={1}
		meta="Step 2 of 2 · you may need to look these up"
	/>
	<Field label="Interest rate" placeholder="I don't know yet" />
	<Field label="Payment & term" placeholder="Amount · frequency · end date" />
	<Row
		t="warm"
		href="/records/assets"
		title="Secured against an asset?"
		meta="Link an asset record"
		trailing="↗"
	/>
	<Btn t="warm" href="/records/money/liabilities" label="Save liability" />
	<Btn primary={false} href="/records/money/liabilities" label="Save without this" />
</Screen>
