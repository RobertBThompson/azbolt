<script>
	import AxisMeter from '$lib/components/AxisMeter.svelte';
	import StateBadge from '$lib/components/StateBadge.svelte';
	import QuorumIndicator from '$lib/components/QuorumIndicator.svelte';
	import ConfidenceCoverage from '$lib/components/ConfidenceCoverage.svelte';
	import { qcQueue, me } from '$lib/data/fixtures.js';

	/**
	 * One item at a time rather than a scrolling list. A QC judgment
	 * deserves the whole screen; a list of them invites skimming, which is
	 * the opposite of what verification is for.
	 */
	let index = $state(0);
	/** @type {Record<string, 'agree'|'adjust'|'flag'>} */
	let submitted = $state({});

	let item = $derived(qcQueue[index]);
	let done = $derived(submitted[item.id]);
	let last = $derived(index === qcQueue.length - 1);

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
	<div class="head">
		<h1>Verify</h1>
		<span class="count num">{index + 1} of {qcQueue.length}</span>
	</div>
	<p class="intro">
		Judgments here affect verification only. Agreeing with a measurement never enrols you in an
		action.
	</p>

	<!-- Verify treatment: a left rule and a warm tint. That is the whole
	     difference from Measure. No new hue. -->
	<section class="qc">
		<div class="top">
			<span class="eyebrow">Needs {item.needsBin}</span>
			<StateBadge state={item.state} />
		</div>

		<h2>{item.object}</h2>
		<p class="issue">{item.issue}</p>
		<p class="note">{item.note}</p>

		<p class="proposed">
			<span class="k">Proposed</span>
			<b class="num">{item.proposed > 0 ? '+' : ''}{item.proposed.toFixed(1)}</b>
		</p>
		<AxisMeter score={item.proposed} />

		<ConfidenceCoverage confidence={item.confidence} coverage={item.coverage} />

		{#if done}
			<p class="recorded">
				Recorded: <b>{done}</b>. Your accuracy weight updates when the item resolves — not now, and
				not for agreeing with the majority.
			</p>
		{:else}
			<div class="actions">
				<button onclick={() => act(item.id, 'agree')}>Agree</button>
				<button onclick={() => act(item.id, 'adjust')}>Adjust</button>
				<button onclick={() => act(item.id, 'flag')}>Flag</button>
			</div>
		{/if}

		<QuorumIndicator quorum={item.quorum} yourBin={me.bin} />
	</section>

	<div class="nav">
		<button class="ghost" disabled={index === 0} onclick={() => (index -= 1)}>Back</button>
		{#if !last}
			<button class="primary" onclick={() => (index += 1)}>Next item</button>
		{:else}
			<a class="primary" href="/">Done</a>
		{/if}
	</div>

	<a class="inspect" href="/object/{item.objectId}">Inspect the measurement →</a>
</div>

<style>
	.wrap {
		padding: 16px;
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	h1 {
		font-size: 26px;
	}
	.count {
		font-size: var(--size-small);
		font-weight: 700;
		color: var(--muted);
	}
	.intro {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 8px 0 18px;
	}
	.qc {
		border-left: 5px solid var(--teal-500);
		background: var(--verify-tint);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	h2 {
		font-size: 24px;
		margin-top: 14px;
	}
	.issue {
		font-size: var(--size-body);
		font-weight: 600;
		color: var(--teal-700);
		margin: 4px 0 0;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 10px 0 0;
	}
	.proposed {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin: 18px 0 0;
	}
	.proposed b {
		font-family: var(--font-serif);
		font-size: var(--size-score);
		font-weight: 600;
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.actions {
		display: flex;
		gap: 8px;
		margin: 20px 0;
	}
	.actions button {
		flex: 1;
		min-height: 52px;
		border: 2px solid var(--ink);
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 var(--size-small) var(--font-sans);
	}
	.recorded {
		font-size: var(--size-small);
		line-height: 1.6;
		background: var(--white);
		border-radius: var(--radius-sm);
		padding: 14px;
		margin: 20px 0;
		box-shadow: var(--shadow-sm);
	}
	.nav {
		display: flex;
		gap: 10px;
		margin-top: 16px;
	}
	.primary,
	.ghost {
		flex: 1;
		min-height: 52px;
		border-radius: var(--radius-sm);
		font: 700 var(--size-small) var(--font-sans);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
	}
	.primary {
		border: 0;
		background: linear-gradient(160deg, var(--teal-700), var(--teal-900));
		color: #fff;
		box-shadow: 0 6px 16px rgba(15, 74, 77, 0.3);
	}
	.ghost {
		border: 1.5px solid var(--line);
		background: none;
		color: var(--ink);
	}
	.ghost:disabled {
		opacity: 0.4;
	}
	.inspect {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-min);
		font-size: var(--size-small);
		font-weight: 600;
		color: var(--teal-700);
		text-decoration: none;
		margin-top: 8px;
	}
</style>
