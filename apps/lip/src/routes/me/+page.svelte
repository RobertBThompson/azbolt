<script>
	import Quadrant from '$lib/components/Quadrant.svelte';
	import { me } from '$lib/data/fixtures.js';
</script>

<svelte:head><title>Me · LIP</title></svelte:head>

<div class="wrap">
	<div class="top">
		<h1>Your position</h1>
		<span class="badge">Private</span>
	</div>

	<Quadrant objects={[me]} height={240} />

	<div class="card">
		<h2 class="k">Private by default</h2>
		<p class="note">
			Your placement is never public. Only your anonymous position bin — {me.bin} — contributes to
			balancing a QC quorum, so items that need your perspective can find you without exposing who
			you are.
		</p>
	</div>

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
</style>
