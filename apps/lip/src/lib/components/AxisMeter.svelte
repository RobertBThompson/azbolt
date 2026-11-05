<script>
	/**
	 * Position on the continuous -5..+5 scale.
	 * A contested measurement renders as a hatched range with solid caps at
	 * the low and high estimate — the point indicator is replaced, not
	 * supplemented, so no single number can be read off a disputed score.
	 *
	 * @type {{ score?: number, range?: [number, number] | null }}
	 */
	let { score = 0, range = null } = $props();

	/** @param {number} v */
	const pct = (v) => ((v + 5) / 10) * 100;
</script>

<div class="axis">
	{#if range}
		<div class="range" style="left:{pct(range[0])}%;width:{pct(range[1]) - pct(range[0])}%"></div>
	{:else}
		<i style="left:{pct(score)}%"></i>
	{/if}
</div>
<div class="axis-lbl">
	<span>Left −5</span>
	<span>Right +5</span>
</div>

<style>
	.axis {
		position: relative;
		height: 6px;
		background: var(--line);
		border-radius: 3px;
		margin: 12px 0 4px;
	}
	.axis i {
		position: absolute;
		top: -5px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid var(--ink);
		transform: translateX(-50%);
	}
	.range {
		position: absolute;
		top: 0;
		bottom: 0;
		background: repeating-linear-gradient(45deg, #cfcdc4 0 3px, #e9e7df 3px 6px);
		border-left: 2px solid var(--ink-2);
		border-right: 2px solid var(--ink-2);
		border-radius: 3px;
	}
	.axis-lbl {
		display: flex;
		justify-content: space-between;
		font-size: 8px;
		color: var(--muted);
	}
</style>
