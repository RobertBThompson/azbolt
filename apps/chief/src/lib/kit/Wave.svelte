<script>
	/** Live transcript while speaking. Every word is correctable before
	    analysis, so a mis-hear costs a tap rather than the whole jot. */
	/** @type {{ text?: string, t?: string }} */
	let { text = '', t = 'ai' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	const bars = Array.from({ length: 22 }, (_, i) => 9 + ((i * 17) % 32));
</script>

<div class="wave" style="--t-ink:{c.ink}; --t-tint:{c.tint}">
	<div class="bars" aria-hidden="true">
		{#each bars as h, i (i)}
			<span style="height:{h}px"></span>
		{/each}
	</div>
	{#if text}<p class="t">{text}</p>{/if}
</div>

<style>
	.wave {
		border: 1px solid color-mix(in srgb, var(--t-ink) 35%, transparent);
		border-radius: 11px;
		background: var(--t-tint);
		padding: 13px;
	}
	.bars {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 44px;
	}
	.bars span {
		flex: 1;
		border-radius: 2px;
		background: var(--t-ink);
	}
	.t {
		margin: 11px 0 0;
		font-size: 13px;
		line-height: 1.45;
	}
</style>
