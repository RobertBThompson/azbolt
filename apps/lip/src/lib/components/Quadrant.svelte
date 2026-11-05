<script>
	import { binLabel, COVERAGE_FLOOR } from '../data/fixtures.js';

	/**
	 * The continuous political map — the hero of Home, not a card in a stack.
	 *
	 * Plots ONLY Expressed Position. Support Footprint and Boycott Pressure
	 * never get a coordinate here, because neither is a position.
	 *
	 * @type {{
	 *   objects?: any[],
	 *   height?: number,
	 *   sizeBy?: 'none' | 'pressure',
	 *   showLabels?: boolean,
	 *   onselect?: (o: any) => void
	 * }}
	 */
	let { objects = [], height = 280, sizeBy = 'none', showLabels = true, onselect } = $props();

	/** -5..+5 maps to 0..100%. Fiscal left→right, social right→left (top is social left). */
	/** @param {number} fiscal */
	const toX = (fiscal) => ((fiscal + 5) / 10) * 100;
	/** @param {number} social */
	const toY = (social) => ((social + 5) / 10) * 100;

	/**
	 * Merge markers that would land within ~18px of each other at the current
	 * size into one numbered cluster, rather than stacking 44px hit areas.
	 * Flagged in review as a mis-tap risk in dense regions.
	 */
	const MERGE_PX = 18;

	let plotted = $derived.by(() => {
		/** @type {any[]} */
		const groups = [];
		for (const o of objects) {
			const x = toX(o.position.fiscal);
			const y = toY(o.position.social);
			const near = groups.find((g) => {
				const dx = ((g.x - x) / 100) * 340;
				const dy = ((g.y - y) / 100) * height;
				return Math.hypot(dx, dy) < MERGE_PX;
			});
			if (near) near.members.push(o);
			else groups.push({ x, y, members: [o] });
		}
		return groups;
	});

	/** Pressure lens sizes by action magnitude; it is not a political reading. */
	/** @param {any} o */
	function markerScale(o) {
		if (sizeBy !== 'pressure' || !o.pressure) return 1;
		const peak = Math.max(o.pressure.fromLeft, o.pressure.fromRight);
		return 0.8 + (peak / 100) * 0.9;
	}

	/** @param {any} o */
	function contestedSpan(o) {
		const r = o.position.fiscalRange;
		if (!r) return null;
		return { left: toX(r[0]), width: toX(r[1]) - toX(r[0]) };
	}
</script>

<div class="quadrant" style="height:{height}px">
	<div class="cross"></div>
	<div class="ring r1"></div>
	<div class="ring r2"></div>

	<span class="qlabel tl">Fiscal Left<br />Social Left</span>
	<span class="qlabel tr">Fiscal Right<br />Social Left</span>
	<span class="qlabel bl">Fiscal Left<br />Social Right</span>
	<span class="qlabel br">Fiscal Right<br />Social Right</span>

	{#each plotted as g (g.members[0].id)}
		{@const o = g.members[0]}
		{@const span = contestedSpan(o)}

		{#if g.members.length > 1}
			<button
				class="point cluster"
				style="left:{g.x}%;top:{g.y}%"
				onclick={() => onselect?.(g.members)}
				aria-label="{g.members.length} objects clustered here"
			>
				<i></i><b>+{g.members.length}</b>
			</button>
		{:else if span}
			<!-- Contested: a bar spanning the disputed range, never a single dot. -->
			<div
				class="rangebar"
				style="left:{span.left}%;width:{span.width}%;top:{g.y}%"
				title="Contested range"
			></div>
			<button
				class="point {o.type} contested"
				style="left:{g.x}%;top:{g.y}%"
				onclick={() => onselect?.(o)}
				aria-label="{o.name}, contested measurement"
			>
				<i style="transform:scale({markerScale(o)})"></i>
				{#if showLabels}<em>{o.name}</em>{/if}
			</button>
		{:else}
			<button
				class="point {o.type}"
				class:provisional={o.coverage < COVERAGE_FLOOR}
				style="left:{g.x}%;top:{g.y}%"
				onclick={() => onselect?.(o)}
				aria-label="{o.name}, fiscal {binLabel(o.position.fiscal)}, social {binLabel(
					o.position.social
				)}{o.coverage < COVERAGE_FLOOR ? ', provisional' : ''}"
			>
				<i style="transform:scale({markerScale(o)})"></i>
				{#if showLabels}<em>{o.name}</em>{/if}
			</button>
		{/if}
	{/each}
</div>

<style>
	.quadrant {
		position: relative;
		background: var(--instrument);
		border-radius: 13px;
		overflow: hidden;
		color: #fff;
	}
	.cross::before,
	.cross::after {
		content: '';
		position: absolute;
		background: var(--instrument-line);
	}
	.cross::before {
		width: 1px;
		top: 0;
		bottom: 0;
		left: 50%;
	}
	.cross::after {
		height: 1px;
		left: 0;
		right: 0;
		top: 50%;
	}
	.ring {
		position: absolute;
		border: 1px solid var(--instrument-line);
		border-radius: 50%;
	}
	.r1 {
		inset: 38%;
	}
	.r2 {
		inset: 22%;
	}
	.qlabel {
		position: absolute;
		z-index: 1;
		font: italic 10px var(--font-serif);
		color: rgba(255, 255, 255, 0.42);
		line-height: 1.3;
	}
	.tl {
		left: 12px;
		top: 10px;
	}
	.tr {
		right: 12px;
		top: 10px;
		text-align: right;
	}
	.bl {
		left: 12px;
		bottom: 10px;
	}
	.br {
		right: 12px;
		bottom: 10px;
		text-align: right;
	}

	/* 44px hit area, 22-28px visible marker. */
	.point {
		position: absolute;
		z-index: 8;
		transform: translate(-50%, -50%);
		border: 0;
		background: transparent;
		color: #fff;
		padding: 0;
		min-width: var(--tap-min);
		min-height: var(--tap-min);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.point i {
		width: 22px;
		height: 22px;
		background: var(--gold-light);
		border: 2.5px solid #fff;
		border-radius: 50%;
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
		display: block;
	}
	/* Shape carries type — never color alone. */
	.point.company i {
		border-radius: 5px;
	}
	.point.media i {
		clip-path: polygon(50% 6%, 96% 92%, 4% 92%);
		border: 0;
		box-shadow: none;
	}
	.point.bill i {
		border-radius: 50% 0 50% 50%;
		rotate: -45deg;
	}
	.point.you i {
		width: 28px;
		height: 28px;
		background: var(--app-accent);
		box-shadow: 0 0 0 6px var(--app-accent-tint);
	}
	/* Provisional: dashed ring, so sparse data never passes as settled. */
	.point.provisional i {
		border-style: dashed;
		background: transparent;
		box-shadow: none;
	}
	.point.contested i {
		width: 14px;
		height: 14px;
	}
	.point em {
		position: absolute;
		top: 30px;
		font-style: normal;
		font-size: 8px;
		white-space: nowrap;
		text-shadow: 0 1px 3px #000;
	}
	.point.cluster i {
		background: var(--ink-2);
		border-color: var(--gold-light);
		width: 26px;
		height: 26px;
		border-radius: 50%;
	}
	.point.cluster b {
		position: absolute;
		font-size: 9px;
		font-weight: 700;
	}
	.rangebar {
		position: absolute;
		z-index: 7;
		height: 6px;
		transform: translateY(-50%);
		border-radius: 3px;
		background: repeating-linear-gradient(45deg, #cfcdc4 0 3px, #e9e7df 3px 6px);
		border-left: 2px solid #fff;
		border-right: 2px solid #fff;
	}
</style>
