<script>
	/**
	 * Says where the records on screen came from. Showing design fixtures
	 * as though they were the user's own records is the one failure this
	 * layer must not have, so the admission goes on the screen rather than
	 * into a console log.
	 *
	 * 'anon' gets its own wording and a way out: the backend is working
	 * and the rows are hidden only because nothing is signed in.
	 *
	 * 'error' is louder than the rest, and is the only one that is not a
	 * footnote: the list above it is empty because a read failed, not
	 * because there is nothing there, and the difference matters.
	 */
	/** @type {{ source: 'live'|'anon'|'fixture'|'error', error?: string, onretry?: (() => void)|null }} */
	let { source, error = '', onretry = null } = $props();
</script>

{#if source === 'fixture'}
	<p class="src">Showing design placeholders — no backend connected.</p>
{:else if source === 'anon'}
	<p class="src">
		Showing design placeholders — <a href="/signin">sign in</a> to see your own records.
	</p>
{:else if source === 'error'}
	<div class="failed">
		<p class="t">This did not load</p>
		<p class="m">{error || 'The server did not answer.'} Nothing has been changed.</p>
		{#if onretry}
			<button type="button" onclick={onretry}>Try again</button>
		{/if}
	</div>
{/if}

<style>
	.failed {
		padding: 16px;
		border: 1px solid color-mix(in srgb, var(--tone-alert) 45%, #ffffff);
		border-radius: var(--r-sm);
		background: color-mix(in srgb, var(--tone-alert) 10%, #ffffff);
		color: var(--ink);
	}
	.failed .t {
		margin: 0 0 5px;
		font-size: 16.5px;
		font-weight: 700;
	}
	.failed .m {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.4;
		color: var(--ink-2);
	}
	.failed button {
		margin-top: 11px;
		min-height: var(--tap-min);
		padding: 0 18px;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-family: var(--font-display);
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
	}

	.src {
		margin: 0;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: var(--on-field-3);
		text-align: center;
		padding: 2px 0 4px;
	}
	.src a {
		color: var(--on-field);
	}
</style>
