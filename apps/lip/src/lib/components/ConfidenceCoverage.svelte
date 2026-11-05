<script>
	import { COVERAGE_FLOOR } from '../data/fixtures.js';

	/**
	 * Confidence and coverage always appear together and use deliberately
	 * different encodings — segments vs. a continuous rule — so the two are
	 * never mistaken for each other.
	 *
	 * @type {{ confidence: number, coverage: number }}
	 */
	let { confidence, coverage } = $props();

	const segments = 10;
	let filled = $derived(Math.round((confidence / 100) * segments));
	let provisional = $derived(coverage < COVERAGE_FLOOR);
</script>

<div class="cc">
	<div class="metric">
		<span class="k">Conf</span>
		<span class="segs" aria-hidden="true">
			{#each Array(segments) as _, i}
				<i class:on={i < filled}></i>
			{/each}
		</span>
		<span class="num v">{confidence}%</span>
	</div>

	<div class="metric">
		<span class="k">Coverage</span>
		<span class="rule" class:hatched={provisional}>
			<b style="width:{coverage}%"></b>
		</span>
		<span class="num v">{coverage}%</span>
	</div>
</div>

{#if provisional}
	<p class="floor">
		<b>Provisional.</b> Coverage is below the {COVERAGE_FLOOR}% floor. This measurement is shown so it
		can be improved, not because it is settled.
	</p>
{/if}

<style>
	.cc {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 10px;
	}
	.metric {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.k {
		font: 700 8px var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		width: 58px;
		flex: none;
	}
	.v {
		font-size: 9px;
		color: var(--muted);
		width: 30px;
		text-align: right;
		flex: none;
	}
	/* Confidence: discrete segments. */
	.segs {
		flex: 1;
		display: flex;
		gap: 2px;
	}
	.segs i {
		flex: 1;
		height: 6px;
		background: #e4e2d8;
		border-radius: 1px;
	}
	.segs i.on {
		background: var(--ink);
	}
	/* Coverage: one continuous rule. Not interchangeable with the above. */
	.rule {
		flex: 1;
		height: 6px;
		background: #e4e2d8;
		border-radius: 3px;
		overflow: hidden;
	}
	.rule b {
		display: block;
		height: 100%;
		background: var(--ink-2);
	}
	.rule.hatched b {
		background: repeating-linear-gradient(45deg, #9a9a9a 0 3px, #cfcdc4 3px 6px);
	}
	.floor {
		font-size: 9px;
		line-height: 1.45;
		border-left: 3px solid var(--muted);
		padding: 6px 8px;
		background: var(--verify-tint);
		margin: 8px 0 0;
		color: var(--ink-2);
	}
</style>
