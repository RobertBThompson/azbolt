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
	/* White on the open field, ink inside a pane. A pane that holds one
	   sets --label-ink, the same way every other kit piece learns where
	   it is; the dashes and the wash are mixed from whichever colour
	   that turns out to be, so this reads in both places. */
	.blank {
		margin: 0;
		padding: 13px 16px;
		border: 1.5px dashed color-mix(in srgb, currentColor 55%, transparent);
		border-radius: var(--r-sm);
		background: color-mix(in srgb, currentColor 8%, transparent);
		font-size: 15px;
		line-height: 1.4;
		color: var(--label-ink, var(--on-field));
	}
</style>
