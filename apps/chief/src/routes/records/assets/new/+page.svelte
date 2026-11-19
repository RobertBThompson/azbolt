<script>
	/**
	 * Assets — add.
	 *
	 * A name is enough to save. A category and a value can be given now
	 * or later: an asset with no value is still kept, flagged as needing
	 * one and left out of every total until it has it, because a record
	 * you can find beats a record that is complete.
	 *
	 * Signed out, this walks through the sample flow and keeps nothing,
	 * and says so.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Prog, Field, Select, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ASSET_CATEGORIES,
		ORGS,
		SHARE_UNITS,
		dollars,
		isMoneyCategory,
		ownBook
	} from '$lib/assets.js';
	import { readAmount } from '$lib/amount.js';
	import { FOCUS_QUESTION } from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { addValuation, createAsset, createOwnership, selfOrganization } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();

	let name = $state('');
	const asked = $page.url.searchParams.get('category') ?? '';
	let category = $state(asked === 'all' || asked === 'none' ? '' : asked);
	/* Who owns it is asked here, with your own organization first and
	   chosen (Robert, 19 Nov: "it just needs owner"). Without one an
	   asset is in nobody's net worth and no sphere. YOU stands for your
	   own organization when it has not been made yet. */
	const YOU = 'you';
	const mine = Object.entries(ORGS).find(([, o]) => o.self)?.[0] ?? '';
	let owner = $state(mine || YOU);
	let value = $state('');
	let busy = $state(false);
	let fault = $state('');

	const categories = ASSET_CATEGORIES.map((c) => ({ value: c.id, label: c.name }));
	const owners = [
		{
			value: mine || YOU,
			/* Your own organization is already named "… (me)" when it is made. */
			label: !mine
				? 'You'
				: /\(me\)\s*$/.test(ORGS[mine].name)
					? ORGS[mine].name
					: `${ORGS[mine].name} (you)`
		},
		...Object.entries(ORGS)
			.filter(([id]) => id !== mine)
			.map(([id, o]) => ({ value: id, label: o.name }))
	];
	const back = '/records';

	/* A money account: a bank account, cash, a wallet. Its value is its
	   balance. */
	const isMoney = $derived(isMoneyCategory(category));

	/* Now is the focus, Soon is next, Later is on the back burner
	   (Robert, 19 Nov). Done is letting it go, recorded afterwards. */
	const STANDING = ['Now', 'Soon', 'Later'];
	let standing = $state('Now');

	const amount = $derived(readAmount(value));
	const badValue = $derived(value.trim() !== '' && amount === null);
	const ready = $derived(name.trim() !== '' && !badValue);

	/** @param {SubmitEvent} e */
	async function create(e) {
		e.preventDefault();
		if (!ready || busy) return;
		if (!own) return goto('/records/assets/new/attributes');
		busy = true;
		fault = '';
		try {
			const id = await createAsset({ name, category, money: isMoney, state: standing });
			if (amount !== null) await addValuation(id, dollars(amount), today());
			/* Wholly the owner chosen, so it counts in their net worth from
			   the start. Shares are changed under Ownership. */
			const holder = owner === YOU ? (await selfOrganization())?.id : owner;
			if (holder) {
				await createOwnership(
					{ cls: 'organization', id: holder },
					{ cls: 'asset', id },
					'Owner',
					SHARE_UNITS,
					today()
				);
			}
			await reopenBook();
			/* Back to your assets, on the tab it was put in, where it now is.
			   The rest of its record can be filled in later. */
			await goto(standing === 'Now' ? '/records' : `/records?state=${standing.toLowerCase()}`, {
				replaceState: true
			});
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>{isMoney ? 'Add account' : 'Add asset'} · Chief</title></svelte:head>

<Screen {back}>
	{#if !own}
		<Prog t="warm" title="The record" value={0.5} meta="Step 1 of 2 · only the name is required" />
	{/if}
	<form onsubmit={create}>
		<Field
			label={isMoney ? 'Account name' : 'Asset name'}
			placeholder={isMoney ? 'For example: Capital One 5246' : 'Required'}
			bind:value={name}
			required
		/>
		<Select
			label="Category"
			options={categories}
			bind:value={category}
			placeholder="Choose category"
		/>
		<Select label={FOCUS_QUESTION} options={STANDING} bind:value={standing} />
		<Select label="Owner" options={owners} bind:value={owner} />
		<Field
			label={isMoney ? 'Balance today' : 'What it is worth today'}
			type="money"
			placeholder="Optional"
			bind:value
		/>
		{#if badValue}<Note>That is not an amount. Use figures, like 24,500.</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			type="submit"
			label={own
				? busy
					? 'Saving…'
					: isMoney
						? 'Save account'
						: 'Save asset'
				: 'Create asset draft'}
			disabled={!ready || busy}
		/>
	</form>
	<Note>
		{#if own && isMoney}
			Name it the way you would say it: the bank and the last four digits, or the wallet. Never the
			full account number. It is recorded as yours; change that under Ownership if it is held by
			something else. Update the balance as often as suits you; the readings make the trend.
		{:else if own}
			Only the name is required. Without a value it is left out of totals until it has one. It is
			saved as wholly owned by the owner chosen; shares can be changed later under Ownership.
		{:else}
			This is the sample flow: nothing typed here is kept. Sign in to add your own.
		{/if}
	</Note>
</Screen>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}
</style>
