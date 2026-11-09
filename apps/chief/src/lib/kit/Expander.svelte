<script>
	/**
	 * A stage panel on Today: a raised card with a coloured left edge and
	 * a heading that opens.
	 *
	 * The left edge is the section's identity and is the one part that
	 * stays visible when the panel is closed, so a glance down the page
	 * reads as three stages whether they are open or not. The raise is
	 * what separates stages from the rows inside them — the page has two
	 * levels, and shadow is what says which is which.
	 *
	 * Built on <details>/<summary> rather than a button and a boolean.
	 * The native element already answers to Enter and Space, announces
	 * its own expanded state, and is findable by in-page search while
	 * closed — all of which a hand-rolled accordion has to reimplement
	 * and usually doesn't.
	 */
	/**
	 * @type {{
	 *   label: string,
	 *   icon?: string,
	 *   count?: number|null,
	 *   t?: string,
	 *   open?: boolean,
	 *   lede?: string,
	 *   lead?: boolean,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let {
		label,
		icon = '',
		count = null,
		t = 'neutral',
		open = false,
		lede = '',
		lead = false,
		children
	} = $props();
	import { tone } from './tone.js';
	import Icon from './Icon.svelte';
	const c = $derived(tone(t));
</script>

<details class="panel" class:lead {open} style="--t-ink:{c.ink}; --t-tint:{c.tint}">
	<summary>
		{#if icon}
			<span class="glyph"><Icon name={icon} size={17} /></span>
		{/if}
		<span class="titles">
			<span class="label">{label}</span>
			{#if lede}<span class="lede">{lede}</span>{/if}
		</span>
		{#if count !== null}<span class="count">{count}</span>{/if}
		<span class="chev" aria-hidden="true"></span>
	</summary>
	<div class="body">
		{@render children()}
	</div>
</details>

<style>
	/* Two levels, deliberately. Hierarchy comes from size and value, not
	   from shadow: paper and card sit about 4% apart in lightness, so no
	   amount of elevation was ever going to separate them. The leading
	   section carries its tone as a filled header with white on it; the
	   others shrink to a single compact line. */
	.panel {
		background: var(--card);
		border: 1px solid var(--line-3);
		/* The coloured edge is a real border rather than a pseudo-element,
		   so it cannot fall out of sync with the corner radius. */
		border-left: 4px solid var(--t-ink);
		border-radius: 4px 14px 14px 4px;
		overflow: hidden;
		box-shadow: 0 1px 2px rgba(30, 26, 24, 0.04);
	}
	summary {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 54px;
		padding: 7px 13px;
		cursor: pointer;
		list-style: none;
		background: var(--t-tint);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.glyph {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--card);
		color: var(--t-ink);
		flex: none;
	}
	.titles {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.label {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--t-ink);
	}
	.lede {
		font-size: 11.5px;
		line-height: 1.35;
		color: var(--ink-3);
	}
	.count {
		min-width: 21px;
		height: 21px;
		padding: 0 6px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: var(--t-ink);
		color: #ffffff;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 700;
		flex: none;
	}
	.chev {
		margin-left: auto;
		width: 8px;
		height: 8px;
		border-right: 1.7px solid var(--ink-3);
		border-bottom: 1.7px solid var(--ink-3);
		transform: rotate(45deg) translate(-2px, -2px);
		flex: none;
	}
	/* margin-left:auto on both would push the count away from the label. */
	.count + .chev {
		margin-left: 0;
	}
	.panel[open] .chev {
		transform: rotate(225deg) translate(-2px, -2px);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding: 11px;
	}

	/* ── Leading ─────────────────────────────────────────────────────── */
	.panel.lead {
		border-left-width: 6px;
		border-color: var(--t-ink);
		box-shadow:
			0 3px 6px rgba(30, 26, 24, 0.1),
			0 18px 36px rgba(30, 26, 24, 0.18);
	}
	.panel.lead summary {
		min-height: 68px;
		background: var(--t-ink);
	}
	.panel.lead .label {
		font-size: 15px;
		letter-spacing: 0.1em;
		color: #ffffff;
	}
	.panel.lead .lede {
		color: rgba(255, 255, 255, 0.85);
	}
	.panel.lead .glyph {
		width: 42px;
		height: 42px;
		background: rgba(255, 255, 255, 0.18);
		color: #ffffff;
	}
	.panel.lead .glyph :global(svg) {
		width: 21px;
		height: 21px;
	}
	.panel.lead .chev {
		border-color: rgba(255, 255, 255, 0.8);
	}
	/* Inverted so a count stays legible on the filled header. */
	.panel.lead .count {
		background: #ffffff;
		color: var(--t-ink);
	}

	/* ── Not leading: one compact line ───────────────────────────────── */
	.panel:not(.lead) {
		border-left-width: 3px;
	}
	.panel:not(.lead) summary {
		min-height: 44px;
		padding: 4px 13px;
	}
	.panel:not(.lead) .glyph {
		width: 26px;
		height: 26px;
	}
	.panel:not(.lead) .glyph :global(svg) {
		width: 14px;
		height: 14px;
	}
	.panel:not(.lead) .label {
		font-size: 10.5px;
	}
	.panel:not(.lead) .lede {
		display: none;
	}
</style>
