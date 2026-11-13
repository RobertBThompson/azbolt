<script>
	/**
	 * Money — add a liability, from memory.
	 *
	 * Step one is what you already know without looking anything up: what
	 * kind it is, who it is owed to, what it is secured on and roughly
	 * how much is left. That is enough for the liability to exist and to
	 * be counted against net worth.
	 *
	 * The lender and the asset are asked here, not left for later,
	 * because they are what tie the debt to the rest of the book.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Prog, Field, Select, Btn } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { LOAN_TYPES, activeAssets } from '$lib/assets.js';

	const orgs = Object.entries(ORGS).map(([key, o]) => ({ value: key, label: o.name }));
	const assets = activeAssets().map((a) => ({ value: a.id, label: a.name }));

	let name = $state('');
	let type = $state('');
	let lender = $state('');
	let asset = $state('');
	let balance = $state('');
</script>

<svelte:head><title>Add liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities" nav={false}>
	<Prog t="warm" title="From memory" value={0.5} meta="Step 1 of 2 · what you already know" />
	<Field label="Name" placeholder="For example: house note" bind:value={name} />
	<Select
		label="Loan type"
		options={LOAN_TYPES}
		bind:value={type}
		placeholder="Loan, lease, contract…"
	/>
	<Select label="Lender" options={orgs} bind:value={lender} placeholder="Organization" />
	<Select label="Secured against" options={assets} bind:value={asset} placeholder="Asset" />
	<Field
		label="Current balance"
		type="money"
		placeholder="Approximate is fine"
		bind:value={balance}
	/>
	<Btn t="warm" href="/records/money/liabilities/new/paperwork" label="Next: the paperwork" />
</Screen>
