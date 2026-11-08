<script>
	/**
	 * What a signed-in account sees before it has any records.
	 *
	 * An empty list and a broken list look identical, so this says which
	 * one it is and offers the one action that proves the round trip:
	 * writing the design fixtures in as real, owned records.
	 */
	/** @type {{ what: string, onseed: () => Promise<void>|void }} */
	let { what, onseed } = $props();

	let busy = $state(false);
	let error = $state('');

	async function run() {
		busy = true;
		error = '';
		try {
			await onseed();
		} catch (/** @type {any} */ err) {
			error = err?.message || 'Could not write the sample records.';
		} finally {
			busy = false;
		}
	}
</script>

<div class="empty">
	<p class="t">No {what} yet</p>
	<p class="m">
		You are signed in and this list is genuinely empty — nothing is failing. Add the sample
		directory to see records come back from the backend.
	</p>
	<button type="button" onclick={run} disabled={busy}>
		{busy ? 'Writing…' : 'Add sample directory'}
	</button>
	{#if error}<p class="e">{error}</p>{/if}
</div>

<style>
	.empty {
		border: 1px dashed var(--line-2);
		border-radius: 12px;
		padding: 16px 14px;
		text-align: center;
		background: var(--card);
	}
	.t {
		margin: 0 0 5px;
		font-weight: 600;
		font-size: 14px;
		color: var(--ink);
	}
	.m {
		margin: 0 0 11px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--ink-3);
	}
	button {
		min-height: var(--tap-min);
		padding: 0 16px;
		border-radius: 11px;
		border: 1px solid var(--tone-cool);
		background: var(--tone-cool);
		color: #ffffff;
		font-family: inherit;
		font-size: 13.5px;
		font-weight: 600;
	}
	button:disabled {
		opacity: 0.5;
	}
	.e {
		margin: 9px 0 0;
		font-size: 12px;
		color: var(--tone-alert-ink);
	}
</style>
