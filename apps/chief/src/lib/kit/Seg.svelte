<script>
	/**
	 * Mutually exclusive choices, all visible: two as `a` and `b`, or a
	 * few as `items` (an asset's Now, Soon and Later). A setting, not a
	 * filter: it changes the record, not what the screen shows.
	 *
	 * `label` names it above the buttons, the way a field is named, so
	 * three bare words are not left to explain themselves. `small` fits
	 * it inside a row of a list. `disabled` shows it greyed, with `note`
	 * saying why, rather than hiding it: a control that is not there
	 * cannot be learned.
	 */
	/** @type {{ a?: string, b?: string, items?: string[], active?: number, t?: string, onpick?: ((i: number) => void)|null, disabled?: boolean, label?: string, small?: boolean, note?: string }} */
	let {
		a = '',
		b = '',
		items = [],
		active = $bindable(0),
		t = 'neutral',
		onpick = null,
		disabled = false,
		label = '',
		small = false,
		note = ''
	} = $props();
	const choices = $derived(items.length ? items : [a, b]);
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	/** @param {number} i */
	const pick = (i) => {
		active = i;
		onpick?.(i);
	};
</script>

{#if label}<span class="eyebrow label">{label}</span>{/if}
<div class="seg" class:small role="group" aria-label={label || undefined}>
	{#each choices as label, i (i)}
		<button
			type="button"
			class:on={active === i}
			aria-pressed={active === i}
			style="--t-ink:{c.ink}; --t-tint:{c.tint}"
			{disabled}
			onclick={() => pick(i)}>{label}</button
		>
	{/each}
</div>
{#if note}<span class="note">{note}</span>{/if}

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
	/* The one chosen is filled solid in its colour, white on it, so it is
	   told at a glance from the two that are not (Robert, 19 Nov: a pale
	   cream on white was "barely highlighted"). */
	button.on {
		border-color: transparent;
		background:
			var(--gloss),
			linear-gradient(135deg, color-mix(in srgb, var(--t-ink) 74%, #ffffff) 0%, var(--t-ink) 100%);
		color: #ffffff;
		font-weight: 700;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 12px 22px -12px color-mix(in srgb, var(--t-ink) 85%, transparent);
	}
	button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	button:disabled {
		cursor: default;
		opacity: 0.55;
	}
	/* Named the way a form field is named, so it reads as one. */
	.label {
		display: block;
		margin: 2px 0 -5px;
		color: var(--label-ink, var(--on-field-2));
	}
	.note {
		display: block;
		margin-top: -3px;
		font-size: 14.5px;
		color: var(--on-field-2);
	}
	.small {
		gap: 6px;
	}
	.small button {
		height: 38px;
		border-radius: 999px;
		font-size: 14.5px;
		box-shadow: none;
	}
	.small button.on {
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}
</style>
