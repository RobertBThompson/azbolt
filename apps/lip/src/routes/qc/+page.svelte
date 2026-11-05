<script>
	import AxisMeter from '$lib/components/AxisMeter.svelte';
	import StateBadge from '$lib/components/StateBadge.svelte';
	import QuorumIndicator from '$lib/components/QuorumIndicator.svelte';
	import ConfidenceCoverage from '$lib/components/ConfidenceCoverage.svelte';
	import { qcQueue, me } from '$lib/data/fixtures.js';

	/** @type {Record<string, 'agree'|'adjust'|'flag'>} */
	let submitted = $state({});

	/**
	 * @param {string} id
	 * @param {'agree'|'adjust'|'flag'} choice
	 */
	function act(id, choice) {
		submitted = { ...submitted, [id]: choice };
	}
</script>

<svelte:head><title>QC · LIP</title></svelte:head>

<div class="wrap">
	<h1>Verify</h1>
	<p class="intro">
		Items needing your bin come first. Judgments here affect verification only — agreeing with a
		measurement never enrols you in an action.
	</p>

	{#each qcQueue as item (item.id)}
		<!-- Verify treatment: 4px left rule + a barely-there warm tint.
		     That is the whole difference from Measure. No new hue. -->
		<section class="qc">
			<div class="top">
				<span class="eyebrow">Needs {item.needsBin}</span>
				<StateBadge state={item.state} />
			</div>

			<h2>{item.object} · {item.issue}</h2>
			<p class="note">{item.note}</p>

			<p class="proposed">
				<span class="k">Proposed</span>
				<b class="num">{item.proposed > 0 ? '+' : ''}{item.proposed.toFixed(1)}</b>
			</p>
			<AxisMeter score={item.proposed} />

			<ConfidenceCoverage confidence={item.confidence} coverage={item.coverage} />

			{#if submitted[item.id]}
				<p class="done">
					Recorded: <b>{submitted[item.id]}</b>. Your accuracy weight updates once the item
					resolves — not now, and not from agreeing with the majority.
				</p>
			{:else}
				<div class="actions">
					<button onclick={() => act(item.id, 'agree')}>Agree</button>
					<button onclick={() => act(item.id, 'adjust')}>Adjust</button>
					<button onclick={() => act(item.id, 'flag')}>Flag</button>
				</div>
			{/if}

			<QuorumIndicator quorum={item.quorum} yourBin={me.bin} />

			<a class="inspect" href="/object/{item.objectId}">Inspect the measurement →</a>
		</section>
	{/each}
</div>

<style>
	.wrap {
		padding: 12px;
	}
	h1 {
		font-size: 20px;
	}
	.intro {
		font-size: 11px;
		line-height: 1.55;
		color: var(--muted);
		margin: 6px 0 14px;
	}
	.qc {
		border: 1px solid var(--line);
		border-left: 4px solid var(--ink);
		background: var(--verify-tint);
		border-radius: 0 10px 10px 0;
		padding: 14px;
		margin-bottom: 12px;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	h2 {
		font: 600 14px var(--font-sans);
		margin-top: 8px;
	}
	.note {
		font-size: 11px;
		line-height: 1.5;
		color: var(--muted);
		margin: 4px 0 0;
	}
	.proposed {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 12px 0 0;
	}
	.proposed b {
		font: 600 20px var(--font-serif);
	}
	.k {
		font: 700 9px var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.actions {
		display: flex;
		gap: 6px;
		margin: 12px 0;
	}
	.actions button {
		flex: 1;
		min-height: var(--tap-min);
		border: 1px solid var(--ink);
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 10px var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
	}
	.done {
		font-size: 10px;
		line-height: 1.5;
		background: var(--white);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		padding: 8px;
		margin: 12px 0;
	}
	.inspect {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		font-size: 10px;
		color: var(--app-accent-text);
		text-decoration: none;
		margin-top: 8px;
	}
</style>
