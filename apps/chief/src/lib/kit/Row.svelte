<script>
	/**
	 * A 45pt list row. The whole row carries the action — never a tag
	 * inside it, which is what made the v2 confidence chip look tappable.
	 */
	/** @type {{ title: string, meta?: string, trailing?: string, t?: string, href?: string|null, dot?: boolean }} */
	let { title, meta = '', trailing = '', t = 'neutral', href = null, dot = true } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<svelte:element this={href ? 'a' : 'div'} {href} class="row" style="--t-ink:{c.ink}">
	{#if dot}<span class="dot" aria-hidden="true"></span>{/if}
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
</style>
