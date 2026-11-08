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
		gap: 8px;
		padding: 10px 2px 1px;
	}
	.bar {
		width: 3px;
		height: 13px;
		border-radius: 2px;
		background: var(--t-ink);
	}
	h2 {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--ink-2);
	}
	.count {
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: var(--ink-3);
	}
</style>
