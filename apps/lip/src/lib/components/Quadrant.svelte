<script>
	import { binLabel, COVERAGE_FLOOR } from '../data/fixtures.js';

	/**
	 * The continuous political map — the hero of Home.
	 *
	 * Plots ONLY Expressed Position. Support Footprint and Boycott Pressure
	 * never get a coordinate here, because neither is a position.
	 *
	 * @type {{
	 *   objects?: any[],
	 *   height?: number,
	 *   sizeBy?: 'none' | 'pressure',
	 *   showLabels?: boolean,
	 *   land?: boolean,
	 *   onselect?: (o: any) => void
	 * }}
	 */
	let {
		objects = [],
		height = 330,
		sizeBy = 'none',
		showLabels = true,
		land = false,
		onselect
	} = $props();

	/**
	 * The scale is -5..+5, but markers are drawn into an inset band rather
	 * than the full frame: at an extreme score a 32px dot would otherwise
	 * sit half outside the map and on top of the corner label.
	 */
	const EDGE = 13;
	const span = 100 - EDGE * 2;
	const toX = (/** @type {number} */ fiscal) => EDGE + ((fiscal + 5) / 10) * span;
	const toY = (/** @type {number} */ social) => EDGE + ((social + 5) / 10) * span;

	/**
	 * Merge markers that would land within ~20px of each other into one
	 * numbered cluster, rather than stacking 48px hit areas.
	 */
	const MERGE_PX = 20;

	let plotted = $derived.by(() => {
		/** @type {any[]} */
		const groups = [];
		for (const o of objects) {
			const x = toX(o.position.fiscal);
			const y = toY(o.position.social);
			const near = groups.find((g) => {
				const dx = ((g.x - x) / 100) * 358;
				const dy = ((g.y - y) / 100) * height;
				return Math.hypot(dx, dy) < MERGE_PX;
			});
			if (near) near.members.push(o);
			else groups.push({ x, y, members: [o] });
		}
		return groups;
	});

	/** The pressure lens sizes by action magnitude. Not a political reading. */
	function markerScale(/** @type {any} */ o) {
		if (sizeBy !== 'pressure' || !o.pressure) return 1;
		const peak = Math.max(o.pressure.fromLeft, o.pressure.fromRight);
		return 0.85 + (peak / 100) * 0.85;
	}

	/**
	 * A strong position lands in a corner, which is exactly where the
	 * quadrant labels sit — and committed users are the ones with strong
	 * positions. So a label dims when a marker is near it: the dot is the
	 * data, the label is the chrome, and the chrome yields.
	 */
	function corners() {
		const near = (/** @type {number} */ cx, /** @type {number} */ cy) =>
			plotted.some((g) => Math.abs(g.x - cx) < 26 && Math.abs(g.y - cy) < 20);
		return {
			tl: near(0, 0),
			tr: near(100, 0),
			bl: near(0, 100),
			br: near(100, 100)
		};
	}

	let dim = $derived(corners());

	function contestedSpan(/** @type {any} */ o) {
		const r = o.position.fiscalRange;
		if (!r) return null;
		return { left: toX(r[0]), width: toX(r[1]) - toX(r[0]) };
	}
</script>

<div class="quadrant" style="height:{height}px">
	<div class="axis v"></div>
	<div class="axis h"></div>
	<div class="ring r1"></div>
	<div class="ring r2"></div>
	<div class="ring r3"></div>

	<span class="qlabel tl" class:dim={dim.tl}>Fiscal Left<br />Social Left</span>
	<span class="qlabel tr" class:dim={dim.tr}>Fiscal Right<br />Social Left</span>
	<span class="qlabel bl" class:dim={dim.bl}>Fiscal Left<br />Social Right</span>
	<span class="qlabel br" class:dim={dim.br}>Fiscal Right<br />Social Right</span>

	{#each plotted as g, i (g.members[0].id)}
		{@const o = g.members[0]}
		{@const span = contestedSpan(o)}
		{@const delay = Math.min(i * 55, 400)}

		{#if g.members.length > 1}
			<button
				class="point cluster"
				style="left:{g.x}%;top:{g.y}%;--d:{delay}ms"
				onclick={() => onselect?.(g.members)}
				aria-label="{g.members.length} objects clustered here"
			>
				<i></i><b>+{g.members.length}</b>
			</button>
		{:else if span}
			<!-- Contested: a bar spanning the disputed range, never a point. -->
			<div
				class="rangebar"
				style="left:{span.left}%;width:{span.width}%;top:{g.y}%;--d:{delay}ms"
			></div>
			<button
				class="point {o.type} contested"
				class:labelup={g.y > 62}
				style="left:{g.x}%;top:{g.y}%;--d:{delay}ms"
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
				class:land={land && o.type === 'you'}
				class:labelup={g.y > 62}
				style="left:{g.x}%;top:{g.y}%;--d:{delay}ms"
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
		border-radius: var(--radius-lg);
		overflow: hidden;
		color: #fff;
		box-shadow: var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}
	.axis {
		position: absolute;
		background: var(--instrument-line);
	}
	.axis.v {
		width: 1px;
		top: 0;
		bottom: 0;
		left: 50%;
	}
	.axis.h {
		height: 1px;
		left: 0;
		right: 0;
		top: 50%;
	}
	.ring {
		position: absolute;
		border-radius: 50%;
	}
	.r1 {
		inset: 36%;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	.r2 {
		inset: 18%;
		border: 1px solid rgba(255, 255, 255, 0.07);
	}
	.r3 {
		inset: 4%;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	/* Corner labels were 10px at 42% opacity — functionally invisible on a
	   phone. Now 12px at 66%. */
	.qlabel {
		position: absolute;
		z-index: 1;
		font: italic 12px/1.35 var(--font-serif);
		color: rgba(255, 255, 255, 0.66);
		transition: opacity 240ms ease;
	}
	.qlabel.dim {
		opacity: 0.18;
	}
	.tl {
		left: 14px;
		top: 12px;
	}
	.tr {
		right: 14px;
		top: 12px;
		text-align: right;
	}
	.bl {
		left: 14px;
		bottom: 12px;
	}
	.br {
		right: 14px;
		bottom: 12px;
		text-align: right;
	}

	.point {
		position: absolute;
		z-index: 8;
		transform: translate(-50%, -50%);
		border: 0;
		background: transparent;
		padding: 0;
		min-width: var(--tap-min);
		min-height: var(--tap-min);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: pop 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--d, 0ms);
	}
	.point i {
		width: 20px;
		height: 20px;
		display: block;
		border-radius: 50%;
		background: linear-gradient(160deg, var(--gold-light), var(--app-accent));
		border: 2px solid rgba(255, 255, 255, 0.95);
		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.45);
	}
	/* Shape carries type — never colour alone. */
	.point.company i {
		border-radius: 6px;
	}
	.point.media i {
		clip-path: polygon(50% 4%, 97% 94%, 3% 94%);
		border: 0;
		box-shadow: none;
		background: linear-gradient(180deg, var(--gold-light), var(--app-accent));
	}
	.point.bill i {
		border-radius: 50% 0 50% 50%;
		rotate: -45deg;
	}
	.point.you i {
		width: 32px;
		height: 32px;
		background: radial-gradient(70% 70% at 35% 28%, #ffd98a, var(--app-accent));
		box-shadow:
			0 0 0 9px rgba(216, 151, 58, 0.22),
			0 0 30px rgba(255, 200, 100, 0.6),
			0 4px 12px rgba(0, 0, 0, 0.42);
	}
	/* Provisional: dashed, so sparse data never passes as settled. */
	.point.provisional i {
		border-style: dashed;
		background: transparent;
		box-shadow: none;
	}
	.point.contested i {
		width: 15px;
		height: 15px;
	}
	.point em {
		position: absolute;
		top: 32px;
		font-style: normal;
		font-size: var(--size-label);
		font-weight: 600;
		white-space: nowrap;
		text-shadow: 0 1px 4px #000;
	}
	.point.you em {
		top: 40px;
		letter-spacing: 0.1em;
	}
	/* Below the midline a caption under the marker runs off the map, so it
	   moves above instead. */
	.point.labelup em {
		top: auto;
		bottom: 32px;
	}
	.point.you.labelup em {
		bottom: 40px;
	}
	.point.cluster i {
		width: 30px;
		height: 30px;
		background: var(--ink-2);
		border-color: var(--gold-light);
		border-radius: 50%;
	}
	.point.cluster b {
		position: absolute;
		font-size: var(--size-label);
		font-weight: 700;
	}
	.rangebar {
		position: absolute;
		z-index: 7;
		height: 8px;
		transform: translateY(-50%);
		border-radius: 4px;
		background: repeating-linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.55) 0 3px,
			rgba(255, 255, 255, 0.24) 3px 6px
		);
		border-left: 2px solid #fff;
		border-right: 2px solid #fff;
		animation: pop 320ms ease both;
		animation-delay: var(--d, 0ms);
	}

	/* The payoff: after onboarding the dot travels from the centre of the
	   map to its real coordinate, so six questions visibly resolve into a
	   position rather than one just appearing. */
	.point.land {
		animation: land 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes pop {
		from {
			opacity: 0;
			scale: 0.4;
		}
	}
	@keyframes land {
		0% {
			opacity: 0;
			left: 50%;
			top: 50%;
			scale: 0.3;
		}
		55% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			scale: 1;
		}
	}
</style>
