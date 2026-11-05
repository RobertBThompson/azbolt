<script>
	import Quadrant from '$lib/components/Quadrant.svelte';
	import { me, binLabel, binOf } from '$lib/data/fixtures.js';
	import { loadPosition, clearPosition } from '$lib/storage/position.js';
	import { INSTRUMENT_VERSION } from '$lib/data/instrument.js';

	let mine = $state(/** @type {any} */ (null));
	let ready = $state(false);

	$effect(() => {
		mine = loadPosition();
		ready = true;
	});

	let meObject = $derived(
		mine ? { ...me, position: { fiscal: mine.fiscal, social: mine.social }, coverage: 100 } : me
	);

	function reset() {
		clearPosition();
		mine = null;
	}
</script>

<svelte:head><title>Me · LIP</title></svelte:head>

<div class="wrap">
	<div class="top">
		<h1>Your position</h1>
		<span class="badge">Private</span>
	</div>

	{#if ready && !mine}
		<div class="card">
			<h2 class="k">No position yet</h2>
			<p class="note">
				You haven't taken the instrument. Six plain-language questions, and nothing leaves this
				device.
			</p>
			<a class="primary" href="/welcome">Find your position</a>
		</div>
	{:else}
		<Quadrant objects={[meObject]} height={240} />

		<div class="card">
			<h2 class="k">Private by default</h2>
			<p class="note">
				Your placement is never public and never leaves this device. Only your anonymous bin —
				{mine ? binOf(mine.fiscal) : me.bin} — contributes to balancing a QC quorum, so items that
				need your perspective can find you without exposing who you are.
			</p>
			{#if mine}
				<ul>
					<li><span>Fiscal</span><b class="num">{mine.fiscal.toFixed(2)} · {binLabel(mine.fiscal)}</b></li>
					<li><span>Social</span><b class="num">{mine.social.toFixed(2)} · {binLabel(mine.social)}</b></li>
					<li><span>Instrument</span><b>{mine.instrumentVersion ?? INSTRUMENT_VERSION}</b></li>
				</ul>
				<button class="ghost" onclick={reset}>Retake the instrument</button>
			{/if}
		</div>
	{/if}

	<div class="card">
		<h2 class="k">Reputation — separate scores, no composite</h2>
		<ul>
			<li><span>QC accuracy</span><b class="num">91%</b></li>
			<li><span>Evidence contributions</span><b class="num">428</b></li>
			<li><span>Debater rating</span><b class="num">1842</b></li>
			<li><span>Referee rating</span><b class="num">1720</b></li>
			<li><span>Issue expertise · Tax</span><b class="num">86</b></li>
		</ul>
		<p class="note">
			Each dimension stands alone. There is deliberately no follower count and no single influence
			score to climb.
		</p>
	</div>
</div>

<style>
	.wrap {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	h1 {
		font-size: 20px;
	}
	.badge {
		font: 700 8px var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 1.5px solid var(--ink);
		border-radius: 20px;
		padding: 3px 7px;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--white);
		padding: 14px;
	}
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.note {
		font-size: 11px;
		line-height: 1.55;
		color: var(--muted);
		margin: 8px 0 0;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li {
		display: flex;
		justify-content: space-between;
		padding: 7px 0;
		border-bottom: 1px solid var(--line);
		font-size: 12px;
	}
	li:last-child {
		border-bottom: 0;
	}
	.primary,
	.ghost {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: var(--tap-min);
		margin-top: 12px;
		border-radius: var(--radius-sm);
		font: 700 11px var(--font-sans);
		letter-spacing: 0.04em;
		text-decoration: none;
		cursor: pointer;
	}
	.primary {
		border: 1px solid var(--ink);
		background: var(--ink);
		color: #fff;
	}
	.ghost {
		border: 1px solid var(--ink);
		background: var(--white);
		color: var(--ink);
	}
</style>
