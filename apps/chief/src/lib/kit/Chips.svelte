<script>
	/** 30pt — under the 44pt minimum, so chips are labels, not controls. */
	/** @type {{ items?: string[], active?: number, t?: string }} */
	let { items = [], active = 0, t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<div class="chips">
	{#each items as v, i (v)}
		<span class="chip" class:on={i === active} style="--t-ink:{c.ink}; --t-tint:{c.tint}">{v}</span>
	{/each}
</div>

<style>
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		height: 30px;
		border-radius: 15px;
		padding: 0 13px;
		display: flex;
		align-items: center;
		font-size: 12px;
		font-weight: 600;
		background: var(--card);
		border: 1px solid var(--line-2);
		color: var(--ink-3);
	}
	.chip.on {
		background: var(--t-tint);
		border-color: var(--t-ink);
		color: var(--t-ink);
	}
</style>
