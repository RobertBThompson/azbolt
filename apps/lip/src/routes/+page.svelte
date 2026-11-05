<script>
	import { goto } from '$app/navigation';
	import Quadrant from '$lib/components/Quadrant.svelte';
	import { views, objects, me, activity } from '$lib/data/fixtures.js';

	let activeView = $state('my');

	let view = $derived(views.find((v) => v.id === activeView) ?? views[0]);

	let plotted = $derived(
		view.ids.map((id) => (id === 'me' ? me : objects.find((o) => o.id === id))).filter(Boolean)
	);

	/** Clusters hand back an array; a single marker hands back the object. */
	/** @param {any} hit */
	function select(hit) {
		if (Array.isArray(hit)) return;
		if (hit.id === 'me') return goto('/me');
		goto(`/object/${hit.id}`);
	}
</script>

<svelte:head><title>LIP</title></svelte:head>

<!-- View rail: a lens change, never a navigation. -->
<div class="viewrail">
	{#each views as v (v.id)}
		<button class:active={v.id === activeView} onclick={() => (activeView = v.id)}>
			{v.label}
		</button>
	{/each}
</div>

<div class="maphead">
	<strong>{view.title}</strong>
	<small>{view.meta}</small>
</div>

<div class="qwrap">
	<Quadrant
		objects={plotted}
		height={300}
		sizeBy={activeView === 'pressure' ? 'pressure' : 'none'}
		onselect={select}
	/>

	<div class="legend">
		<span class="lp"><i></i>Person</span>
		<span class="lc"><i></i>Company</span>
		<span class="lm"><i></i>Media</span>
		<span class="lb"><i></i>Bill</span>
		<span class="ly"><i></i>You</span>
	</div>

	{#if activeView === 'pressure'}
		<p class="lens-note">
			Marker size is pressure magnitude, not political position. A larger dot means more people are
			acting, not that the object sits further out.
		</p>
	{/if}
</div>

<section class="activity">
	<div class="head">
		<h2>What's speaking now</h2>
		<span>Live</span>
	</div>

	{#each activity as row (row.title)}
		<a class="arow {row.mode}" href={row.href}>
			<span class="txt">
				<b>{row.title}</b>
				{row.detail}
			</span>
			{#if row.badge}<span class="mv">{row.badge}</span>{/if}
		</a>
	{/each}
</section>

<style>
	.viewrail {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding: 9px 12px 8px;
		background: var(--white);
		scrollbar-width: none;
	}
	.viewrail::-webkit-scrollbar {
		display: none;
	}
	.viewrail button {
		min-height: 32px;
		white-space: nowrap;
		border: 1px solid var(--line);
		border-radius: 16px;
		background: var(--white);
		padding: 0 12px;
		font-size: 10px;
		font-weight: 700;
		color: var(--ink-2);
		cursor: pointer;
	}
	.viewrail button.active {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.maphead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
		padding: 2px 14px 8px;
	}
	.maphead strong {
		font: 600 15px var(--font-serif);
	}
	.maphead small {
		font-size: 9px;
		color: var(--muted);
		text-align: right;
	}
	.qwrap {
		padding: 0 12px;
	}
	.legend {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		padding: 10px 2px 0;
		font-size: 9px;
		color: var(--muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.legend i {
		width: 8px;
		height: 8px;
		background: var(--muted-2);
		display: inline-block;
	}
	.lp i {
		border-radius: 50%;
	}
	.lc i {
		border-radius: 2px;
	}
	.lm i {
		clip-path: polygon(50% 6%, 96% 92%, 4% 92%);
	}
	.lb i {
		border-radius: 50% 0 50% 50%;
		rotate: -45deg;
	}
	.ly i {
		background: var(--app-accent);
		border-radius: 50%;
		width: 11px;
		height: 11px;
	}
	.lens-note {
		font-size: 9px;
		line-height: 1.45;
		color: var(--muted);
		border-left: 3px solid var(--line-strong);
		padding: 5px 8px;
		margin: 10px 0 0;
	}

	.activity {
		padding: 16px 12px 0;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	.head h2 {
		font: 600 13px var(--font-serif);
	}
	.head span {
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	/* Mode treatments: plain card / left-rule + tint / full inversion.
	   Structural, never a hue. */
	.arow {
		display: flex;
		gap: 9px;
		align-items: center;
		border-radius: 9px;
		padding: 10px;
		margin-bottom: 6px;
		font-size: 9px;
		text-decoration: none;
		min-height: var(--tap-min);
	}
	.arow .txt {
		flex: 1;
		color: var(--muted);
	}
	.arow b {
		display: block;
		font-size: 11px;
		color: inherit;
		margin-bottom: 2px;
	}
	.measure {
		background: var(--white);
		border: 1px solid var(--line);
	}
	.verify {
		background: var(--verify-tint);
		border: 1px solid var(--line);
		border-left: 4px solid var(--ink);
	}
	.act {
		background: var(--ink);
		border: 1px solid var(--ink);
		color: #fff;
	}
	.act .txt {
		color: #b9bdb6;
	}
	.mv {
		font-weight: 700;
		color: var(--app-accent-text);
		letter-spacing: 0.06em;
	}
	/* The reserved color appears on the live-boycott row and the JOIN button only. */
	.act .mv {
		color: var(--act-accent-2);
	}
</style>
