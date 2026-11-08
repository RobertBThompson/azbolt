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
	.row {
		min-height: 48px;
		border: 1px solid var(--line-3);
		border-radius: 11px;
		background: var(--card);
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 8px 13px;
		color: inherit;
		text-decoration: none;
	}
	.dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--t-ink);
		flex: none;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.25;
	}
	.m {
		display: block;
		font-size: 12px;
		color: var(--ink-3);
		line-height: 1.3;
		margin-top: 2px;
	}
	.x {
		font-size: 12px;
		font-weight: 700;
		color: var(--tone-graphite);
		flex: none;
	}
</style>
