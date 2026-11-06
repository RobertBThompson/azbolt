<script>
	/**
	 * Position on the continuous -5..+5 scale.
	 * A contested measurement renders as a hatched range with solid caps —
	 * the point indicator is replaced, not supplemented, so no single
	 * number can be read off a disputed score.
	 *
	 * @type {{ score?: number, range?: [number, number] | null }}
	 */
	let { score = 0, range = null } = $props();

	const pct = (/** @type {number} */ v) => ((v + 5) / 10) * 100;
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
		height: 10px;
		background: var(--line);
		border-radius: 5px;
		margin: 16px 0 8px;
	}
	.axis i {
		position: absolute;
		top: -7px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #fff;
		border: 4px solid var(--ink);
		transform: translateX(-50%);
		box-shadow: var(--shadow-sm);
	}
	.range {
		position: absolute;
		top: 0;
		bottom: 0;
		background: repeating-linear-gradient(45deg, #cfcdc4 0 4px, #e9e7df 4px 8px);
		border-left: 3px solid var(--ink-2);
		border-right: 3px solid var(--ink-2);
		border-radius: 5px;
	}
	.axis-lbl {
		display: flex;
		justify-content: space-between;
		font-size: var(--size-label);
		color: var(--muted);
	}
</style>
