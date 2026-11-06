<script>
	import AxisMeter from './AxisMeter.svelte';
	import ConfidenceCoverage from './ConfidenceCoverage.svelte';
	import StateBadge from './StateBadge.svelte';
	import Sheet from './Sheet.svelte';
	import { binLabel } from '../data/fixtures.js';

	/**
	 * The Measure surface: quiet, instrument-grade, plain white.
	 *
	 * Three outputs, never collapsed into one score, and now three separate
	 * cards rather than three sections crammed into one. Agreeing,
	 * adjusting or flagging never happens here — "Open action" is the one
	 * deliberate door into Act.
	 *
	 * @type {{ object: any }}
	 */
	let { object } = $props();

	let issuesOpen = $state(false);
	let contested = $derived(object.position.fiscalRange ?? null);
</script>

<article class="card">
	<header>
		<div>
			<h1>{object.name}</h1>
			<p class="kind">{object.kind}</p>
		</div>
		<StateBadge state={object.state} />
	</header>
</article>

<article class="card">
	<h2 class="k">1 · Expressed Position</h2>
	{#if contested}
		<p class="score num">{contested[0].toFixed(1)} to {contested[1].toFixed(1)}</p>
		<p class="unit">fiscal · contested</p>
	{:else}
		<p class="score num">
			{object.position.fiscal > 0 ? '+' : ''}{object.position.fiscal.toFixed(1)}
			<span class="slash">/</span>
			{object.position.social > 0 ? '+' : ''}{object.position.social.toFixed(1)}
		</p>
		<p class="unit">fiscal / social</p>
	{/if}

	<AxisMeter score={object.position.fiscal} range={contested} />
	<p class="binline">
		Fiscal {binLabel(object.position.fiscal)} · Social {binLabel(object.position.social)}
	</p>

	<ConfidenceCoverage confidence={object.confidence} coverage={object.coverage} />

	{#if object.issues?.length}
		<button class="ghost" onclick={() => (issuesOpen = true)}>
			View all {object.issues.length} issues
		</button>
	{/if}
</article>

{#if object.footprint}
	<article class="card">
		<h2 class="k">2 · Support Footprint</h2>
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
			<b>Not averaged.</b>
			{object.footprint.left} left plus {object.footprint.right} right does not become Center.
			{object.name} supports both, independently. Neither weight is plotted on the map, because neither
			is a position.
		</p>
	</article>
{/if}

{#if object.pressure}
	<article class="card">
		<h2 class="k">3 · Boycott Pressure</h2>
		<div class="pair">
			<div class="weight"><b class="num">{object.pressure.fromLeft}</b><small>From left</small></div>
			<div class="weight">
				<b class="num">{object.pressure.fromRight}</b><small>From right</small>
			</div>
		</div>
	</article>
{/if}

<div class="links">
	<a class="ghostlink" href="/object/{object.id}/evidence">Evidence · {object.evidenceCount}</a>
	<a class="ghostlink" href="/method">Methodology</a>
</div>

{#if object.pressure}
	<a class="door" href="/act/{object.id}">Open action</a>
{/if}

<Sheet open={issuesOpen} title="Issue breakdown" onclose={() => (issuesOpen = false)}>
	<ul class="issues">
		{#each object.issues ?? [] as row (row.issue)}
			<li>
				<span>{row.issue}</span>
				<b class="num">{row.score > 0 ? '+' : ''}{row.score.toFixed(1)}</b>
			</li>
		{/each}
	</ul>
	<p class="note">Every issue score opens its own evidence chain.</p>
</Sheet>

<style>
	.card {
		border-radius: var(--radius);
		background: var(--white);
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}
	h1 {
		font-size: 24px;
	}
	.kind {
		font-size: var(--size-small);
		color: var(--muted);
		margin: 6px 0 0;
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 10px;
	}
	.score {
		font-family: var(--font-serif);
		font-size: var(--size-display);
		font-weight: 600;
		line-height: 1;
		margin: 0;
	}
	.slash {
		color: var(--line-strong);
	}
	.unit {
		font-size: var(--size-small);
		color: var(--muted);
		margin: 8px 0 0;
	}
	.binline {
		font-size: var(--size-small);
		color: var(--muted);
		margin: 10px 0 0;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.weight {
		background: var(--verify-tint);
		border-radius: var(--radius-sm);
		padding: 14px;
	}
	.weight b {
		display: block;
		font-family: var(--font-serif);
		font-size: var(--size-score);
		font-weight: 600;
		line-height: 1;
	}
	.weight small {
		display: block;
		font-size: var(--size-label);
		color: var(--muted);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-top: 6px;
	}
	.dirbar {
		display: block;
		height: 8px;
		background: #e4e2d8;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 10px;
	}
	.dirbar i {
		display: block;
		height: 100%;
		background: var(--ink-2);
	}
	.never-net {
		font-size: var(--size-small);
		line-height: 1.6;
		border-left: 4px solid var(--app-accent);
		padding: 12px 14px;
		background: var(--app-accent-tint);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		margin: 16px 0 0;
	}
	.ghost {
		width: 100%;
		margin-top: 18px;
		border: 1.5px solid var(--line);
		border-radius: var(--radius-sm);
		background: none;
		font: 700 var(--size-small) var(--font-sans);
		color: var(--teal-900);
	}
	.links {
		display: flex;
		gap: 10px;
	}
	.ghostlink {
		flex: 1;
		min-height: var(--tap-min);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: var(--white);
		box-shadow: var(--shadow-sm);
		font: 700 var(--size-small) var(--font-sans);
		text-decoration: none;
	}
	.door {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 56px;
		border-radius: var(--radius);
		background: linear-gradient(145deg, #11373a, #081f22);
		color: #fff;
		font: 700 var(--size-body) var(--font-sans);
		letter-spacing: 0.04em;
		text-decoration: none;
		box-shadow: 0 10px 24px rgba(8, 31, 34, 0.32);
	}
	.issues {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.issues li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: var(--tap-min);
		border-bottom: 1px solid var(--line);
		font-size: var(--size-body);
	}
	.issues li b {
		font-family: var(--font-serif);
		font-size: var(--size-title);
	}
</style>
