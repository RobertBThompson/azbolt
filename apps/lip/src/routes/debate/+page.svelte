<script>
	import { attribution } from '$lib/data/fixtures.js';
</script>

<svelte:head><title>Debate · LIP</title></svelte:head>

<div class="wrap">
	<h1>Debate</h1>
	<p class="note">
		Live debate, knockout rounds and the referee console are not built yet. The attribution chain
		below is here because it is the piece the debate screens depend on.
	</p>

	<div class="card">
		<h2 class="k">Apply-up attribution</h2>
		<p class="note">
			A score never copies flat up the chain. Each hop carries its own weight by control type, so a
			parent company is not assigned the position of a single broadcast instance.
		</p>
		<ol class="chain">
			{#each attribution as step, i (step.label)}
				<li>
					<span class="lbl">{step.label}</span>
					<span class="basis">{step.basis}</span>
					<b class="num">{step.score.toFixed(2)}</b>
					<span class="w num">{step.weight}%</span>
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.wrap {
		padding: 16px;
	}
	h1 {
		font-size: 26px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 10px 0;
	}
	.card {
		border-radius: var(--radius);
		background: var(--white);
		padding: 20px;
		box-shadow: var(--shadow-sm);
		margin-top: 14px;
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.chain {
		list-style: none;
		padding: 0;
		margin: 14px 0 0;
	}
	.chain li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-areas: 'lbl score w' 'basis score w';
		gap: 0 14px;
		align-items: center;
		padding: 14px 0 14px 18px;
		border-left: 3px solid var(--teal-500);
		font-size: var(--size-body);
	}
	.lbl {
		grid-area: lbl;
		font-weight: 600;
	}
	.basis {
		grid-area: basis;
		font-size: var(--size-label);
		color: var(--muted);
	}
	.chain b {
		grid-area: score;
		font-family: var(--font-serif);
		font-size: var(--size-title);
	}
	.w {
		grid-area: w;
		font-size: var(--size-small);
		color: var(--muted);
		width: 52px;
		text-align: right;
	}
</style>
