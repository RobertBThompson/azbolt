<script>
	/** @type {{ title: string, meta?: string, t?: string }} */
	let { title, meta = '', t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<div class="ban" style="--t-ink:{c.ink}; --t-tint:{c.tint}">
	<div class="t">{title}</div>
	{#if meta}<div class="m">{meta}</div>{/if}
</div>

<style>
	/* Tinted panels always use full ink; grey is reserved for text on white.
	   A 10% tint plus mid grey lands near or under 4.5:1. */
	.ban {
		background: var(--t-tint);
		border: 1px solid color-mix(in srgb, var(--t-ink) 35%, transparent);
		border-radius: 11px;
		padding: 11px 13px;
	}
	.t {
		font-size: 14.5px;
		font-weight: 600;
		line-height: 1.3;
	}
	.m {
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--ink-2);
		margin-top: 4px;
	}
</style>
