<script>
	/**
	 * Delete a record, for good, in two taps.
	 *
	 * The same control on every kind of record, in the same place — the
	 * foot of the record's own page — so it never has to be looked for.
	 * The first tap says exactly what will go; the second does it.
	 *
	 * It deletes. Nothing is kept behind, so a name can be used again and
	 * a mistake leaves no trace. What cannot be deleted yet says why.
	 */
	/**
	 * @type {{
	 *   what: string, warn?: string, label?: string,
	 *   ondelete: () => Promise<unknown>
	 * }}
	 */
	let { what, warn = '', label = 'Delete', ondelete } = $props();
	import Alert from './Alert.svelte';
	import Btn from './Btn.svelte';

	let confirming = $state(false);
	let busy = $state(false);
	let fault = $state('');

	async function go() {
		if (busy) return;
		busy = true;
		fault = '';
		try {
			await ondelete();
		} catch (/** @type {any} */ err) {
			fault = err?.message || 'The server did not answer.';
			busy = false;
			confirming = false;
		}
	}
</script>

{#if fault}<Alert title="Not deleted" meta={fault} />{/if}
{#if confirming}
	<Alert title="Delete {what}?" meta="{warn} This cannot be undone." />
	<Btn t="alert" label={busy ? 'Deleting…' : 'Yes, delete it'} onclick={go} disabled={busy} />
	<Btn primary={false} label="Keep it" onclick={() => (confirming = false)} disabled={busy} />
{:else}
	<Btn primary={false} {label} onclick={() => ((confirming = true), (fault = ''))} />
{/if}
