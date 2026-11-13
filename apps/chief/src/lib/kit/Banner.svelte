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
		background: linear-gradient(180deg, #ffffff 0%, var(--t-tint) 78%);
		border: 1px solid color-mix(in srgb, var(--t-ink) 30%, #ffffff);
		border-radius: var(--r-sm);
		padding: 13px 16px;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset var(--edge) 0 0 var(--t-ink),
			0 1px 2px rgba(30, 20, 90, 0.16),
			0 12px 26px -10px rgba(30, 20, 90, 0.42);
	}
	.t {
		font-size: 16.5px;
		font-weight: 700;
		line-height: 1.3;
	}
	.m {
		font-size: 14.5px;
		line-height: 1.4;
		color: var(--ink-2);
		margin-top: 4px;
	}
</style>
