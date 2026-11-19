<script>
	/**
	 * Assets — one asset.
	 *
	 * The head answers the three things asked of anything owned: who
	 * holds it, what it is worth, and whether that can be shown. Under it
	 * the page is the record's five parts, in the order they are needed:
	 * the proof, the attributes, what is owed against it, what work it is
	 * tied to, and what has happened to it.
	 *
	 * Verified, Insured and Stored are read off the claims on file. They
	 * are never set by hand, so the word cannot outlive the evidence.
	 *
	 * Where it stands — Now, Soon or Later — is set here, under its name
	 * (Robert, 19 Nov). Done is letting it go, which is recorded as what
	 * happened to it, so it is not a fourth button. The work on it is the
	 * tasks that name it, open first.
	 *
	 * The one fixed money account cannot be deleted or let go; it says so
	 * where the delete would be.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import {
		PageHead,
		Chips,
		SphereTags,
		Alert,
		Banner,
		Row,
		SectionHead,
		Facts,
		Btn,
		Blank,
		Delete,
		Note,
		Seg
	} from '$lib/kit';
	import { work } from '$lib/work.svelte.js';
	import { inOrder } from '$lib/work.js';
	import { ORGS } from '$lib/assets.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { reopenBook } from '$lib/book.svelte.js';
	import { destroy, updateAsset } from '$lib/pb.js';
	import {
		ASSETS,
		LIABILITIES,
		attention,
		cashAbout,
		cashThrough,
		direction,
		isMoneyCategory,
		valuesOf,
		categoryName,
		events,
		money,
		owedAgainst,
		transactions,
		ownBook,
		ownerLine,
		ownersOf,
		FOCUS_QUESTION,
		stateOf,
		statuses,
		valuedLine
	} from '$lib/assets.js';

	const id = $derived($page.params.id ?? '');
	const a = $derived(ASSETS[id]);
	const why = $derived(attention(id));
	const marks = $derived(statuses(a));
	const owners = $derived(ownersOf({ cls: 'asset', id }));
	const owed = $derived(owedAgainst(id));
	const history = $derived(events(id));

	/* A money account's value is its balance. Under it: the lines that
	   go through it. Any other asset shows the lines that are for it —
	   its own and those on what is owed against it. */
	const isMoney = $derived(isMoneyCategory(a.category));
	const readings = $derived(valuesOf(id));
	const moved = $derived(
		readings.length > 1
			? readings[readings.length - 1].amount - readings[readings.length - 2].amount
			: null
	);
	const lines = $derived(
		(isMoney
			? cashThrough(id)
			: [
					...cashAbout(id),
					...owed.flatMap((l) => transactions().filter((t) => t.liability === l.id && !t.asset))
				]
		).filter((t) => !t.of)
	);
	/** @param {import('$lib/assets.js').Tx} t */
	const amountOf = (t) => `${direction(t.type) === 'in' ? '+' : '−'}${money(t.amount)}`;
	/** @param {import('$lib/assets.js').Tx} t */
	const lineMeta = (t) =>
		[
			t.frequency,
			isMoney
				? t.liability
					? LIABILITIES[t.liability]?.name
					: t.asset
						? ASSETS[t.asset]?.name
						: direction(t.type) === 'in'
							? 'income'
							: 'a bill'
				: t.account
					? `through ${ASSETS[t.account]?.name ?? 'an account'}`
					: ''
		]
			.filter(Boolean)
			.join(' · ');

	const ownerHref = $derived(
		owners.length === 1
			? `/records/ownership/${owners[0].id}`
			: owners.length
				? `/records/ownership?owned=${id}`
				: `/records/ownership/add?owned=${id}`
	);

	let busy = $state(false);
	let fault = $state('');

	const STANDING = ['Now', 'Soon', 'Later'];
	// svelte-ignore state_referenced_locally
	let standing = $state(Math.max(0, STANDING.indexOf(stateOf(a))));
	/** @param {number} i */
	async function stand(i) {
		fault = '';
		try {
			await updateAsset(id, { state: STANDING[i] });
			await reopenBook();
		} catch (/** @type {any} */ err) {
			standing = Math.max(0, STANDING.indexOf(stateOf(a)));
			fault = err?.message || 'The server did not answer.';
		}
	}

	/* The tasks that name this asset: open ones in reading order, then done. */
	const tasks = $derived(
		inOrder(work.tasks.filter((t) => t.asset === id)).sort(
			(x, y) => Number(x.state === 'Done') - Number(y.state === 'Done')
		)
	);

	/* Letting go is a date on the record, so undoing a mistaken one is
	   clearing it. The line in the timeline stays: it did get recorded. */
	async function bringBack() {
		busy = true;
		fault = '';
		try {
			await updateAsset(id, { let_go: null, state: 'Now' });
			await reopenBook();
			await goto(`/records/assets/${id}/timeline`);
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
		}
	}

	const facts = $derived([
		{ label: 'Rights', value: a.rights || '—' },
		{ label: 'Period', value: a.period || '—' },
		{ label: 'Tangibility', value: a.tangibility },
		{ label: 'Liquidity', value: a.liquidity },
		{ label: 'Inventory', value: a.inventory },
		{ label: 'Quantity', value: String(a.quantity) }
	]);
</script>

<svelte:head><title>{a.name} · Chief</title></svelte:head>

<Screen back="/records" nav={false}>
	<PageHead eyebrow={categoryName(a.category)} title={a.name} meta={a.blurb} />
	{#if marks.length}<Chips t="warm" items={marks} active={-1} />{/if}
	<SphereTags keys={a.spheres} />

	{#if a.letGo}
		<Banner title="Let go" meta="No longer held. The record and its history stay." />
		{#if ownBook()}
			{#if fault}<Alert title="Not saved" meta={fault} />{/if}
			<Btn
				primary={false}
				label={busy ? 'Saving…' : 'It is still held — bring it back'}
				onclick={bringBack}
				disabled={busy}
			/>
		{/if}
	{:else}
		<!-- Shown greyed when signed out rather than hidden: a control that
		     is not there cannot be found, and samples cannot be changed. -->
		<Seg
			t="warm"
			label={FOCUS_QUESTION}
			items={STANDING}
			bind:active={standing}
			onpick={stand}
			disabled={!ownBook()}
			note={ownBook() ? '' : 'Sign in to change this. These are samples.'}
		/>
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		{#if why.length}
			<Note>Missing: {why.join(' · ')}</Note>
		{/if}
	{/if}

	<Row
		t="warm"
		href={ownerHref}
		title="Owner"
		meta={ownerLine(id)}
		trailing={owners.length ? '›' : '⚠'}
	/>
	<Row
		t="warm"
		href="/records/assets/{id}/valuation"
		title={isMoney ? 'Balance' : 'Value'}
		meta={isMoney && moved !== null
			? `${valuedLine(a).replace('reviewed', 'read')} · ${moved < 0 ? 'down' : 'up'} ${money(Math.abs(moved))} since the reading before`
			: isMoney
				? valuedLine(a).replace('reviewed', 'read')
				: valuedLine(a)}
		trailing={a.value === null ? '⚠' : '›'}
	/>
	{#if isMoney && ownBook() && !a.letGo}
		<Btn t="warm" href="/records/assets/{id}/valuation?update" label="Update balance" />
	{/if}

	<SectionHead label="Work on it" t="cool" count={tasks.filter((t) => t.state !== 'Done').length} />
	{#each tasks as t (t.id)}
		<Row
			t="cool"
			href="/work/tasks/{t.id}"
			title={t.name}
			meta={[
				t.state,
				t.effort ? `${t.effort.toLowerCase()} effort` : '',
				t.gain ? `should add ${money(t.gain)}` : ''
			]
				.filter(Boolean)
				.join(' · ')}
			trailing="›"
			quiet={t.state === 'Done'}
		/>
	{:else}
		<Blank>No task names it yet.</Blank>
	{/each}
	{#if ownBook() && !a.letGo}
		<Btn t="cool" primary={false} href="/work/tasks/new?asset={id}" label="Add a task for it" />
	{/if}

	<SectionHead
		label={isMoney ? 'Through this account' : 'Money tied to it'}
		t="warm"
		count={lines.length}
	/>
	{#each lines as t (t.id)}
		<Row
			t="warm"
			href="/records/money/entry/{t.id}"
			title={t.label}
			meta={lineMeta(t)}
			trailing={amountOf(t)}
		/>
	{:else}
		<Blank>
			{isMoney ? 'No payments say they go through this account.' : 'No payments are tied to it.'}
		</Blank>
	{/each}
	{#if ownBook() && !a.letGo && !isMoney}
		<Btn primary={false} href="/records/money/amount?for=asset:{id}" label="Add a payment for it" />
	{/if}
	{#if a.tangibility === 'Tangible'}
		<Row
			t="warm"
			href="/records/assets/{id}/movement"
			title="Storage and movement"
			meta={a.storage || 'Not recorded'}
			trailing={a.movement ? '⚠' : '›'}
		/>
	{/if}

	<SectionHead label="Claims & files" t="warm" count={a.claims.length} />
	{#each a.claims as c, i (i)}
		<Row
			t="warm"
			href="/records/assets/{id}/proof"
			title={c.kind}
			meta={c.detail}
			trailing={c.verified ? '✓' : '—'}
		/>
	{:else}
		<Blank>No proof on file. A claim with nothing behind it is only a say-so.</Blank>
	{/each}
	<Btn primary={false} href="/records/assets/{id}/proof/new" label="Add proof" />

	<SectionHead label="Attributes" t="warm" />
	<Facts items={facts} />
	<Btn primary={false} href="/records/assets/{id}/details" label="Edit attributes" />

	<SectionHead label="Owed against it" t="warm" count={owed.length} />
	{#each owed as l (l.id)}
		<Row
			t="warm"
			href="/records/money/liabilities/{l.id}"
			title={l.name}
			meta="{money(l.balance)} left · {l.lender ? ORGS[l.lender]?.name : 'lender not linked'}"
			trailing="›"
		/>
	{:else}
		<Blank>Nothing is owed against it.</Blank>
	{/each}

	<SectionHead label="Timeline" t="warm" count={history.length} />
	{#each history.slice(0, 3) as h, i (i)}
		<Row t="warm" title={h.type} meta={h.detail} trailing={h.when} />
	{:else}
		<Blank>Nothing recorded yet.</Blank>
	{/each}
	{#if history.length > 3}
		<Btn primary={false} href="/records/assets/{id}/timeline" label="Whole timeline" />
	{/if}

	{#if ownBook() && !a.letGo}
		<Btn t="warm" href="/records/assets/{id}/record" label="Record what happened" />
	{/if}
	<Btn t="ai" primary={false} href="/" label="Jot an asset update" />
	{#if ownBook() && a.fixed}
		<Note>
			Every book keeps one money account, so this one cannot be deleted or let go. Rename it to your
			bank, or to wherever the money is kept.
		</Note>
	{:else if ownBook()}
		<Delete
			what={a.name}
			warn="Its values, history, proofs and ownership links go with it. If it was sold or given away, record that it was let go instead, and it keeps its history."
			label="Delete this asset"
			ondelete={async () => {
				await destroy('assets', id);
				await reopenBook();
				await goto('/records/assets', { replaceState: true });
			}}
		/>
	{/if}
</Screen>
