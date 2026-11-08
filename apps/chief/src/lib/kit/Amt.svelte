<script>
	/**
	 * Amount-first entry. The user types the one thing AI has no business
	 * guessing; everything else is proposed and correctable.
	 *
	 * A custom keypad has no native keyboard semantics, so voice control and
	 * switch control users lose dictation — the system keyboard must stay
	 * reachable. That is what the text input below the display is for; it is
	 * not decoration.
	 */
	/** @type {{ value?: string, meta?: string, t?: string }} */
	let { value = $bindable(''), meta = '', t = 'warm' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));

	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];
	/** @param {string} k */
	const press = (k) => {
		if (k === '←') value = value.slice(0, -1);
		else value += k;
	};
	const shown = $derived(value ? `$${value}` : '$0.00');
</script>

<div class="amt">
	<div class="display" style="--t-ink:{c.ink}; --t-tint:{c.tint}">
		<div class="v" aria-live="polite">{shown}</div>
		{#if meta}<div class="m">{meta}</div>{/if}
	</div>

	<label class="sys">
		<span class="eyebrow">Or type it</span>
		<input
			type="text"
			inputmode="decimal"
			bind:value
			placeholder="0.00"
			aria-label="Amount, using the system keyboard"
		/>
	</label>

	<div class="pad">
		{#each keys as k (k)}
			<button onclick={() => press(k)} aria-label={k === '←' ? 'Delete' : k}>{k}</button>
		{/each}
	</div>
</div>

<style>
	.display {
		border: 1px solid color-mix(in srgb, var(--t-ink) 35%, transparent);
		border-radius: 11px;
		background: var(--t-tint);
		padding: 14px 15px;
	}
	.v {
		font-family: var(--font-mono);
		font-size: 34px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
	}
	.m {
		font-size: 12px;
		color: var(--ink-2);
		margin-top: 6px;
		line-height: 1.35;
	}
	.sys {
		display: block;
		margin-top: 9px;
	}
	.sys .eyebrow {
		display: block;
		margin-bottom: 5px;
	}
	.sys input {
		width: 100%;
		min-height: var(--tap-min);
		border: 1px solid var(--line-2);
		border-radius: 10px;
		background: var(--sunk);
		padding: 9px 13px;
		font-family: var(--font-mono);
		font-size: 14px;
	}
	.pad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		margin-top: 9px;
	}
	.pad button {
		height: 52px;
		border: 1px solid var(--line-3);
		border-radius: 10px;
		background: var(--sunk);
		font-family: inherit;
		font-size: 18px;
		font-weight: 600;
	}
</style>
