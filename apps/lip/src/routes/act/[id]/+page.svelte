<script>
	import Sheet from '$lib/components/Sheet.svelte';

	let { data } = $props();

	/** @type {Record<string, boolean>} */
	let overrides = $state({});
	let joined = $state(false);
	let remediationOpen = $state(false);

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

	<!-- Act treatment: full inversion. The only mode-level signal Act gets. -->
	<section class="act">
		<span class="eyebrow">Boycott · {data.boycott.object}</span>

		<p class="strength num">{data.boycott.strength}<span>/ 100</span></p>
		<p class="sub">
			Severity {data.boycott.severity} · triggering side {data.boycott.triggeringSide} ·
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
				{remaining} condition{remaining === 1 ? '' : 's'} remaining
			{/if}
		</button>

		<p class="count num">{data.boycott.participating.toLocaleString()} participating</p>
	</section>

	<div class="card">
		<h3 class="k">Why the gate exists</h3>
		<p class="note">
			Severity, verified instances, attribution confidence and a cool-off window must each be
			independently true before the commit button goes live. The delay is the feature. It is what
			separates accountability infrastructure from an outrage engine.
		</p>
		<button class="ghost" onclick={() => toggle('cooloff')}>Toggle the cool-off condition</button>
	</div>

	<button class="ghostwide" onclick={() => (remediationOpen = true)}>
		Remediation · {data.boycott.remediation.length} verified actions
	</button>
</div>

<Sheet open={remediationOpen} title="Remediation" onclose={() => (remediationOpen = false)}>
	<p class="note">
		De-escalation carries the same weight as escalation. Verified remediation recalculates strength
		rather than being filed as a footnote.
	</p>
	<ul class="rem">
		{#each data.boycott.remediation as r (r.label)}
			<li><span>{r.label}</span><b>{r.effect}</b></li>
		{/each}
	</ul>
</Sheet>

<style>
	.wrap {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.back {
		min-height: var(--tap-min);
		display: inline-flex;
		align-items: center;
		font-size: var(--size-small);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
	}
	.act {
		background: linear-gradient(145deg, #11373a, #06191c);
		color: #fff;
		border-radius: var(--radius);
		padding: 22px;
		box-shadow: var(--shadow-lg);
	}
	.act .eyebrow {
		color: var(--gold-light);
	}
	.strength {
		font-family: var(--font-serif);
		font-size: 56px;
		font-weight: 600;
		line-height: 1;
		margin: 14px 0 0;
	}
	.strength span {
		font-size: var(--size-body);
		font-family: var(--font-sans);
		color: #9ab2b0;
		margin-left: 8px;
	}
	.sub {
		font-size: var(--size-small);
		line-height: 1.5;
		color: #9ab2b0;
		margin: 8px 0 0;
	}
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 22px 0 6px;
	}
	.act .k {
		color: #9ab2b0;
	}
	.cond {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 14px 0;
		border-bottom: 1px solid #2a4446;
		font-size: var(--size-small);
		line-height: 1.5;
	}
	.cond:last-of-type {
		border-bottom: 0;
	}
	.cond i {
		width: 24px;
		height: 24px;
		border: 2px solid #5e7a78;
		border-radius: 50%;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--size-small);
		font-style: normal;
	}
	/* The one reserved colour. Nowhere else in the product. */
	.cond.met i {
		background: var(--act-accent);
		border-color: var(--act-accent);
		color: #fff;
	}
	.join {
		width: 100%;
		margin-top: 20px;
		min-height: 58px;
		border: 0;
		border-radius: var(--radius-sm);
		background: #3d5250;
		color: #93a8a6;
		font: 700 var(--size-body) var(--font-sans);
		letter-spacing: 0.04em;
		cursor: not-allowed;
	}
	.join.ready {
		background: linear-gradient(160deg, #d4631f, var(--act-accent));
		color: #fff;
		cursor: pointer;
		box-shadow: 0 8px 22px rgba(193, 84, 28, 0.42);
	}
	.count {
		font-size: var(--size-small);
		color: #9ab2b0;
		margin: 14px 0 0;
		text-align: center;
	}
	.card {
		border-radius: var(--radius);
		background: var(--white);
		padding: 20px;
		box-shadow: var(--shadow-sm);
	}
	.card .k {
		margin-top: 0;
	}
	.ghost,
	.ghostwide {
		width: 100%;
		border: 1.5px solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 var(--size-small) var(--font-sans);
		color: var(--ink);
	}
	.ghost {
		margin-top: 14px;
	}
	.rem {
		list-style: none;
		padding: 0;
		margin: 14px 0 0;
	}
	.rem li {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		align-items: center;
		min-height: var(--tap-min);
		border-bottom: 1px solid var(--line);
		font-size: var(--size-body);
	}
	.rem li b {
		font-size: var(--size-small);
		color: var(--teal-700);
	}
</style>
