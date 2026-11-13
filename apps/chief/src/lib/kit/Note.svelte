<script>
	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<p class="note">{@render children()}</p>

<style>
	.note {
		margin: 0;
		font-size: 12px;
		line-height: 1.45;
		/* Help text sits on the field, where 12px white never clears
		   contrast. A faint plate gives it a ground of its own instead. */
		color: var(--ink-2);
		background: var(--glass-dim);
		border-left: 2px solid rgba(255, 255, 255, 0.85);
		border-radius: 0 10px 10px 0;
		padding: 8px 11px 8px 10px;
	}
</style>
