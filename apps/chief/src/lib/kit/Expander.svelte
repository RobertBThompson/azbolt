<script>
	/**
	 * A stage panel on Today: a tinted block with a heading that opens.
	 *
	 * Built on <details>/<summary> rather than a button and a boolean.
	 * The native element already answers to Enter and Space, announces
	 * its own expanded state, and is findable by in-page search even
	 * while closed — all of which a hand-rolled accordion has to
	 * reimplement and usually doesn't.
	 *
	 * The tint is the section's identity. Three stages, three light
	 * separations, each carrying the tone its work belongs to: capture is
	 * neutral, placing is arranging, tasking is committing.
	 */
	/**
	 * @type {{
	 *   label: string,
	 *   count?: number|null,
	 *   t?: string,
	 *   open?: boolean,
	 *   lede?: string,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { label, count = null, t = 'neutral', open = false, lede = '', children } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<details class="panel" {open} style="--t-ink:{c.ink}; --t-tint:{c.tint}">
	<summary>
		<span class="bar"></span>
		<span class="label">{label}</span>
		{#if count !== null}<span class="count">{count}</span>{/if}
		<span class="chev" aria-hidden="true"></span>
	</summary>
	<div class="body">
		{#if lede}<p class="lede">{lede}</p>{/if}
		{@render children()}
	</div>
</details>

<style>
	.panel {
		background: var(--t-tint);
		border: 1px solid var(--line-3);
		border-radius: 13px;
		overflow: hidden;
	}
	summary {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: var(--tap-min);
		padding: 0 13px;
		cursor: pointer;
		list-style: none;
	}
	/* Safari still draws its own triangle without this. */
	summary::-webkit-details-marker {
		display: none;
	}
	.bar {
		width: 3px;
		height: 13px;
		border-radius: 2px;
		background: var(--t-ink);
		flex: none;
	}
	.label {
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
	.chev {
		margin-left: auto;
		width: 7px;
		height: 7px;
		border-right: 1.5px solid var(--ink-3);
		border-bottom: 1.5px solid var(--ink-3);
		transform: rotate(45deg) translate(-2px, -2px);
	}
	.panel[open] .chev {
		transform: rotate(225deg) translate(-2px, -2px);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding: 2px 11px 11px;
	}
	.lede {
		margin: 0 2px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--ink-3);
	}
</style>
