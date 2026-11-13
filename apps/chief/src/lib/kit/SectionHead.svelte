<script>
	/**
	 * A stage heading on Today. Mono caps because these three are the
	 * app's own vocabulary — Throw it, Sphere it, Task it — not ordinary
	 * section labels, and they should read the same way the context name
	 * does in the bar above.
	 */
	/** @type {{ label: string, count?: number|null, t?: string }} */
	let { label, count = null, t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<div class="head" style="--t-ink:{c.ink}">
	<span class="bar"></span>
	<h2>{label}</h2>
	{#if count !== null}<span class="count">{count}</span>{/if}
</div>

<style>
	.head {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 12px 2px 2px;
	}
	.bar {
		width: 4px;
		height: 15px;
		border-radius: 3px;
		/* These headings sit on the field, not on paper. The tone colours
		   were mixed for a light ground and go muddy on violet, so the
		   bar is lifted toward white while keeping its hue. */
		background: color-mix(in srgb, var(--t-ink) 40%, #ffffff);
		box-shadow: 0 0 10px color-mix(in srgb, var(--t-ink) 40%, #ffffff);
	}
	h2 {
		margin: 0;
		font-family: var(--font-label);
		font-size: 13.5px;
		font-weight: 700;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
	}
	.count {
		font-family: var(--font-label);
		font-size: 13.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--on-field-2);
	}
</style>
