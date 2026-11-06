<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Quadrant from '$lib/components/Quadrant.svelte';
	import Sheet from '$lib/components/Sheet.svelte';
	import { views, objects, me, activity, binLabel } from '$lib/data/fixtures.js';
	import { loadPosition } from '$lib/storage/position.js';

	let activeView = $state('my');

	/** Position lives in localStorage, so it is read in the browser only. */
	let mine = $state(/** @type {any} */ (null));
	let ready = $state(false);

	$effect(() => {
		mine = loadPosition();
		ready = true;
	});

	let coachmark = $state(true);
	let legendOpen = $state(false);
	let activityOpen = $state(false);

	let justOnboarded = $derived($page.url.searchParams.get('welcome') === '1');
	let view = $derived(views.find((v) => v.id === activeView) ?? views[0]);
	let lead = $derived(activity[0]);

	let meObject = $derived(
		mine ? { ...me, position: { fiscal: mine.fiscal, social: mine.social }, coverage: 100 } : me
	);

	let plotted = $derived(
		view.ids.map((id) => (id === 'me' ? meObject : objects.find((o) => o.id === id))).filter(Boolean)
	);

	/** Clusters hand back an array; a single marker hands back the object. */
	function select(/** @type {any} */ hit) {
		if (Array.isArray(hit)) return;
		if (hit.id === 'me') return goto('/me');
		goto(`/object/${hit.id}`);
	}

	const shapes = [
		{ cls: 'lp', label: 'Person or candidate', note: 'Circle' },
		{ cls: 'lc', label: 'Company', note: 'Rounded square' },
		{ cls: 'lm', label: 'Media', note: 'Triangle' },
		{ cls: 'lb', label: 'Bill', note: 'Teardrop' },
		{ cls: 'ly', label: 'You', note: 'Larger, brass' }
	];
</script>

<svelte:head><title>LIP</title></svelte:head>

<!-- Home paints its own header so the score can sit inside the gradient. -->
<header class="hero">
	<div class="top">
		<span class="appmark">LIP</span>
		<div class="utils">
			<a class="method" href="/method">Method</a>
			<a class="method" href="/components">Components</a>
		</div>
	</div>

	{#if ready && mine}
		<div class="scoreblock">
			<span class="kicker">Your position</span>
			<p class="score num">
				{mine.fiscal > 0 ? '+' : ''}{mine.fiscal.toFixed(1)}
				<span class="slash">/</span>
				{mine.social > 0 ? '+' : ''}{mine.social.toFixed(1)}
			</p>
			<p class="bins">Fiscal {binLabel(mine.fiscal)} · Social {binLabel(mine.social)}</p>
		</div>
	{:else if ready}
		<div class="scoreblock">
			<span class="kicker">Your position</span>
			<p class="empty">You're not on the map yet.</p>
			<a class="cta" href="/welcome">Find your position</a>
		</div>
	{/if}
</header>

<div class="pad">
	{#if justOnboarded && coachmark && mine}
		<div class="coach">
			<span>That brass dot is you. Everything else is measured against evidence, not against you.</span>
			<button onclick={() => (coachmark = false)}>Got it</button>
		</div>
	{/if}

	<div class="viewrail">
		{#each views as v (v.id)}
			<button class:active={v.id === activeView} onclick={() => (activeView = v.id)}>
				{v.label}
			</button>
		{/each}
	</div>

	<div class="maphead">
		<h2>{view.title}</h2>
		<button class="keybtn" onclick={() => (legendOpen = true)}>Key</button>
	</div>

	{#key activeView}
		<Quadrant
			objects={plotted}
			height={320}
			sizeBy={activeView === 'pressure' ? 'pressure' : 'none'}
			land={justOnboarded && activeView === 'my'}
			onselect={select}
		/>
	{/key}

	{#if activeView === 'pressure'}
		<p class="lens">
			Marker size is pressure magnitude, not political position. A bigger dot means more people are
			acting, not that the object sits further out.
		</p>
	{/if}

	<section class="feed">
		<div class="feedhead">
			<h2>What's speaking now</h2>
			<span class="live">Live</span>
		</div>

		<!-- One item at full size, the rest behind a tap. -->
		<a class="arow {lead.mode}" href={lead.href}>
			<span class="txt">
				<b>{lead.title}</b>
				<span class="detail">{lead.detail}</span>
			</span>
			{#if lead.badge}<span class="mv">{lead.badge}</span>{/if}
		</a>

		<button class="more" onclick={() => (activityOpen = true)}>
			See all {activity.length} items
		</button>
	</section>
</div>

<Sheet open={legendOpen} title="Map key" onclose={() => (legendOpen = false)}>
	<ul class="keylist">
		{#each shapes as s (s.cls)}
			<li><i class={s.cls}></i><b>{s.label}</b><span>{s.note}</span></li>
		{/each}
	</ul>
	<p class="note">
		Shape carries the type of object, never colour on its own. Only Expressed Position is plotted
		here — support and pressure are not positions, so they get no coordinate.
	</p>
</Sheet>

<Sheet open={activityOpen} title="What's speaking now" onclose={() => (activityOpen = false)}>
	<div class="sheetfeed">
		{#each activity as row (row.title)}
			<a class="arow {row.mode}" href={row.href}>
				<span class="txt">
					<b>{row.title}</b>
					<span class="detail">{row.detail}</span>
				</span>
				{#if row.badge}<span class="mv">{row.badge}</span>{/if}
			</a>
		{/each}
	</div>
</Sheet>

<style>
	.hero {
		padding: 16px 18px 20px;
		background: var(--header);
		box-shadow: 0 6px 24px rgba(15, 74, 77, 0.3);
	}
	.top {
		display: flex;
		align-items: center;
	}
	.appmark {
		font-family: var(--font-serif);
		font-size: 27px;
		font-weight: 600;
		letter-spacing: 0.14em;
		color: #fff;
	}
	.utils {
		margin-left: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.method {
		min-height: 34px;
		display: inline-flex;
		align-items: center;
		font-size: var(--size-label);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--on-teal);
		text-decoration: none;
	}
	.scoreblock {
		margin-top: 12px;
	}
	.kicker {
		font: 700 var(--size-label) / 1 var(--font-sans);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--on-teal-dim);
	}
	/* The number is the product, so it gets the display size. */
	.score {
		font-family: var(--font-serif);
		font-size: var(--size-display);
		font-weight: 600;
		line-height: 1;
		color: #fff;
		margin: 8px 0 0;
	}
	.slash {
		color: rgba(255, 255, 255, 0.45);
	}
	.bins {
		font-size: var(--size-small);
		color: var(--on-teal);
		margin: 8px 0 0;
	}
	.empty {
		font-family: var(--font-serif);
		font-size: 26px;
		color: #fff;
		margin: 8px 0 14px;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: var(--tap-min);
		padding: 0 22px;
		border-radius: 24px;
		background: linear-gradient(160deg, var(--app-accent), var(--app-accent-strong));
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 6px 16px rgba(192, 125, 31, 0.36);
	}

	.pad {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.coach {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border-left: 5px solid var(--app-accent);
		border-radius: var(--radius-sm);
		background: var(--app-accent-tint);
		font-size: var(--size-small);
		line-height: 1.5;
	}
	.coach button {
		margin-left: auto;
		flex: none;
		padding: 0 16px;
		border: 0;
		border-radius: var(--radius-sm);
		background: var(--white);
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		box-shadow: var(--shadow-sm);
	}

	.viewrail {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scrollbar-width: none;
		margin: 0 -16px;
		padding: 0 16px 2px;
	}
	.viewrail::-webkit-scrollbar {
		display: none;
	}
	.viewrail button {
		white-space: nowrap;
		padding: 0 20px;
		border: 0;
		border-radius: 24px;
		background: var(--white);
		color: #3d4a48;
		font: 600 var(--size-small) var(--font-sans);
		box-shadow: var(--shadow-sm);
	}
	.viewrail button.active {
		background: linear-gradient(160deg, var(--app-accent), var(--app-accent-strong));
		color: #fff;
		font-weight: 700;
		box-shadow: 0 6px 14px rgba(192, 125, 31, 0.34);
	}

	.maphead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.maphead h2 {
		font-size: var(--size-title);
	}
	.keybtn {
		flex: none;
		padding: 0 18px;
		border: 0;
		border-radius: 24px;
		background: var(--white);
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--teal-900);
		box-shadow: var(--shadow-sm);
	}
	.lens {
		font-size: var(--size-small);
		line-height: 1.55;
		color: var(--muted);
		border-left: 4px solid var(--line-strong);
		padding: 8px 12px;
		margin: 0;
	}

	.feed {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.feedhead {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	.feedhead h2 {
		font-size: var(--size-title);
	}
	.live {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--teal-500);
	}

	/* Mode treatments: plain card / left rule + tint / full inversion.
	   Structural, never a hue. */
	.arow {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 18px;
		border-radius: var(--radius);
		text-decoration: none;
		min-height: var(--tap-min);
	}
	.arow .txt {
		flex: 1;
	}
	.arow b {
		display: block;
		font-size: var(--size-body);
		font-weight: 600;
		line-height: 1.35;
	}
	.arow .detail {
		display: block;
		font-size: var(--size-small);
		margin-top: 4px;
	}
	.measure {
		background: var(--white);
		box-shadow: var(--shadow-sm);
		color: var(--ink);
	}
	.measure .detail {
		color: var(--muted);
	}
	.verify {
		background: var(--white);
		border-left: 5px solid var(--teal-500);
		box-shadow: var(--shadow-sm);
		color: var(--ink);
	}
	.verify .detail {
		color: var(--muted);
	}
	.act {
		background: linear-gradient(145deg, #11373a, #081f22);
		box-shadow: 0 10px 24px rgba(8, 31, 34, 0.32);
		color: #fff;
	}
	.act .detail {
		color: #96b3b0;
	}
	.mv {
		flex: none;
		font: 700 var(--size-small) var(--font-sans);
		letter-spacing: 0.1em;
		color: var(--app-accent-text);
	}
	/* The reserved colour appears on the live-boycott row and JOIN only. */
	.act .mv {
		color: var(--act-accent-2);
	}

	.more {
		border: 0;
		border-radius: var(--radius);
		background: none;
		border: 1.5px solid var(--line);
		font: 700 var(--size-small) var(--font-sans);
		color: var(--teal-900);
	}

	.keylist {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.keylist li {
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: var(--tap-min);
		border-bottom: 1px solid var(--line);
	}
	.keylist b {
		flex: 1;
		font-size: var(--size-body);
		font-weight: 600;
	}
	.keylist span {
		font-size: var(--size-small);
		color: var(--muted);
	}
	.keylist i {
		width: 18px;
		height: 18px;
		flex: none;
		background: var(--app-accent);
		display: block;
	}
	.lp {
		border-radius: 50%;
	}
	.lc {
		border-radius: 5px;
	}
	.lm {
		clip-path: polygon(50% 4%, 97% 94%, 3% 94%);
	}
	.lb {
		border-radius: 50% 0 50% 50%;
		rotate: -45deg;
	}
	.ly {
		border-radius: 50%;
		box-shadow: 0 0 0 4px var(--app-accent-tint);
	}

	.sheetfeed {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
</style>
