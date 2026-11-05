<script>
	let { data } = $props();

	/**
	 * Local overrides so the gate can be exercised without a backend.
	 * Kept separate from `data` rather than copied out of it, so navigating
	 * to a different action resets cleanly instead of showing stale state.
	 * @type {Record<string, boolean>}
	 */
	let overrides = $state({});
	let joined = $state(false);

	let conditions = $derived(
		data.boycott.conditions.map((/** @type {any} */ c) => ({
			...c,
			met: overrides[c.id] ?? c.met
		}))
	);
	let allMet = $derived(conditions.every((c) => c.met));
	let remaining = $derived(conditions.filter((c) => !c.met).length);

	/** @param {string} id */
	function toggle(id) {
		const current = conditions.find((c) => c.id === id);
		if (current) overrides = { ...overrides, [id]: !current.met };
	}
</script>

<svelte:head><title>Action · {data.boycott.object} · LIP</title></svelte:head>

<div class="wrap">
	<a class="back" href="/object/{data.boycott.objectId}">← Measurement</a>

	<!-- Act treatment: full inversion. The only mode-level signal Act gets.
	     Consequential screens read as consequential structurally. -->
	<section class="act">
		<span class="eyebrow">Boycott · {data.boycott.object}</span>

		<p class="strength">
			<b class="num">{data.boycott.strength}</b><span>/ 100 strength</span>
		</p>
		<p class="sub">
			Severity {data.boycott.severity} · triggering side: {data.boycott.triggeringSide} ·
			calculated duration {data.boycott.durationDays} days
		</p>

		<h2 class="k">Trigger conditions</h2>
		{#each conditions as c (c.id)}
			<div class="cond" class:met={c.met}>
				<i aria-hidden="true">{c.met ? '✓' : ''}</i>
				<span>{c.label}</span>
			</div>
		{/each}

		<button class="join" class:ready={allMet} disabled={!allMet} onclick={() => (joined = true)}>
			{#if joined}
				You have joined
			{:else if allMet}
				Join this boycott
			{:else}
				Join — {remaining} condition{remaining === 1 ? '' : 's'} remaining
			{/if}
		</button>

		<p class="count num">{data.boycott.participating.toLocaleString()} participating</p>
	</section>

	<div class="card">
		<h3 class="k">Why the gate exists</h3>
		<p class="note">
			Severity, verified instances, attribution confidence and a cool-off window must each be
			independently true before the commit button becomes live. The delay is the feature: it is what
			separates accountability infrastructure from an outrage engine.
		</p>
		<button class="ghost" onclick={() => toggle('cooloff')}>Toggle the cool-off condition</button>
	</div>

	<div class="card">
		<h3 class="k">Remediation</h3>
		<p class="note">
			De-escalation carries the same weight as escalation. Verified remediation recalculates
			strength rather than being filed away as a footnote.
		</p>
		<ul>
			{#each data.boycott.remediation as r (r.label)}
				<li><span>{r.label}</span><b>{r.effect}</b></li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.wrap {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.back {
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
		min-height: 32px;
		display: inline-flex;
		align-items: center;
	}
	.act {
		background: var(--ink);
		color: #fff;
		border-radius: 10px;
		padding: 16px;
	}
	.act .eyebrow {
		color: var(--gold-light);
	}
	.strength {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 10px 0 0;
	}
	.strength b {
		font: 600 34px var(--font-serif);
	}
	.strength span {
		font-size: 11px;
		color: #9a9d95;
	}
	.sub {
		font-size: 10px;
		color: #9a9d95;
		margin: 4px 0 0;
	}
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 16px 0 4px;
	}
	.act .k {
		color: #9a9d95;
	}
	.cond {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		padding: 10px 0;
		border-bottom: 1px solid #34372f;
		font-size: 11px;
		line-height: 1.4;
	}
	.cond:last-of-type {
		border-bottom: 0;
	}
	.cond i {
		width: 16px;
		height: 16px;
		border: 1.5px solid #7c8078;
		border-radius: 50%;
		flex: none;
		margin-top: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 9px;
		font-style: normal;
	}
	/* The one reserved color. Nowhere else in the product. */
	.cond.met i {
		background: var(--act-accent);
		border-color: var(--act-accent);
		color: #fff;
	}
	.join {
		width: 100%;
		margin-top: 14px;
		min-height: var(--tap-min);
		border: 0;
		border-radius: 7px;
		background: #4a4d47;
		color: #9a9d95;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: not-allowed;
	}
	.join.ready {
		background: var(--act-accent);
		color: #fff;
		cursor: pointer;
	}
	.count {
		font-size: 10px;
		color: #9a9d95;
		margin: 10px 0 0;
		text-align: center;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--white);
		padding: 14px;
	}
	.card .k {
		margin-top: 0;
	}
	.ghost {
		width: 100%;
		min-height: 36px;
		margin-top: 10px;
		border: 1px solid var(--ink);
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 9px var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
	}
	.card ul {
		list-style: none;
		padding: 0;
		margin: 10px 0 0;
	}
	.card li {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		padding: 7px 0;
		border-bottom: 1px solid var(--line);
		font-size: 11px;
	}
	.card li:last-child {
		border-bottom: 0;
	}
</style>
