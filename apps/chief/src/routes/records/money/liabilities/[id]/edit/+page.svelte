<script>
	/**
	 * Money — edit a liability.
	 * Editing keeps the same knowledge boundary as creation instead of
	 * flattening everything into one dense form: what you know from
	 * memory, then what is on the paperwork. Changes are dated so prior
	 * balances and terms remain explainable.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { PageHead, Tabs, Field, Select, Btn } from '$lib/kit';
	import { ORGS } from '$lib/data.js';
	import { page } from '$app/stores';
	import { LIABILITIES, LOAN_TYPES, activeAssets } from '$lib/assets.js';

	const id = $page.params.id ?? '';
	const l = LIABILITIES[id] ?? LIABILITIES['business-loan'];

	const orgs = Object.entries(ORGS).map(([key, o]) => ({ value: key, label: o.name }));
	const assets = activeAssets().map((a) => ({ value: a.id, label: a.name }));

	let active = $state(0);
	let type = $state(l.type);
	let lender = $state(l.lender ?? '');
	let asset = $state(l.asset ?? '');
	let balance = $state(String(l.balance));
	let rate = $state(l.rate ? String(l.rate) : '');
	let payment = $state(String(l.payment));
	let frequency = $state(/** @type {string} */ (l.frequency));
	let months = $state(String(l.months));
</script>

<svelte:head><title>Edit liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/{id}" nav={false}>
	<PageHead eyebrow={l.name} title="Edit liability" />
	<Tabs items={['From memory', 'Paperwork']} {active} onpick={(i) => (active = i)} />
	{#if active === 0}
		<Select label="Loan type" options={LOAN_TYPES} bind:value={type} />
		<Select label="Lender" options={orgs} bind:value={lender} placeholder="Organization" />
		<Select label="Secured against" options={assets} bind:value={asset} placeholder="Asset" />
		<Field label="Current balance" placeholder="Amount left" bind:value={balance} />
	{:else}
		<Field label="Interest rate" placeholder="I don't know yet" bind:value={rate} />
		<Field label="Payment amount" placeholder="Each payment" bind:value={payment} />
		<Select label="Frequency" options={['Monthly', 'Quarterly']} bind:value={frequency} />
		<Field label="Term in months" placeholder="How long in all" bind:value={months} />
	{/if}
	<Btn t="warm" href="/records/money/liabilities/{id}" label="Save changes" />
</Screen>
