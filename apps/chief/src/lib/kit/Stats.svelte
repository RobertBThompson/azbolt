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
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: var(--r-sm);
		background: var(--gloss), var(--grad-night);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 10px 22px -10px rgba(16, 14, 40, 0.6);
		color: #ffffff;
		padding: 11px 6px 10px;
		text-align: center;
	}
	.stat:nth-child(3n + 2) {
		background: var(--gloss), var(--grad-wine);
	}
	.stat:nth-child(3n + 3) {
		background: var(--gloss), var(--grad-blue);
	}
	/* The first figure is the one the eye should land on. */
	.stat:first-child .a {
		color: var(--pop);
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
		font-size: var(--fs-xs);
		color: rgba(255, 255, 255, 0.9);
		margin-top: 3px;
		line-height: 1.2;
	}
</style>
