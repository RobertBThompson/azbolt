<script>
	/**
	 * B8 — G13 Export.
	 * One file with everything the account holds, exactly as it is
	 * stored. Nothing is chosen and nothing is left out, removed records
	 * included: a copy with gaps is not a copy.
	 *
	 * It is put together on this device and saved straight to it. It is
	 * not encrypted and is not kept anywhere else, and the screen says
	 * so rather than implying a vault.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Alert, Banner, Btn, Facts, Note } from '$lib/kit';
	import { session } from '$lib/session.svelte.js';
	import { exportAccount } from '$lib/pb.js';
	import { today } from '$lib/today.js';

	let busy = $state(false);
	let fault = $state('');
	/** @type {{ label: string, value: string }[]} */
	let counts = $state([]);
	let missing = $state(/** @type {string[]} */ ([]));

	const words = (/** @type {string} */ name) =>
		name.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

	async function download() {
		if (busy) return;
		busy = true;
		fault = '';
		try {
			const copy = await exportAccount();
			counts = Object.entries(copy.collections)
				.filter(([, rows]) => rows.length)
				.map(([name, rows]) => ({ label: words(name), value: String(rows.length) }));
			missing = copy.missing;
			const url = URL.createObjectURL(
				new Blob([JSON.stringify(copy, null, 2)], { type: 'application/json' })
			);
			const a = document.createElement('a');
			a.href = url;
			a.download = `chief-${today()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
		}
		busy = false;
	}
</script>

<svelte:head><title>Export · Chief</title></svelte:head>

<Screen back="/settings/account/data" nav={false}>
	<Banner title="A copy of everything" meta="Nothing is changed or removed by an export." />
	{#if session.signedIn}
		<Btn
			label={busy ? 'Putting it together…' : 'Download a copy'}
			onclick={download}
			disabled={busy}
		/>
		{#if fault}<Alert title="Not exported" meta={fault} />{/if}
		{#if counts.length}
			<Facts items={counts} />
		{:else if !busy && !fault && counts.length === 0 && missing.length === 0}
			<Note>
				One file, in JSON, with every record you hold — the ones you have removed from view too.
			</Note>
		{/if}
		{#if missing.length}
			<Alert
				title="This server is behind the app"
				meta="Not found, so not in the copy: {missing.map(words).join(', ')}."
			/>
		{/if}
		<Note>
			The file is saved to this device as it is: not encrypted, and not kept anywhere else. Notes
			and documents live on this device, not in your account, and are not in it.
		</Note>
	{:else}
		<Note>Sign in to export. The records on show signed out are samples, not yours.</Note>
		<Btn href="/signin" label="Sign in" />
	{/if}
</Screen>
