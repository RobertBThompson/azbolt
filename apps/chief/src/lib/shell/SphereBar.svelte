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
		<a class="act back" href={back} aria-label="Back"><span aria-hidden="true">‹</span></a>
	{/if}
	{#if !back}
		<span class="mark"><img src="/logo.png" alt="" width="24" height="24" /></span>
	{/if}
	<a class="sph" href="/sphere/switch" aria-label="Switch sphere, currently {sphere.name}">
		<span class="name">{sphere.name}</span>
		<span class="caret" aria-hidden="true"></span>
	</a>
	<span class="spacer"></span>
	{#if search}
		<a class="act" href="/search" aria-label="Search"><Icon name="search" size={19} /></a>
	{/if}
	<a class="act avatar" href="/menu" aria-label="Account and settings">
		<Icon name="user-solid" size={20} />
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
		gap: 10px;
		/* The band and the row were touching, which read as one thick
		   stripe rather than a sphere marker above a toolbar. */
		padding: 12px calc(var(--shell-gutter) - 1px) 2px;
		background: transparent;
	}
	.sph {
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		background: none;
		border: 0;
		padding: 6px 0;
		cursor: pointer;
	}
	/* The mark is wine and blue, and the masthead is now indigo: on its
	   own it sank into the field. It sits on a small lit disc, the same
	   one it has in the nav, so it is the same object in both places. */
	.mark {
		width: 36px;
		height: 36px;
		flex: none;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: radial-gradient(circle at 34% 24%, #ffffff 0%, #f3f0ff 58%, #dcd5f6 100%);
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -5px 8px -5px rgba(86, 66, 170, 0.45),
			0 0 0 1px rgba(255, 255, 255, 0.55),
			0 6px 16px -6px rgba(14, 8, 70, 0.7);
	}
	.mark img {
		display: block;
		width: 24px;
		height: 24px;
	}
	/* The sphere name is the masthead of the screen. Heavy caps, tracked
	   a little, so it is the first thing read at the top of every page. */
	.name {
		font-family: var(--font-display);
		font-size: 23px;
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: 0.035em;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* Drawn rather than typed: a text caret came out a different size
	   and weight in every face. */
	.caret {
		flex: none;
		width: 0;
		height: 0;
		margin-top: 3px;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 7px solid var(--on-field);
		border-radius: 2px;
		opacity: 0.9;
	}
	.spacer {
		flex: 1;
	}
	/* Smoke glass: a control on the field, lit along its top edge. */
	.act {
		width: 42px;
		height: 42px;
		flex: none;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background:
			radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0) 60%),
			var(--smoke);
		border: 1px solid var(--smoke-line);
		box-shadow: var(--smoke-shadow);
		color: var(--on-field);
		text-decoration: none;
		backdrop-filter: blur(10px) saturate(1.3);
		-webkit-backdrop-filter: blur(10px) saturate(1.3);
	}
	.act:focus-visible,
	.sph:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 3px;
	}
	.back {
		margin-left: -3px;
		font-size: 30px;
		font-weight: 500;
		line-height: 1;
	}
	.back span {
		/* The glyph's own side bearing sits it right of centre. */
		transform: translate(-1.5px, -2.5px);
	}
	/* The account disc is the brighter of the two: a white ring rather
	   than a hairline, so it reads as a person and not another tool. */
	.avatar {
		border: 0;
		box-shadow:
			inset 0 0 0 2px rgba(255, 255, 255, 0.92),
			inset 0 -8px 14px -10px rgba(10, 6, 60, 0.5),
			0 8px 22px -10px rgba(20, 12, 80, 0.6);
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
			width: 44px;
			height: 44px;
		}
	}
</style>
