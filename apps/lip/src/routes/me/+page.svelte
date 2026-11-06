<script>
	import Quadrant from '$lib/components/Quadrant.svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import { me, binLabel, binOf } from '$lib/data/fixtures.js';
	import { loadPosition, clearPosition } from '$lib/storage/position.js';
	import { INSTRUMENT_VERSION } from '$lib/data/instrument.js';

	let mine = $state(/** @type {any} */ (null));
	let ready = $state(false);
	let repOpen = $state(false);

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

	const reputation = [
		{ label: 'QC accuracy', value: '91%' },
		{ label: 'Evidence contributions', value: '428' },
		{ label: 'Debater rating', value: '1842' },
		{ label: 'Referee rating', value: '1720' },
		{ label: 'Issue expertise · Tax', value: '86' }
	];
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
		<Quadrant objects={[meObject]} height={300} />

		{#if mine}
			<div class="card">
				<p class="score num">
					{mine.fiscal > 0 ? '+' : ''}{mine.fiscal.toFixed(1)}
					<span class="slash">/</span>
					{mine.social > 0 ? '+' : ''}{mine.social.toFixed(1)}
				</p>
				<p class="bins">
					Fiscal {binLabel(mine.fiscal)} · Social {binLabel(mine.social)} · Instrument
					{mine.instrumentVersion ?? INSTRUMENT_VERSION}
				</p>
			</div>
		{/if}

		<div class="card">
			<h2 class="k">Private by default</h2>
			<p class="note">
				Your placement is never public and never leaves this device. Only your anonymous bin —
				{mine ? binOf(mine.fiscal) : me.bin} — contributes to balancing a QC quorum, so items that
				need your perspective can find you without exposing who you are.
			</p>
		</div>

		<button class="ghostwide" onclick={() => (repOpen = true)}>Reputation · 5 separate scores</button>

		{#if mine}
			<button class="ghostwide" onclick={reset}>Retake the instrument</button>
		{/if}
	{/if}
</div>

<Sheet open={repOpen} title="Reputation" onclose={() => (repOpen = false)}>
	<ul class="rep">
		{#each reputation as r (r.label)}
			<li><span>{r.label}</span><b class="num">{r.value}</b></li>
		{/each}
	</ul>
	<p class="note">
		Each dimension stands alone. There is deliberately no follower count and no single influence
		score to climb.
	</p>
</Sheet>

<style>
	.wrap {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	h1 {
		font-size: 26px;
	}
	.badge {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 2px solid var(--ink);
		border-radius: 20px;
		padding: 6px 12px;
	}
	.card {
		border-radius: var(--radius);
		background: var(--white);
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 10px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 0;
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
	.bins {
		font-size: var(--size-small);
		color: var(--muted);
		margin: 10px 0 0;
	}
	.primary,
	.ghostwide {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 52px;
		border-radius: var(--radius-sm);
		font: 700 var(--size-small) var(--font-sans);
		text-decoration: none;
	}
	.primary {
		border: 0;
		margin-top: 16px;
		background: linear-gradient(160deg, var(--app-accent), var(--app-accent-strong));
		color: #fff;
		box-shadow: 0 6px 16px rgba(192, 125, 31, 0.34);
	}
	.ghostwide {
		border: 1.5px solid var(--line);
		background: var(--white);
		color: var(--ink);
	}
	.rep {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.rep li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: var(--tap-min);
		border-bottom: 1px solid var(--line);
		font-size: var(--size-body);
	}
	.rep li b {
		font-family: var(--font-serif);
		font-size: var(--size-title);
	}
</style>
