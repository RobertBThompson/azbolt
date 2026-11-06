<script>
	import { goto } from '$app/navigation';
	import Quadrant from '$lib/components/Quadrant.svelte';
	import { objects } from '$lib/data/fixtures.js';

	let mode = $state('points');

	/**
	 * Density bins the same continuous data into the 5x5 grid.
	 * This is the ONLY screen the grid appears on. It was never meant to be
	 * Home, and it is a simplification of the real data, not a second truth.
	 */
	let cells = $derived.by(() => {
		const grid = Array.from({ length: 25 }, () => 0);
		for (const o of objects) {
			const col = Math.min(4, Math.floor(((o.position.fiscal + 5) / 10) * 5));
			const row = Math.min(4, Math.floor(((o.position.social + 5) / 10) * 5));
			grid[row * 5 + col] += 1;
		}
		return grid;
	});

	let peak = $derived(Math.max(1, ...cells));

	/** Sequential gray ramp, white to ink. No political coloring, ever. */
	/** @param {number} count */
	function shade(count) {
		if (!count) return '#ffffff';
		const steps = ['#efeee6', '#d8d5c8', '#b8b3a0', '#8f8a76', '#6b6656'];
		return steps[Math.min(steps.length - 1, Math.ceil((count / peak) * steps.length) - 1)];
	}
</script>

<svelte:head><title>Explore · LIP</title></svelte:head>

<div class="wrap">
	<h1>Explore</h1>

	<div class="toggle" role="tablist">
		<button role="tab" aria-selected={mode === 'points'} onclick={() => (mode = 'points')}>
			Points
		</button>
		<button role="tab" aria-selected={mode === 'density'} onclick={() => (mode = 'density')}>
			Density
		</button>
	</div>

	{#if mode === 'points'}
		<Quadrant {objects} height={340} onselect={(o) => !Array.isArray(o) && goto(`/object/${o.id}`)} />
	{:else}
		<div class="matrix">
			{#each cells as count, i (i)}
				<div style="background:{shade(count)};color:{count > peak / 2 ? '#fff' : '#8a8a8a'}">
					{count || ''}
				</div>
			{/each}
		</div>
		<div class="axis-key">
			<span>Fiscal L</span><span>C</span><span>Fiscal R</span>
		</div>
	{/if}

	<p class="note">
		{#if mode === 'points'}
			Objects sit at their real continuous coordinates. Precise, but unreadable past a few hundred
			objects.
		{:else}
			The same data binned into the 5×5 grid and shaded by count. This is the only place the grid
			appears — it is a readable simplification of continuous data, not the measurement itself.
		{/if}
	</p>

	<ul class="list">
		{#each objects as o (o.id)}
			<li>
				<a href="/object/{o.id}">
					<span>
						<b>{o.name}</b>
						{o.kind}
					</span>
					<b class="num"
						>{o.position.fiscal > 0 ? '+' : ''}{o.position.fiscal.toFixed(1)}</b
					>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.wrap {
		padding: 16px;
	}
	h1 {
		font-size: 26px;
		margin-bottom: 14px;
	}
	.toggle {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}
	.toggle button {
		padding: 0 24px;
		border: 0;
		border-radius: 24px;
		background: var(--white);
		font: 600 var(--size-small) var(--font-sans);
		color: #3d4a48;
		box-shadow: var(--shadow-sm);
	}
	.toggle button[aria-selected='true'] {
		background: linear-gradient(160deg, var(--app-accent), var(--app-accent-strong));
		color: #fff;
		font-weight: 700;
		box-shadow: 0 6px 14px rgba(192, 125, 31, 0.34);
	}
	.matrix {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 3px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}
	.matrix div {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--size-body);
		font-weight: 600;
	}
	.axis-key {
		display: flex;
		justify-content: space-between;
		font-size: var(--size-label);
		color: var(--muted);
		margin-top: 8px;
	}
	.note {
		font-size: var(--size-small);
		line-height: 1.6;
		color: var(--muted);
		margin: 16px 0;
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 64px;
		padding: 14px 18px;
		border-radius: var(--radius-sm);
		background: var(--white);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
		font-size: var(--size-small);
		color: var(--muted);
	}
	.list b {
		display: block;
		font-size: var(--size-body);
		font-weight: 600;
		color: var(--ink);
		margin-bottom: 2px;
	}
	.list a > b.num {
		font-family: var(--font-serif);
		font-size: var(--size-title);
		margin: 0;
	}
</style>
