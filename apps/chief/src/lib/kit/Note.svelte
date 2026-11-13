<script>
	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<p class="note">{@render children()}</p>

<style>
	.note {
		margin: 0;
		font-size: 14px;
		line-height: 1.45;
		/* Help text sits on the field, where small white type never
		   clears contrast. A faint plate gives it a ground of its own. */
		color: var(--ink-2);
		background: var(--glass-dim);
		border-radius: var(--r-xs);
		box-shadow: inset 3px 0 0 rgba(255, 255, 255, 0.95);
		padding: 9px 13px 9px 14px;
		text-wrap: pretty;
	}
</style>
