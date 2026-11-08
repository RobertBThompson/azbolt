<script>
	/** @type {{ items?: string[], active?: number, onpick?: ((i: number) => void)|null }} */
	let { items = [], active = 0, onpick = null } = $props();
</script>

<div class="tabs" role="tablist">
	{#each items as v, i (v)}
		<button
			role="tab"
			aria-selected={i === active}
			class:on={i === active}
			onclick={() => onpick?.(i)}>{v}</button
		>
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		background: var(--tone-graphite-tint);
		border-radius: 11px;
		padding: 4px;
		gap: 4px;
	}
	button {
		flex: 1;
		height: 33px;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: var(--ink-4);
		font-family: inherit;
		font-size: 12px;
		font-weight: 600;
	}
	button.on {
		background: var(--card);
		color: var(--ink);
	}
</style>
