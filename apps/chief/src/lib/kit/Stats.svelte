<script>
	/**
	 * Each stat is a single accessibility element with the label FIRST,
	 * order swapped from the visual order: "Needs you: 3", not "3, Needs you".
	 */
	/** @type {{ items?: [string, string][] }} */
	let { items = [] } = $props();
</script>

<div class="stats">
	{#each items as [value, label] (label)}
		<div class="stat" aria-label="{label}: {value}">
			<span class="a" aria-hidden="true">{value}</span>
			<span class="b" aria-hidden="true">{label}</span>
		</div>
	{/each}
</div>

<style>
	.stats {
		display: flex;
		gap: 8px;
	}
	.stat {
		flex: 1;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		padding: 11px 6px 10px;
		text-align: center;
	}
	.a {
		display: block;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 700;
		line-height: 1.1;
		font-variant-numeric: tabular-nums lining-nums;
	}
	.b {
		display: block;
		font-size: 13px;
		color: var(--ink-3);
		margin-top: 3px;
		line-height: 1.2;
	}
</style>
