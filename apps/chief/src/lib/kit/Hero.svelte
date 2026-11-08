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
	.hero {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 13px;
		padding: 24px 20px;
	}
	.mark {
		width: 58px;
		height: 58px;
		border-radius: 19px;
		background: var(--t-tint);
		border: 1px solid var(--t-ink);
	}
	.t {
		font-family: var(--font-serif);
		font-size: 29px;
		line-height: 1.12;
		font-weight: 400;
	}
	.m {
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--ink-3);
	}
</style>
