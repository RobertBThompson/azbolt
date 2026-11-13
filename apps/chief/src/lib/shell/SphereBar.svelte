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
	import Icon from '$lib/kit/Icon.svelte';

	/** @type {{ search?: boolean, back?: string|null }} */
	let { search = false, back = null } = $props();
	const sphere = $derived(SPHERES[shell.sphere] ?? SPHERES.all);
</script>

<div class="band" style="background:{sphere.swatch}"></div>

<header>
	{#if back}
		<a class="back" href={back} aria-label="Back">‹</a>
	{/if}
	{#if !back}
		<img class="mark" src="/logo.png" alt="" width="26" height="26" />
	{/if}
	<a class="sph" href="/sphere/switch" aria-label="Switch sphere, currently {sphere.name}">
		<span class="name">{sphere.name}</span>
		<span class="caret" aria-hidden="true">▾</span>
	</a>
	<span class="spacer"></span>
	{#if search}
		<a class="act" href="/search" aria-label="Search"><Icon name="search" size={17} /></a>
	{/if}
	<a class="act avatar" href="/menu" aria-label="Account and settings">
		<Icon name="user-solid" size={18} />
	</a>
</header>

<style>
	.band {
		height: var(--band);
		/* On the field the band was a hard stripe with a shadow under it,
		   which read as a browser artifact rather than the sphere marker.
		   It keeps its colour but fades into the field at its lower edge. */
		opacity: 0.9;
		-webkit-mask-image: linear-gradient(180deg, #000 0 45%, transparent 100%);
		mask-image: linear-gradient(180deg, #000 0 45%, transparent 100%);
		flex: none;
	}
	header {
		min-height: var(--appbar);
		flex: none;
		display: flex;
		align-items: center;
		gap: 8px;
		/* The band and the row were touching, which read as one thick
		   stripe rather than a sphere marker above a toolbar. */
		padding: 12px calc(var(--shell-gutter) - 2px) 2px;
		/* Paper, not card. The bottom nav is now continuous with the page,
		   and a white strip at the top would reinstate exactly the seam
		   the nav just lost. The context band above still does the
		   dividing, so nothing here needs a border. */
		background: transparent;
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
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: 0;
		padding: 6px 0;
		cursor: pointer;
	}
	.mark {
		width: 26px;
		height: 26px;
		flex: none;
	}
	/* Serif, not mono. The sphere name is the masthead of the screen and
	   reads as one; the hue channel it used to share with a swatch now
	   lives in the band above, which is larger and harder to miss. */
	.name {
		font-family: var(--font-serif);
		font-size: 19px;
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--on-field);
	}
	.caret {
		font-size: 10px;
		color: var(--ink-4);
	}
	.spacer {
		flex: 1;
	}
	.act {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: rgba(255, 255, 255, 0.16);
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: var(--on-field);
		text-decoration: none;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	/* A hairline person at this size read as an unfinished wireframe. A
	   solid silhouette on a tinted disc, ringed in the mark's own wine,
	   reads as an account rather than a placeholder. */
	/* On the field rather than on paper, so the disc is glass with a
	   white rim instead of a tinted circle with a wine one. */
	.avatar {
		border: 0;
		background: rgba(255, 255, 255, 0.18);
		box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.75);
		color: var(--on-field);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	@media (min-width: 48rem) {
		header {
			width: 100%;
			max-width: var(--shell-width);
			margin-inline: auto;
			padding: 12px var(--shell-gutter) 0;
		}
		.sph {
			min-height: var(--tap-min);
		}
		.act {
			width: 40px;
			height: 40px;
			flex: none;
		}
	}
</style>
