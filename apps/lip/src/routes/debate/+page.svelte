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
		padding: 12px;
	}
	h1 {
		font-size: 20px;
	}
	.note {
		font-size: 11px;
		line-height: 1.55;
		color: var(--muted);
		margin: 8px 0;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--white);
		padding: 14px;
		margin-top: 12px;
	}
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.chain {
		list-style: none;
		padding: 0;
		margin: 10px 0 0;
	}
	.chain li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-template-areas: 'lbl score w' 'basis score w';
		gap: 0 10px;
		align-items: center;
		padding: 9px 0 9px 14px;
		border-left: 2px solid var(--line-strong);
		font-size: 12px;
	}
	.lbl {
		grid-area: lbl;
		font-weight: 600;
	}
	.basis {
		grid-area: basis;
		font-size: 9px;
		color: var(--muted);
	}
	.chain b {
		grid-area: score;
		font-family: var(--font-serif);
		font-size: 15px;
	}
	.w {
		grid-area: w;
		font-size: 10px;
		color: var(--muted);
		width: 42px;
		text-align: right;
	}
</style>
