<script>
	/** Two mutually exclusive choices, both visible. */
	/** @type {{ a: string, b: string, active?: number, t?: string, onpick?: ((i: number) => void)|null }} */
	let { a, b, active = $bindable(0), t = 'neutral', onpick = null } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	/** @param {number} i */
	const pick = (i) => {
		active = i;
		onpick?.(i);
	};
</script>

<div class="seg" role="group">
	<button class:on={active === 0} style="--t-ink:{c.ink}; --t-tint:{c.tint}" onclick={() => pick(0)}
		>{a}</button
	>
	<button class:on={active === 1} style="--t-ink:{c.ink}; --t-tint:{c.tint}" onclick={() => pick(1)}
		>{b}</button
	>
</div>

<style>
	.seg {
		display: flex;
		gap: 9px;
	}
	button {
		flex: 1;
		height: 66px;
		border-radius: var(--r-sm);
		border: 1px solid var(--glass-line);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		color: var(--ink-2);
		font-family: var(--font-display);
		font-size: 16.5px;
		font-weight: 600;
		cursor: pointer;
	}
	button.on {
		border-color: color-mix(in srgb, var(--t-ink) 55%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--t-tint) 100%);
		color: var(--ink);
		font-weight: 700;
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 0 0 1.5px color-mix(in srgb, var(--t-ink) 55%, transparent),
			0 0 0 3px color-mix(in srgb, var(--t-ink) 16%, transparent),
			0 12px 22px -12px color-mix(in srgb, var(--t-ink) 70%, transparent);
	}
	button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
</style>
