<script>
	/** Orientation screens: one centred idea, large type, at most two controls. */
	/** @type {{ title: string, meta?: string, t?: string }} */
	let { title, meta = '', t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<div class="hero">
	<span class="mark" style="--t-ink:{c.ink}; --t-tint:{c.tint}"></span>
	<span class="t">{title}</span>
	{#if meta}<span class="m">{meta}</span>{/if}
</div>

<style>
	/* A whole-screen message, set straight on the field. */
	.hero {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 14px;
		padding: 24px 20px;
	}
	.mark {
		width: 64px;
		height: 64px;
		border-radius: var(--r-md);
		background: linear-gradient(160deg, #ffffff 0%, var(--t-tint) 100%);
		border: 1px solid var(--glass-line);
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -10px 14px -10px color-mix(in srgb, var(--t-ink) 55%, transparent),
			0 0 26px rgba(204, 188, 255, 0.6),
			0 14px 28px -10px rgba(30, 20, 100, 0.6);
	}
	.t {
		font-family: var(--font-display);
		font-size: 32px;
		line-height: 1.12;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
		text-wrap: balance;
	}
	.m {
		font-size: 16.5px;
		line-height: 1.5;
		color: var(--on-field-2);
		text-wrap: pretty;
	}
</style>
