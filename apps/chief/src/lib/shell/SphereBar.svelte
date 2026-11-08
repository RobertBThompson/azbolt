<script>
	/**
	 * F0 Shell — the sphere bar. In v2 this was small grey text: the least
	 * prominent element on screen carrying the most consequential fact on
	 * it. Which sphere you are in decides what a jot means, and deciding
	 * between spheres is the Chief's central dilemma, so it claims the top
	 * band of every screen plus the leading slot in the app bar, in three
	 * redundant channels.
	 */
	import { SPHERES } from '$lib/spheres.js';
	import { shell } from '$lib/state.svelte.js';

	/** @type {{ search?: boolean, back?: string|null, onSwitch?: (() => void)|null }} */
	let { search = false, back = null, onSwitch = null } = $props();
	const sphere = $derived(SPHERES[shell.sphere] ?? SPHERES.all);
</script>

<div class="band" style="background:{sphere.swatch}"></div>

<header>
	{#if back}
		<a class="back" href={back} aria-label="Back">‹</a>
	{/if}
	<button class="sph" onclick={onSwitch} aria-label="Switch sphere, currently {sphere.name}">
		<span class="swatch" style="background:{sphere.swatch}"></span>
		<span class="name">{sphere.name}</span>
		<span class="caret" aria-hidden="true">▾</span>
	</button>
	<span class="spacer"></span>
	{#if search}
		<a class="act" href="/search" aria-label="Search">⌕</a>
	{/if}
	<a class="act" href="/menu" aria-label="More">⋯</a>
</header>

<style>
	.band {
		height: var(--band);
		flex: none;
	}
	header {
		height: var(--appbar);
		flex: none;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 13px;
		/* Paper, not card. The bottom nav is now continuous with the page,
		   and a white strip at the top would reinstate exactly the seam
		   the nav just lost. The context band above still does the
		   dividing, so nothing here needs a border. */
		background: var(--paper);
	}
	.back {
		width: 30px;
		height: 36px;
		margin-left: -8px;
		display: grid;
		place-items: center;
		font-size: 26px;
		line-height: 1;
		color: var(--ink);
		text-decoration: none;
	}
	.sph {
		display: flex;
		align-items: center;
		gap: 8px;
		background: none;
		border: 0;
		padding: 6px 0;
		cursor: pointer;
	}
	.swatch {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		flex: none;
	}
	.name {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--tone-graphite);
	}
	.caret {
		font-size: 10px;
		color: var(--ink-4);
	}
	.spacer {
		flex: 1;
	}
	.act {
		width: 36px;
		height: 36px;
		display: grid;
		place-items: center;
		font-size: 17px;
		color: var(--ink-4);
		text-decoration: none;
	}
</style>
