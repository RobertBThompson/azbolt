<script>
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

{#snippet glyph()}
	{#if icon}
		<span class="glyph"><Icon name={icon} size={17} /></span>
	{/if}
{/snippet}

{#snippet content()}
	<div class="body">
		{@render children()}
	</div>
{/snippet}

{#if lead}
	<section class="panel lead" style="--t-ink:{c.ink}">
		<header class="head">
			{@render glyph()}
			<div class="titles">
				<h2 class="label">{label}</h2>
				{#if lede}<span class="lede">{lede}</span>{/if}
			</div>
		</header>
		{@render content()}
	</section>
{:else}
	<details class="panel" {open} style="--t-ink:{c.ink}; --t-tint:{c.tint}">
		<summary class="head">
			{@render glyph()}
			<span class="titles">
				<span class="label">{label}</span>
				{#if lede}<span class="lede">{lede}</span>{/if}
			</span>
			{#if count !== null}<span class="count">{count}</span>{/if}
			<span class="chev" aria-hidden="true"></span>
		</summary>
		{@render content()}
	</details>
{/if}

<style>
	.panel {
		/* Glass, not paper: the field reads through the edges, which is
		   what keeps the screen one surface instead of a stack of cards
		   dropped on a background. */
		background: var(--glass);
		border: 1px solid var(--glass-line);
		backdrop-filter: blur(14px) saturate(1.15);
		-webkit-backdrop-filter: blur(14px) saturate(1.15);
		/* The coloured edge is a real border rather than a pseudo-element,
		   so it cannot fall out of sync with the corner radius. */
		border-left: 4px solid var(--t-ink);
		border-radius: 4px 14px 14px 4px;
		overflow: hidden;
		box-shadow: var(--glass-shadow);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 54px;
		padding: 7px 13px;
		background: var(--t-tint);
	}
	summary {
		cursor: pointer;
		list-style: none;
	}
	summary:focus-visible {
		outline: 2px solid var(--t-ink);
		outline-offset: -3px;
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
		/* Inside the panel the ground is glass, so anything that defaults
		   to white-on-field goes back to ink. */
		--label-ink: var(--ink-3);
	}

	/* ── Leading ─────────────────────────────────────────────────────── */
	.panel.lead {
		border-left-width: 6px;
		border-color: var(--t-ink);
		box-shadow:
			0 3px 6px rgba(30, 26, 24, 0.1),
			0 18px 36px rgba(30, 26, 24, 0.18);
	}
	.panel.lead .head {
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
	/* Keep the secondary panels compact on a phone. */
	.panel:not(.lead) {
		border-left-width: 3px;
	}
	.panel:not(.lead) summary {
		min-height: 44px;
		padding: 4px 13px;
		/* A breath of the section's own tone across the pane, so a closed
		   row is recognisable without reading it. */
		background: linear-gradient(100deg, var(--t-tint) 0%, rgba(255, 255, 255, 0) 72%);
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

	@media (min-width: 48rem) {
		.panel.lead {
			border-radius: 14px;
			box-shadow: 0 8px 24px rgba(30, 26, 24, 0.1);
		}
		.panel.lead .head {
			min-height: 76px;
			padding: 12px 16px;
			background: linear-gradient(115deg, var(--app-accent-text), var(--t-ink));
		}
		.panel.lead .lede {
			font-size: 13px;
		}
		.panel:not(.lead) summary {
			min-height: 65px;
			padding: 8px 13px;
		}
		.panel:not(.lead) .glyph {
			width: 34px;
			height: 34px;
		}
		.panel:not(.lead) .glyph :global(svg) {
			width: 17px;
			height: 17px;
		}
		.panel:not(.lead) .label {
			font-size: 12px;
		}
		.panel:not(.lead) .lede {
			display: block;
			font-size: 12px;
		}
		.body {
			padding: 14px;
		}
	}
</style>
