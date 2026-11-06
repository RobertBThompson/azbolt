<script>
	import AxisMeter from '$lib/components/AxisMeter.svelte';
	import ConfidenceCoverage from '$lib/components/ConfidenceCoverage.svelte';
	import Quadrant from '$lib/components/Quadrant.svelte';
	import QuorumIndicator from '$lib/components/QuorumIndicator.svelte';
	import ReportCard from '$lib/components/ReportCard.svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import StateBadge from '$lib/components/StateBadge.svelte';
	import { getObject } from '$lib/data/fixtures.js';

	/**
	 * Component gallery. Not a user-facing screen — a workbench for seeing
	 * each component on its own, with the props it takes.
	 *
	 * Every entry lists its import path and prop signature, so a component
	 * can be named precisely when asking for a change to it.
	 */

	let sheetOpen = $state(false);

	const northbay = getObject('northbay');
	const contested = getObject('whole-story');
	const provisional = getObject('hr901');

	const states = /** @type {const} */ ([
		'proposed',
		'review',
		'contested',
		'locked',
		'reopened',
		'withdrawn'
	]);

	/** Which components are LIP-specific and which could move to @azbolt/ui. */
	const shared = {
		AxisMeter: 'lip',
		ConfidenceCoverage: 'lip',
		Quadrant: 'lip',
		QuorumIndicator: 'lip',
		ReportCard: 'lip',
		Sheet: 'portable',
		StateBadge: 'portable'
	};
</script>

<svelte:head><title>Components · LIP</title></svelte:head>

<div class="wrap">
	<header class="intro">
		<h1>Components</h1>
		<p class="note">
			Seven components. Each one below is rendered in isolation with the props it accepts.
			<b>Portable</b> marks the two whose styling carries no LIP-specific meaning, so they could move
			to <code>@azbolt/ui</code> and be used by Chief, Chaim, Peace and Tithe as they are.
		</p>
	</header>

	<!-- 1 -->
	<section>
		<div class="chead">
			<h2>Sheet</h2>
			<span class="tag portable">Portable</span>
		</div>
		<code class="path">$lib/components/Sheet.svelte</code>
		<dl class="props">
			<dt>open</dt><dd>boolean</dd>
			<dt>title</dt><dd>string</dd>
			<dt>onclose</dt><dd>() =&gt; void</dd>
			<dt>children</dt><dd>Snippet</dd>
		</dl>
		<p class="note">
			Bottom sheet. This is where detail goes when a screen runs out of room — the alternative to
			shrinking type until everything fits. Closes on Escape or on the scrim.
		</p>
		<div class="demo">
			<button class="trybtn" onclick={() => (sheetOpen = true)}>Open the sheet</button>
		</div>
	</section>

	<!-- 2 -->
	<section>
		<div class="chead">
			<h2>StateBadge</h2>
			<span class="tag portable">Portable</span>
		</div>
		<code class="path">$lib/components/StateBadge.svelte</code>
		<dl class="props">
			<dt>state</dt>
			<dd>'proposed' | 'review' | 'contested' | 'locked' | 'reopened' | 'withdrawn'</dd>
		</dl>
		<p class="note">
			Six states. Each pairs a shape and stroke treatment with the word itself — colour never
			carries the meaning alone, and no state has a hue of its own.
		</p>
		<div class="demo badges">
			{#each states as s (s)}
				<StateBadge state={s} />
			{/each}
		</div>
	</section>

	<!-- 3 -->
	<section>
		<div class="chead">
			<h2>AxisMeter</h2>
			<span class="tag lip">LIP</span>
		</div>
		<code class="path">$lib/components/AxisMeter.svelte</code>
		<dl class="props">
			<dt>score</dt><dd>number — the −5..+5 position</dd>
			<dt>range</dt><dd>[number, number] | null — set for a contested measurement</dd>
		</dl>
		<p class="note">
			A contested measurement renders as a hatched range with solid caps. The point indicator is
			<i>replaced</i>, not supplemented, so no single number can be read off a disputed score.
		</p>
		<div class="demo">
			<span class="vlabel">score = 1.8</span>
			<AxisMeter score={1.8} />
			<span class="vlabel">score = −3.4</span>
			<AxisMeter score={-3.4} />
			<span class="vlabel">range = [−2.8, −1.7]</span>
			<AxisMeter range={[-2.8, -1.7]} />
		</div>
	</section>

	<!-- 4 -->
	<section>
		<div class="chead">
			<h2>ConfidenceCoverage</h2>
			<span class="tag lip">LIP</span>
		</div>
		<code class="path">$lib/components/ConfidenceCoverage.svelte</code>
		<dl class="props">
			<dt>confidence</dt><dd>number — 0..100</dd>
			<dt>coverage</dt><dd>number — 0..100; under 40 renders Provisional</dd>
		</dl>
		<p class="note">
			The two always appear together and use deliberately different encodings — discrete segments
			versus one continuous rule — so they are never mistaken for each other.
		</p>
		<div class="demo">
			<span class="vlabel">Healthy</span>
			<ConfidenceCoverage confidence={88} coverage={79} />
			<span class="vlabel">Below the coverage floor</span>
			<ConfidenceCoverage confidence={54} coverage={31} />
		</div>
	</section>

	<!-- 5 -->
	<section>
		<div class="chead">
			<h2>QuorumIndicator</h2>
			<span class="tag lip">LIP</span>
		</div>
		<code class="path">$lib/components/QuorumIndicator.svelte</code>
		<dl class="props">
			<dt>quorum</dt><dd>Record&lt;'L'|'CL'|'C'|'CR'|'R', number&gt;</dd>
			<dt>yourBin</dt><dd>string — called out in text, never by colour alone</dd>
		</dl>
		<p class="note">Filled chips have weighed in; dashed chips are still needed.</p>
		<div class="demo">
			<QuorumIndicator quorum={{ L: 12, CL: 9, C: 7, CR: 0, R: 0 }} yourBin="CR" />
		</div>
	</section>

	<!-- 6 -->
	<section>
		<div class="chead">
			<h2>Quadrant</h2>
			<span class="tag lip">LIP</span>
		</div>
		<code class="path">$lib/components/Quadrant.svelte</code>
		<dl class="props">
			<dt>objects</dt><dd>any[] — anything with .position, .type, .coverage</dd>
			<dt>height</dt><dd>number — px, default 330</dd>
			<dt>sizeBy</dt><dd>'none' | 'pressure'</dd>
			<dt>showLabels</dt><dd>boolean</dd>
			<dt>land</dt><dd>boolean — the post-onboarding travel animation</dd>
			<dt>onselect</dt><dd>(o) =&gt; void — a cluster hands back an array</dd>
		</dl>
		<p class="note">
			Plots Expressed Position only. Markers within 20px merge into a numbered cluster; the nearest
			corner label dims when a marker approaches it.
		</p>
		<div class="demo">
			<span class="vlabel">Mixed types, labels on</span>
			<Quadrant
				objects={[northbay, contested, provisional].filter(Boolean)}
				height={260}
			/>
			<span class="vlabel">sizeBy = "pressure"</span>
			<Quadrant objects={[northbay].filter(Boolean)} height={200} sizeBy="pressure" />
		</div>
	</section>

	<!-- 7 -->
	<section>
		<div class="chead">
			<h2>ReportCard</h2>
			<span class="tag lip">LIP</span>
		</div>
		<code class="path">$lib/components/ReportCard.svelte</code>
		<dl class="props">
			<dt>object</dt><dd>any — the full measured object</dd>
		</dl>
		<p class="note">
			The Measure surface. Composes AxisMeter, ConfidenceCoverage, StateBadge and Sheet. Renders
			the three outputs as separate cards — they are never collapsed into one score.
		</p>
		<div class="demo stack">
			{#if northbay}
				<ReportCard object={northbay} />
			{/if}
		</div>
	</section>

	<p class="foot">
		Shared components used by all five apps live in <code>packages/ui</code>: AppShell, Button,
		Card, InstallPrompt.
	</p>
</div>

<Sheet open={sheetOpen} title="Sheet component" onclose={() => (sheetOpen = false)}>
	<p class="note">
		This is the Sheet. Content scrolls inside it, the page behind it does not. It reaches 82% of
		the viewport height at most, and it clears the home indicator on a phone.
	</p>
</Sheet>

<style>
	.wrap {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.intro h1 {
		font-size: 26px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 10px 0 0;
	}
	section {
		border-radius: var(--radius);
		background: var(--white);
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}
	.chead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.chead h2 {
		font-size: var(--size-title);
	}
	.tag {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 5px 11px;
		border-radius: 20px;
		white-space: nowrap;
	}
	.tag.portable {
		background: var(--teal-500);
		color: #fff;
	}
	.tag.lip {
		border: 2px solid var(--line);
		color: var(--muted);
	}
	.path {
		display: block;
		font-size: var(--size-label);
		color: var(--teal-700);
		margin-top: 6px;
		word-break: break-all;
	}
	.props {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 14px;
		margin: 14px 0 0;
		font-size: var(--size-label);
	}
	.props dt {
		font-weight: 700;
		color: var(--ink);
	}
	.props dd {
		margin: 0;
		color: var(--muted);
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.demo {
		margin-top: 18px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}
	.demo.stack {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.vlabel {
		display: block;
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 18px 0 8px;
	}
	.vlabel:first-child {
		margin-top: 0;
	}
	.trybtn {
		width: 100%;
		border: 1.5px solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 var(--size-small) var(--font-sans);
		color: var(--ink);
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.92em;
	}
	.foot {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		text-align: center;
		margin: 0;
	}
</style>
