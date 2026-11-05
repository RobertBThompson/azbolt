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
		<Quadrant {objects} height={300} onselect={(o) => !Array.isArray(o) && goto(`/object/${o.id}`)} />
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
		padding: 12px;
	}
	h1 {
		font-size: 20px;
		margin-bottom: 10px;
	}
	.toggle {
		display: inline-flex;
		border: 1px solid var(--ink);
		border-radius: 7px;
		overflow: hidden;
		margin-bottom: 12px;
	}
	.toggle button {
		min-height: 36px;
		padding: 0 16px;
		border: 0;
		background: var(--white);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
	}
	.toggle button[aria-selected='true'] {
		background: var(--ink);
		color: #fff;
	}
	.matrix {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: 8px;
		overflow: hidden;
	}
	.matrix div {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
	}
	.axis-key {
		display: flex;
		justify-content: space-between;
		font-size: 8px;
		color: var(--muted);
		margin-top: 4px;
	}
	.note {
		font-size: 10px;
		line-height: 1.5;
		color: var(--muted);
		margin: 12px 0;
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--line);
	}
	.list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		min-height: var(--tap-min);
		padding: 8px 0;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
		font-size: 9px;
		color: var(--muted);
	}
	.list b {
		display: block;
		font-size: 12px;
		color: var(--ink);
	}
</style>
