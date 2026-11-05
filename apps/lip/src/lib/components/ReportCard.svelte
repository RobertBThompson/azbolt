<script>
	import AxisMeter from './AxisMeter.svelte';
	import ConfidenceCoverage from './ConfidenceCoverage.svelte';
	import StateBadge from './StateBadge.svelte';
	import { binLabel } from '../data/fixtures.js';

	/**
	 * The Measure surface: quiet, instrument-grade, plain white.
	 *
	 * Three outputs, never collapsed into one score. Agreeing, adjusting or
	 * flagging never happens here — "Open action" is the one deliberate door
	 * into Act, and it is a full navigation, never an inline block bolted
	 * under a passive card.
	 *
	 * @type {{ object: any }}
	 */
	let { object } = $props();

	let contested = $derived(object.position.fiscalRange ?? null);
</script>

<article class="mcard">
	<header>
		<div>
			<h2 class="name">{object.name}</h2>
			<p class="kind">{object.kind}</p>
		</div>
		<StateBadge state={object.state} />
	</header>

	<h3 class="k">1 · Expressed Position</h3>
	<p class="score">
		{#if contested}
			<b class="num">{contested[0].toFixed(1)} to {contested[1].toFixed(1)}</b>
			<span>fiscal · contested</span>
		{:else}
			<b class="num"
				>{object.position.fiscal > 0 ? '+' : ''}{object.position.fiscal.toFixed(1)} / {object
					.position.social > 0
					? '+'
					: ''}{object.position.social.toFixed(1)}</b
			>
			<span>fiscal / social</span>
		{/if}
	</p>
	<AxisMeter score={object.position.fiscal} range={contested} />
	<p class="binline">
		Fiscal {binLabel(object.position.fiscal)} · Social {binLabel(object.position.social)}
	</p>

	<ConfidenceCoverage confidence={object.confidence} coverage={object.coverage} />

	{#if object.footprint}
		<h3 class="k">2 · Support Footprint</h3>
		<div class="pair">
			<div class="weight">
				<b class="num">{object.footprint.left}</b>
				<small>Left exposure</small>
				<span class="dirbar"><i style="width:{object.footprint.left}%"></i></span>
			</div>
			<div class="weight">
				<b class="num">{object.footprint.right}</b>
				<small>Right exposure</small>
				<span class="dirbar"><i style="width:{object.footprint.right}%"></i></span>
			</div>
		</div>
		<p class="never-net">
			<b>Not averaged:</b>
			{object.footprint.left} left + {object.footprint.right} right does not become Center. {object.name}
			supports both — independently. Neither weight is plotted on the map, because neither is a position.
		</p>
	{/if}

	{#if object.pressure}
		<h3 class="k">3 · Boycott Pressure</h3>
		<div class="pair">
			<div class="weight"><b class="num">{object.pressure.fromLeft}</b><small>From left</small></div>
			<div class="weight">
				<b class="num">{object.pressure.fromRight}</b><small>From right</small>
			</div>
		</div>
	{/if}

	{#if object.issues?.length}
		<h3 class="k">Issue breakdown</h3>
		<ul class="issues">
			{#each object.issues as row (row.issue)}
				<li>
					<span>{row.issue}</span>
					<b class="num">{row.score > 0 ? '+' : ''}{row.score.toFixed(1)}</b>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="links">
		<a href="/object/{object.id}/evidence">Evidence · {object.evidenceCount}</a>
		<a href="/object/{object.id}/method">Methodology</a>
	</div>

	{#if object.pressure}
		<a class="door" href="/act/{object.id}">Open action →</a>
	{/if}
</article>

<style>
	.mcard {
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--white);
		padding: 16px;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
	}
	.name {
		font: 600 15px var(--font-sans);
	}
	.kind {
		font-size: 9px;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 2px 0 0;
	}
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 16px 0 0;
	}
	.score {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 9px 0 0;
	}
	.score b {
		font: 600 var(--size-display) / 1.1 var(--font-serif);
	}
	.score span {
		font-size: 11px;
		color: var(--muted);
	}
	.binline {
		font-size: 10px;
		color: var(--muted);
		margin: 6px 0 0;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 10px;
	}
	.weight {
		background: var(--verify-tint);
		border-radius: 8px;
		padding: 8px;
	}
	.weight b {
		display: block;
		font-size: 17px;
	}
	.weight small {
		font-size: 8px;
		color: var(--muted);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.dirbar {
		display: block;
		height: 6px;
		background: #e4e2d8;
		border-radius: 6px;
		overflow: hidden;
		margin-top: 5px;
	}
	.dirbar i {
		display: block;
		height: 100%;
		background: var(--ink-2);
	}
	.never-net {
		font-size: 9px;
		line-height: 1.45;
		border-left: 3px solid var(--app-accent);
		padding: 6px 8px;
		background: var(--app-accent-tint);
		margin: 10px 0 0;
	}
	.issues {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
	}
	.issues li {
		display: flex;
		justify-content: space-between;
		padding: 6px 0;
		border-bottom: 1px solid var(--line);
		font-size: 12px;
	}
	.issues li:last-child {
		border-bottom: 0;
	}
	.links {
		display: flex;
		gap: 6px;
		margin-top: 14px;
	}
	.links a {
		flex: 1;
		min-height: var(--tap-min);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--ink);
		border-radius: var(--radius-sm);
		font: 700 9px var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
	}
	.door {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-min);
		margin-top: 8px;
		border: 1px solid var(--ink);
		border-radius: var(--radius-sm);
		background: var(--ink);
		color: #fff;
		font: 700 10px var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
	}
</style>
