<script>
	/**
	 * A 45pt list row. The whole row carries the action — never a tag
	 * inside it, which is what made the v2 confidence chip look tappable.
	 */
	/* `icon` swaps the bead for a colourful icon tile — decoration only,
	   for hub rows that open a whole section. `hue` picks the tile's fill:
	   wine, blue, night, pop, green, clay or taupe. */
	/** @type {{ title: string, meta?: string, trailing?: string, t?: string, href?: string|null, dot?: boolean, icon?: string, hue?: string }} */
	let { title, meta = '', trailing = '', t = 'neutral', href = null, dot = true, icon = '', hue = 'wine' } = $props();
	import Icon from './Icon.svelte';
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<svelte:element this={href ? 'a' : 'div'} {href} class="row" class:link={!!href} style="--t-ink:{c.ink}">
	{#if icon}
		<span class="tile {hue}" aria-hidden="true"><Icon name={icon} size={20} /></span>
	{:else if dot}<span class="dot" aria-hidden="true"></span>{/if}
	<span class="body">
		<span class="t">{title}</span>
		{#if meta}<span class="m">{meta}</span>{/if}
	</span>
	{#if trailing}<span class="x">{trailing}</span>{/if}
</svelte:element>

<style>
	/* A row is a pane like any other. It reads --pane-line and
	   --pane-shadow so a container that is itself glass can ask its rows
	   to sit flatter than they do on the open field. */
	.row {
		min-height: 58px;
		border: 1px solid var(--pane-line, var(--glass-line));
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--pane-shadow, var(--glass-shadow));
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 15px;
		color: inherit;
		text-decoration: none;
	}
	/* A bead, lit like the count orbs, rather than a flat dot. */
	.dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 34% 26%,
			color-mix(in srgb, var(--t-ink) 45%, #ffffff) 0%,
			var(--t-ink) 60%
		);
		box-shadow: 0 2px 5px -1px color-mix(in srgb, var(--t-ink) 70%, transparent);
		flex: none;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-size: 16.5px;
		font-weight: 600;
		line-height: 1.25;
	}
	.m {
		display: block;
		font-size: 14px;
		color: var(--ink-3);
		line-height: 1.3;
		margin-top: 2px;
	}
	.x {
		font-size: 14.5px;
		font-weight: 700;
		color: var(--ink-3);
		flex: none;
	}
	.link:hover {
		box-shadow: var(--glass-shadow-lift);
		transform: translateY(-1px);
	}
	@media (prefers-reduced-motion: no-preference) {
		.link {
			transition:
				transform 140ms ease,
				box-shadow 140ms ease;
		}
	}
	.tile {
		width: 42px;
		height: 42px;
		flex: none;
		border-radius: var(--r-xs);
		display: grid;
		place-items: center;
		color: #ffffff;
		background: var(--gloss), var(--grad-wine);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 14px -4px rgba(154, 43, 59, 0.45);
	}
	.tile.blue {
		background: var(--gloss), var(--grad-blue);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 14px -4px rgba(45, 98, 163, 0.45);
	}
	.tile.night {
		background: var(--gloss), var(--grad-night);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 14px -4px rgba(30, 42, 66, 0.45);
	}
	.tile.pop {
		background: var(--gloss), var(--grad-pop);
		color: var(--pop-ink);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), var(--glow-pop);
	}
	.tile.green {
		background: var(--gloss), var(--grad-green);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 14px -4px rgba(39, 111, 68, 0.45);
	}
	.tile.clay {
		background: var(--gloss), var(--grad-clay);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 14px -4px rgba(138, 76, 20, 0.45);
	}
	.tile.taupe {
		background: var(--gloss), var(--grad-taupe);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 14px -4px rgba(111, 98, 91, 0.45);
	}
</style>
