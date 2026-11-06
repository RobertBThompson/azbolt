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
		padding: 16px;
	}
	h1 {
		font-size: 26px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 10px 0 18px;
	}
	.modules {
		list-style: none;
		padding: 0;
		margin: 0 0 18px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.modules li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 56px;
		padding: 0 18px;
		border-radius: var(--radius-sm);
		background: var(--white);
		box-shadow: var(--shadow-sm);
		font-size: var(--size-body);
		font-weight: 600;
	}
	.modules b {
		font-size: var(--size-small);
		font-weight: 700;
		color: var(--teal-700);
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
		margin-bottom: 12px;
	}
	.rules {
		margin: 0;
		padding-left: 20px;
		font-size: var(--size-small);
		line-height: 1.9;
		color: var(--ink-2);
	}
</style>
