<svelte:head><title>Methodology · LIP</title></svelte:head>

<div class="wrap">
	<h1>Methodology</h1>
	<p class="note">
		Every score on this app reaches this page in one tap. Modules are versioned, and a score records
		which instrument version produced it — a current score may depend on an older version, and that
		provenance is shown rather than hidden.
	</p>

	<ul class="modules">
		<li><span>Scoring engine</span><b>v1.4</b></li>
		<li><span>Axis loadings</span><b>v1.4</b></li>
		<li><span>Decay function</span><b>v1.2</b></li>
		<li><span>QC rules</span><b>v1.4</b></li>
		<li><span>Attribution weights</span><b>v1.3</b></li>
		<li><span>Boycott formula</span><b>v1.1</b></li>
	</ul>

	<div class="card">
		<h2 class="k">Rules the interface will not bend</h2>
		<ul class="rules">
			<li>Three outputs per object. They are never collapsed into one score.</li>
			<li>Opposing support weights are never averaged into Center.</li>
			<li>Only Expressed Position is plotted on the map.</li>
			<li>Coverage below 40% renders Provisional.</li>
			<li>Contested measurements render as a range, never a point.</li>
			<li>Agreeing with a measurement never enrols you in an action.</li>
		</ul>
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
		margin: 8px 0 14px;
	}
	.modules {
		list-style: none;
		padding: 0;
		margin: 0 0 14px;
		border-top: 1px solid var(--line);
	}
	.modules li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: var(--tap-min);
		border-bottom: 1px solid var(--line);
		font-size: 12px;
	}
	.modules b {
		font-size: 10px;
		color: var(--muted);
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
	.rules {
		margin: 0;
		padding-left: 18px;
		font-size: 11px;
		line-height: 1.7;
		color: var(--ink-2);
	}
</style>
