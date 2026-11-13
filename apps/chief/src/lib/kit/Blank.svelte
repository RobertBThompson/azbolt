<script>
	/**
	 * A section with nothing in it says so, in one line.
	 *
	 * Dashed and unfilled, so it cannot be read as a record. An empty
	 * section left out altogether looks the same as one that failed to
	 * load; this one is plainly empty on purpose.
	 */
	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<p class="blank">{@render children()}</p>

<style>
	.blank {
		margin: 0;
		padding: 13px 16px;
		border: 1.5px dashed rgba(255, 255, 255, 0.7);
		border-radius: var(--r-sm);
		background: rgba(255, 255, 255, 0.12);
		font-size: 15px;
		line-height: 1.4;
		color: var(--on-field);
	}
</style>
