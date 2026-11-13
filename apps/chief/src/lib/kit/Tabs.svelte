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
	/* The same smoke track and lit thumb as the page switches, smaller. */
	.tabs {
		display: flex;
		background: var(--smoke);
		border: 1px solid var(--smoke-line);
		box-shadow: var(--smoke-shadow);
		border-radius: 999px;
		padding: 4px;
		gap: 4px;
	}
	button {
		flex: 1;
		min-width: 0;
		height: 38px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--on-field);
		font-family: var(--font-display);
		font-size: 14.5px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}
	button.on {
		background: var(--thumb);
		color: var(--thumb-ink);
		font-weight: 700;
		box-shadow: var(--thumb-shadow);
	}
	button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
</style>
