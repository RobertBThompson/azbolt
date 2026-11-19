<script>
	/**
	 * B5 — E8 Add proof.
	 * A filename is not evidence. Chief asks what the item proves, where
	 * it came from, and where it is kept — and takes the file's
	 * fingerprint, so that wherever it lives it can later be shown to be
	 * the same file.
	 *
	 * Three places a proof can be kept: here on the Chief server; somewhere
	 * else, with Chief holding only where and the fingerprint; or on
	 * paper, where there is no file and the Chief's own look is the check.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Chips, Field, Row, Select, Btn, Note } from '$lib/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ASSETS, CLAIM_KINDS, ownBook } from '$lib/assets.js';
	import { reopenBook } from '$lib/book.svelte.js';
	import { fileSize, fingerprint, shortHash } from '$lib/hash.js';
	import { createClaim } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	const own = ownBook();
	const id = $page.params.id ?? '';
	const a = ASSETS[id];

	const PLACES = [
		{ value: 'server', label: 'On the Chief server' },
		{ value: 'elsewhere', label: 'Somewhere else — a drive, a link, a person' },
		{ value: 'paper', label: 'On paper' }
	];
	/** Twenty megabytes: what the server will take for one file. */
	const LIMIT = 20 * 1024 * 1024;

	let kind = $state('');
	let title = $state('');
	let source = $state('');
	let storage = $state('server');
	let location = $state('');

	let file = $state(/** @type {File|null} */ (null));
	let hash = $state('');
	let reading = $state(false);
	let busy = $state(false);
	let fault = $state('');

	/** @param {Event} e */
	async function chose(e) {
		const picked = /** @type {HTMLInputElement} */ (e.currentTarget).files?.[0] ?? null;
		file = picked;
		hash = '';
		fault = '';
		if (!picked) return;
		if (!title.trim()) title = picked.name.replace(/\.[^.]+$/, '');
		reading = true;
		try {
			hash = await fingerprint(await picked.arrayBuffer());
		} catch {
			fault = 'That file could not be read.';
			file = null;
		}
		reading = false;
	}

	const tooBig = $derived(storage === 'server' && !!file && file.size > LIMIT);
	const wrong = $derived(
		!kind
			? 'Say what it proves.'
			: !title.trim()
				? 'Give it a title.'
				: storage === 'server' && !file
					? 'Choose the file to keep.'
					: tooBig
						? 'That file is over 20 MB. Keep it somewhere else and record where.'
						: storage !== 'server' && !location.trim()
							? 'Say where it is kept.'
							: reading
								? 'Taking its fingerprint…'
								: ''
	);

	async function save() {
		if (wrong || busy) return;
		busy = true;
		fault = '';
		/** @type {'server'|'elsewhere'|'paper'} */
		const where = storage === 'paper' ? 'paper' : storage === 'elsewhere' ? 'elsewhere' : 'server';
		try {
			const made = await createClaim({
				asset: id,
				kind,
				title,
				source,
				storage: where,
				location: storage === 'server' ? '' : location,
				hash: storage === 'paper' ? '' : hash,
				size: storage === 'paper' || !file ? 0 : file.size,
				fileName: storage === 'paper' || !file ? '' : file.name,
				file: storage === 'server' ? file : null,
				// Fingerprinted a moment ago from the file itself, so it has
				// been checked today. Paper, and a place with no file given,
				// have not been.
				checked: storage !== 'paper' && hash ? today() : ''
			});
			await reopenBook();
			await goto(`/records/assets/${id}/proof/${made}`, { replaceState: true });
		} catch (/** @type {any} */ err) {
			fault = err?.response?.data?.file
				? 'The server would not take that file. It may be too large.'
				: err?.message || 'The server did not answer.';
			busy = false;
		}
	}
</script>

<svelte:head><title>Add proof · Chief</title></svelte:head>

<Screen back="/records/assets/{id}/proof" nav={false}>
	<Banner t="warm" title="What does this prove?" meta="Link it to the asset claim it supports." />
	{#if own}
		<Select label="It is a" options={CLAIM_KINDS} bind:value={kind} placeholder="Kind of proof" />
		<Field label="Title" placeholder="For example: storage confirmation" bind:value={title} />
		<Field label="Source" placeholder="Issuer, person or URL" bind:value={source} />
		<Row t="warm" title="Supports" meta={a.name} />
		<Select label="Where it is kept" options={PLACES} bind:value={storage} />

		{#if storage !== 'server'}
			<Field
				label={storage === 'paper' ? 'Where the paper is' : 'Where it is'}
				placeholder={storage === 'paper'
					? 'For example: the safe, top shelf'
					: 'A link, a folder, or who has it'}
				bind:value={location}
			/>
		{/if}

		{#if storage !== 'paper'}
			<label class="file">
				<span class="lb">
					{storage === 'server' ? 'The file' : 'The file, to take its fingerprint (optional)'}
				</span>
				<input type="file" onchange={chose} />
				{#if file}
					<span class="got">
						{file.name} · {fileSize(file.size)}
						{#if hash}· fingerprint {shortHash(hash)}{/if}
					</span>
				{/if}
			</label>
		{/if}

		{#if wrong && (title.trim() || file || location.trim())}<Note>{wrong}</Note>{/if}
		{#if fault}<Alert title="Not saved" meta={fault} />{/if}
		<Btn
			t="warm"
			label={busy ? 'Saving…' : 'Put it on file'}
			onclick={save}
			disabled={!!wrong || busy}
		/>

		<Note>
			{#if storage === 'server'}
				The file is kept on the Chief server and opens only for you. Its fingerprint is kept beside
				it, so it can be checked later for any change.
			{:else if storage === 'elsewhere'}
				Chief keeps where it is and, if you choose the file here, its fingerprint. The file itself
				is not sent anywhere. Later, the fingerprint says whether that copy is still the same.
			{:else}
				Chief keeps where the paper is. There is no file to fingerprint, so it is checked when you
				say you have looked at it.
			{/if}
		</Note>
	{:else}
		<Chips t="warm" items={['Document', 'Photo', 'Link']} />
		<Field label="Title" placeholder="For example: storage confirmation" />
		<Field label="Source" placeholder="Issuer, person or URL" />
		<Row t="warm" title="Supports" meta={a.name} trailing="›" />
		<Btn t="warm" href="/records/assets/{id}/proof/record" label="Save for verification" />
		<Note
			>This is the sample flow: nothing here is kept. Sign in to put your own proof on file.</Note
		>
	{/if}
</Screen>

<style>
	.file {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.lb {
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--on-field-2);
	}
	.file input {
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
	.got {
		font-size: 14px;
		color: var(--on-field);
		overflow-wrap: anywhere;
	}
</style>
