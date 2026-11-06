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
		<span class="k">Confidence</span>
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
		gap: 10px;
		margin-top: 16px;
	}
	.metric {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		width: 82px;
		flex: none;
	}
	.v {
		font-size: var(--size-small);
		color: var(--muted);
		width: 40px;
		text-align: right;
		flex: none;
	}
	/* Confidence: discrete segments. */
	.segs {
		flex: 1;
		display: flex;
		gap: 3px;
	}
	.segs i {
		flex: 1;
		height: 9px;
		background: #e4e2d8;
		border-radius: 2px;
	}
	.segs i.on {
		background: var(--ink);
	}
	/* Coverage: one continuous rule. Not interchangeable with the above. */
	.rule {
		flex: 1;
		height: 9px;
		background: #e4e2d8;
		border-radius: 5px;
		overflow: hidden;
	}
	.rule b {
		display: block;
		height: 100%;
		background: var(--ink-2);
	}
	.rule.hatched b {
		background: repeating-linear-gradient(45deg, #9a9a92 0 4px, #cfcdc4 4px 8px);
	}
	.floor {
		font-size: var(--size-small);
		line-height: 1.55;
		border-left: 4px solid var(--muted);
		padding: 10px 14px;
		background: var(--verify-tint);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		margin: 14px 0 0;
		color: var(--ink-2);
	}
</style>
