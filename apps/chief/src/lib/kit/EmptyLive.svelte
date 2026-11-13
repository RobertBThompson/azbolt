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
		border: 1.5px dashed rgba(255, 255, 255, 0.9);
		border-radius: var(--r-md);
		padding: 20px 16px;
		text-align: center;
		background: var(--glass-dim);
		box-shadow: 0 12px 26px -12px rgba(30, 20, 90, 0.4);
	}
	.t {
		margin: 0 0 5px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 17px;
		color: var(--ink);
	}
	.m {
		margin: 0 0 13px;
		font-size: 14.5px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	button {
		min-height: var(--tap-min);
		padding: 0 22px;
		border-radius: 999px;
		border: 0;
		background: var(--gloss), linear-gradient(118deg, #4b8dd3 0%, #2f6aa8 45%, #204d7b 100%);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 10px 20px -8px rgba(32, 77, 123, 0.9);
		color: #ffffff;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
	}
	.e {
		margin: 9px 0 0;
		font-size: 14px;
		color: var(--tone-alert-ink);
	}
</style>
