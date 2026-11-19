<script>
	/**
	 * B5 — E9 Evidence record.
	 * Verification is explainable at record level: what it proves, where
	 * it came from, where it is kept, and the check behind the tick. A
	 * green word without those would be a trust badge, not evidence.
	 *
	 * The check is the same wherever the file lives: take its
	 * fingerprint again and compare it with the one taken when the claim
	 * was made. A file kept here is fetched and compared; a file kept
	 * elsewhere is compared when you choose it; paper is checked when
	 * you say you have looked at it.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Facts, Row, Btn, Note, Delete, Field, Select } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		ASSETS,
		CLAIM_KINDS,
		CLAIM_STORAGE,
		claimOf,
		dayLabel,
		inSentence
	} from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { fileSize, fingerprint } from '$lib/hash.js';
	import {
		destroy,
		claimFile,
		claimFileUrl,
		markClaimChecked,
		markClaimFailed,
		updateClaim
	} from '$lib/pb.js';
	import { dateOf } from '$lib/work.js';
	import { today } from '$lib/today.js';

	const id = $page.params.id ?? '';
	const a = ASSETS[id];
	/* Guarded in +page.js; read once so the screen does not empty as it leaves. */
	const c = /** @type {import('$lib/assets.js').Claim} */ (claimOf(id, $page.params.claim ?? ''));

	let checked = $state(c.checked ?? '');
	let editing = $state(false);
	let kind = $state(/** @type {string} */ (c.kind));
	let title = $state(c.title ?? '');
	let source = $state(c.source ?? '');
	let location = $state(c.location ?? '');

	const save = () =>
		run(async () => {
			await updateClaim(c.id ?? '', { kind, title, source, location });
			await reopenBook();
			// A fresh screen, so what was saved is what is shown.
			await goto(`/records/assets/${id}/proof`, { replaceState: true });
		});
	let busy = $state(false);
	let fault = $state('');
	let verdict = $state(/** @type {''|'same'|'changed'} */ (''));
	let found = $state('');

	const place = CLAIM_STORAGE[c.storage ?? 'paper'];
	const standing = $derived(
		verdict === 'changed'
			? 'Failed its check today'
			: checked
				? `Checked ${inSentence(dayLabel(dateOf(checked)))}`
				: c.hash
					? 'Not checked since it was put on file'
					: 'Not checked'
	);

	/** @param {ArrayBuffer} bytes */
	async function compare(bytes) {
		found = await fingerprint(bytes);
		if (found === c.hash) {
			await markClaimChecked(c.id ?? '', today());
			checked = today();
			verdict = 'same';
			await reopenBook();
		} else {
			// An earlier tick does not survive a failed check.
			await markClaimFailed(c.id ?? '');
			checked = '';
			verdict = 'changed';
			await reopenBook();
		}
	}

	/** @param {() => Promise<void>} work */
	async function run(work) {
		if (busy) return;
		busy = true;
		fault = '';
		verdict = '';
		try {
			await work();
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
		}
		busy = false;
	}

	const checkStored = () => run(async () => compare(await claimFile(c.id ?? '', c.stored ?? '')));

	/** @param {Event} e */
	function checkChosen(e) {
		const picked = /** @type {HTMLInputElement} */ (e.currentTarget).files?.[0];
		if (picked) run(async () => compare(await picked.arrayBuffer()));
	}

	const seen = () =>
		run(async () => {
			await markClaimChecked(c.id ?? '', today());
			checked = today();
			await reopenBook();
		});

	const open = () =>
		run(async () => {
			window.open(await claimFileUrl(c.id ?? '', c.stored ?? ''), '_blank', 'noopener');
		});
</script>

<svelte:head><title>{c.title} · Chief</title></svelte:head>

<Screen back="/records/assets/{id}/proof" nav={false}>
	{#if editing}
		<Select label="It is a" options={CLAIM_KINDS} bind:value={kind} />
		<Field label="Title" bind:value={title} required />
		<Field label="Source" placeholder="Issuer, person or URL" bind:value={source} />
		{#if c.storage !== 'server'}
			<Field
				label={c.storage === 'paper' ? 'Where the paper is' : 'Where it is'}
				bind:value={location}
			/>
		{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Save changes'}
			onclick={save}
			disabled={busy || !title.trim()}
		/>
		<Btn primary={false} label="Cancel" onclick={() => (editing = false)} />
		<Note
			>The file and its fingerprint are not changed here. A different file is a different proof.</Note
		>
	{:else}
		<Banner t="warm" title={c.title ?? c.kind} meta="{c.kind} · {standing}" />
		<Row t="warm" title="Source" meta={c.source || 'Not given'} />
		<Row t="warm" href="/records/assets/{id}" title="Supports" meta={a.name} trailing="↗" />
		<Row t="warm" title="Kept" meta={c.storage === 'server' ? place : `${place} · ${c.location}`} />
		{#if c.hash}
			<Facts
				items={[
					{ label: 'File', value: c.fileName || '—' },
					{ label: 'Size', value: c.size ? fileSize(c.size) : '—' }
				]}
			/>
			<div class="print">
				<span class="lb">Fingerprint · SHA-256</span>
				<code>{c.hash}</code>
			</div>
		{/if}

		{#if verdict === 'same'}
			<Banner
				t="warm"
				title="It is the same file"
				meta="Its fingerprint matches the one on record."
			/>
		{:else if verdict === 'changed'}
			<Alert
				title="That is not the same file"
				meta="Its fingerprint is {found.slice(0, 8)}…{found.slice(
					-8
				)}, not the one on record. It was changed, or it is a different file. This proof no longer counts as checked."
			/>
		{/if}
		{#if fault}<Alert title="Could not check" meta={fault} />{/if}

		{#if c.storage === 'server' && c.stored}
			<Btn
				t="warm"
				label={busy ? 'Checking…' : 'Check the file'}
				onclick={checkStored}
				disabled={busy}
			/>
			<Btn primary={false} label="Open the file" onclick={open} disabled={busy} />
		{:else if c.hash}
			<label class="pick">
				<span class="lb">Check a copy against the fingerprint</span>
				<input type="file" onchange={checkChosen} disabled={busy} />
			</label>
		{:else}
			<Btn
				t="warm"
				label={busy ? 'Saving…' : 'I have looked at it today'}
				onclick={seen}
				disabled={busy}
			/>
		{/if}
		<Btn primary={false} label="Edit" onclick={() => (editing = true)} disabled={busy} />
	{/if}
	<Delete
		what="this proof"
		warn={c.storage === 'server'
			? 'The record and the file kept on the server both go.'
			: 'The record goes. The file or paper itself is not touched.'}
		label="Delete this proof"
		ondelete={async () => {
			await destroy('claims', c.id ?? '');
			await reopenBook();
			await goto(`/records/assets/${id}/proof`, { replaceState: true });
		}}
	/>

	<Note>
		{#if c.hash}
			A fingerprint is worked out from every byte of a file. The same file always gives the same
			one; a single change gives a different one.
		{:else if c.storage === 'paper'}
			Paper has no fingerprint. The check is that you have seen it, and the day you did.
		{:else}
			No file was chosen when this was put on file, so there is no fingerprint to check against.
		{/if}
	</Note>
</Screen>

<style>
	.print {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 12px 14px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
	}
	.lb {
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	code {
		font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--ink);
		overflow-wrap: anywhere;
	}
	.pick {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.pick .lb {
		color: var(--on-field-2);
	}
	.pick input {
		min-height: var(--tap-min);
		padding: 9px 12px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--card);
		font: inherit;
		font-size: 15px;
		color: var(--ink);
		box-shadow: var(--glass-shadow);
	}
</style>
