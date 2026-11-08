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
		color: var(--ink-4);
		border-left: 2px solid var(--line-2);
		padding-left: 10px;
	}
</style>
