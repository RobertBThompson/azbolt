<script>
	/**
	 * Says where the records on screen came from. Showing design fixtures
	 * as though they were the user's own records is the one failure this
	 * layer must not have, so the admission goes on the screen rather than
	 * into a console log.
	 */
	/** @type {{ source: 'live'|'fixture' }} */
	let { source } = $props();
</script>

{#if source === 'fixture'}
	<p class="src">Showing design placeholders — no backend connected.</p>
{/if}

<style>
	.src {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--ink-4);
		text-align: center;
		padding: 2px 0 4px;
	}
</style>
