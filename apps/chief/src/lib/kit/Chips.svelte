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
		gap: 7px;
	}
	.chip {
		height: 34px;
		border-radius: 999px;
		padding: 0 15px;
		display: flex;
		align-items: center;
		font-size: 14.5px;
		font-weight: 600;
		background: var(--glass);
		border: 1px solid var(--glass-line);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 4px 10px -5px rgba(30, 20, 90, 0.45);
		color: var(--ink-3);
	}
	.chip.on {
		background: linear-gradient(180deg, #ffffff 0%, var(--t-tint) 100%);
		border-color: color-mix(in srgb, var(--t-ink) 55%, #ffffff);
		color: var(--t-ink);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--t-ink) 16%, transparent),
			0 5px 12px -5px color-mix(in srgb, var(--t-ink) 60%, transparent);
	}
</style>
