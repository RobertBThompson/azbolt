<script>
	/**
	 * Says where the records on screen came from. Showing design fixtures
	 * as though they were the user's own records is the one failure this
	 * layer must not have, so the admission goes on the screen rather than
	 * into a console log.
	 *
	 * 'anon' gets its own wording and a way out: the backend is working
	 * and the rows are hidden only because nothing is signed in.
	 */
	/** @type {{ source: 'live'|'anon'|'fixture' }} */
	let { source } = $props();
</script>

{#if source === 'fixture'}
	<p class="src">Showing design placeholders — no backend connected.</p>
{:else if source === 'anon'}
	<p class="src">
		Showing design placeholders — <a href="/signin">sign in</a> to see your own records.
	</p>
{/if}

<style>
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
