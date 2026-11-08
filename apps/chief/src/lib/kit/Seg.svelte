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
		gap: 7px;
	}
	button {
		flex: 1;
		height: 62px;
		border-radius: 11px;
		border: 1px solid var(--line-3);
		background: var(--card);
		color: var(--ink-2);
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
	}
	button.on {
		border-color: var(--t-ink);
		background: var(--t-tint);
		color: var(--ink);
	}
</style>
