<script>
	/**
	 * Money — edit a liability.
	 * Editing keeps the same knowledge boundary as creation instead of
	 * flattening everything into one dense form: what you know from
	 * memory, then what is on the paperwork. Both halves are saved
	 * together, whichever is showing.
	 *
	 * An empty rate means "I don't know yet", which is an answer. A
	 * missing rate is the commonest reason a debt never gets written
	 * down, so it never blocks.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, PageHead, Tabs, Field, Select, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { LIABILITIES, LOAN_TYPES, ORGS, activeAssets, dollars, ownBook } from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { archive, updateLiability } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();
	const id = $page.params.id ?? '';
	const l = LIABILITIES[id];

	const orgs = Object.entries(ORGS).map(([key, o]) => ({ value: key, label: o.name }));
	const assets = activeAssets().map((a) => ({ value: a.id, label: a.name }));

	/** Cents as the figure a person types. @param {number} cents */
	const typed = (cents) => (cents ? String(cents / 100) : '');

	let active = $state($page.url.searchParams.has('paperwork') ? 1 : 0);
	let name = $state(l.name);
	let type = $state(l.type);
	let lender = $state(l.lender ?? '');
	let asset = $state(l.asset ?? '');
	let balance = $state(typed(l.balance));
	let started = $state(l.day ?? '');
	let startAmount = $state(typed(l.startAmount));
	let rate = $state(l.rate ? String(l.rate) : '');
	let payment = $state(typed(l.payment));
	let frequency = $state(/** @type {string} */ (l.frequency));
	let months = $state(l.months ? String(l.months) : '');
	let dueDay = $state(l.dueDay ? String(l.dueDay) : '');

	let busy = $state(false);
	let fault = $state('');
	let confirming = $state(false);

	/**
	 * An empty box is "not known", which is allowed. Anything typed has
	 * to read as a number.
	 * @param {string} text
	 * @returns {number|null|undefined} the number, null for empty, undefined for unreadable
	 */
	const figure = (text) => {
		if (text.trim() === '') return null;
		const n = readAmount(text);
		return n === null ? undefined : n;
	};

	const wrong = $derived(
		figure(balance) === undefined
			? 'The balance is not an amount.'
			: figure(startAmount) === undefined
				? 'The start amount is not an amount.'
				: figure(payment) === undefined
					? 'The payment is not an amount.'
					: figure(rate) === undefined || (figure(rate) ?? 0) > 100
						? 'The rate is a percentage, like 6.5.'
						: figure(months) === undefined || !Number.isInteger(figure(months) ?? 0)
							? 'The term is a whole number of months.'
							: figure(dueDay) === undefined ||
								  !Number.isInteger(figure(dueDay) ?? 1) ||
								  (figure(dueDay) ?? 1) < 1 ||
								  (figure(dueDay) ?? 1) > 31
								? 'The due day is a day of the month, 1 to 31.'
								: started > today()
									? 'It cannot have started in the future.'
									: lender !== '' && lender === l.borrower
										? 'An organization does not owe itself.'
										: ''
	);
	const ready = $derived(name.trim() !== '' && !wrong);

	/** @param {string} text */
	const cents = (text) => {
		const n = figure(text);
		return n == null ? null : dollars(n);
	};

	async function save() {
		if (!ready || busy) return;
		busy = true;
		fault = '';
		try {
			await updateLiability(id, {
				name,
				type,
				lender,
				asset,
				balance: cents(balance),
				startAmount: cents(startAmount),
				payment: cents(payment),
				rate: figure(rate) ?? null,
				frequency,
				months: figure(months) ?? null,
				dueDay: figure(dueDay) ?? null,
				started
			});
			await reopenBook();
			await goto(`/records/money/liabilities/${id}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}

	async function remove() {
		busy = true;
		fault = '';
		try {
			await archive('liabilities', id);
			await reopenBook();
			await goto('/records/money/liabilities', { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Edit liability · Chief</title></svelte:head>

<Screen back="/records/money/liabilities/{id}" nav={false}>
	<PageHead eyebrow={l.name} title="Edit liability" />
	<Tabs items={['From memory', 'Paperwork']} {active} onpick={(i) => (active = i)} />
	{#if active === 0}
		{#if own}<Field label="Name" bind:value={name} required />{/if}
		<Select label="Loan type" options={LOAN_TYPES} bind:value={type} />
		<Select label="Lender" options={orgs} bind:value={lender} placeholder="Organization" />
		<Select label="Secured against" options={assets} bind:value={asset} placeholder="Asset" />
		<Field label="Current balance" type="money" placeholder="Amount left" bind:value={balance} />
	{:else}
		{#if own}
			<Field label="Starting date" type="date" bind:value={started} />
			<Field
				label="Start amount"
				type="money"
				placeholder="What was borrowed"
				bind:value={startAmount}
			/>
		{/if}
		<Field label="Interest rate" type="money" placeholder="I don't know yet" bind:value={rate} />
		<Field label="Payment amount" type="money" placeholder="Each payment" bind:value={payment} />
		<Select label="Frequency" options={['Monthly', 'Quarterly', 'Yearly']} bind:value={frequency} />
		{#if own}
			<Field
				label="Due on day of the month"
				type="money"
				placeholder="1 to 31"
				bind:value={dueDay}
			/>
		{/if}
		<Field label="Term in months" type="money" placeholder="How long in all" bind:value={months} />
	{/if}
	{#if own}
		{#if wrong}<Note>{wrong}</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Save changes'}
			onclick={save}
			disabled={!ready || busy}
		/>
		{#if confirming}
			<Alert
				title="Remove {l.name}?"
				meta="For a debt entered by mistake or paid off. It stops counting against net worth; its record is kept."
			/>
			<Btn t="alert" label="Yes, remove it" onclick={remove} disabled={busy} />
			<Btn primary={false} label="Keep it" onclick={() => (confirming = false)} />
		{:else}
			<Btn primary={false} label="Remove this liability" onclick={() => (confirming = true)} />
		{/if}
	{:else}
		<Btn t="warm" label="Save changes" soon />
	{/if}
</Screen>
