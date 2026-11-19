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
	import { readAmount } from '../amount.js';
	const c = $derived(tone(t));

	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];
	/** @param {string} k */
	const press = (k) => {
		/* A second point is a slip, not an amount: swallow it rather than
		   building a string that cannot be read back. */
		if (k === '←') value = value.slice(0, -1);
		else if (k === '.' && value.includes('.')) return;
		else value += k;
	};
	const typed = $derived(value.trim());
	const read = $derived(readAmount(typed));
	const shown = $derived(read === null ? (typed === '' ? '$0.00' : typed) : `$${read.toFixed(2)}`);
	const fault = $derived(typed !== '' && read === null ? 'That is not an amount.' : '');
</script>

<div class="amt">
	<div class="display" style="--t-ink:{c.ink}; --t-tint:{c.tint}">
		<div class="v" class:bad={!!fault} aria-live="polite">{shown}</div>
		{#if fault}<div class="m bad-m">{fault}</div>{:else if meta}<div class="m">{meta}</div>{/if}
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
		border: 1px solid color-mix(in srgb, var(--t-ink) 30%, #ffffff);
		border-radius: var(--r-md);
		background: linear-gradient(180deg, #ffffff 0%, var(--t-tint) 85%);
		box-shadow: var(--glass-shadow);
		padding: 16px 18px;
	}
	/* Figures line up without a mono face: the same family, tabular. */
	.v {
		font-family: var(--font-display);
		font-size: 40px;
		font-weight: 800;
		font-variant-numeric: tabular-nums lining-nums;
		letter-spacing: -0.02em;
		line-height: 1;
	}
	.v.bad {
		font-size: 28px;
		color: var(--tone-rust, #8c3b2a);
	}
	.bad-m {
		color: var(--tone-rust, #8c3b2a);
		font-weight: 600;
	}
	.m {
		font-size: 14.5px;
		color: var(--ink-2);
		margin-top: 7px;
		line-height: 1.35;
	}
	.sys {
		display: block;
		margin-top: 11px;
	}
	.sys .eyebrow {
		display: block;
		margin-bottom: 6px;
		color: var(--label-ink, var(--on-field-2));
	}
	.sys input {
		width: 100%;
		min-height: var(--tap-min);
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		padding: 9px 15px;
		font-family: var(--font-display);
		font-size: 17px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.pad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 11px;
	}
	.pad button {
		height: 56px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
	}
</style>
