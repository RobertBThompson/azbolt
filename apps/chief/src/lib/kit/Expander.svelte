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
		<!-- Light moving across the pane. Decorative, so it is drawn rather
		     than loaded, and it scales with the card instead of tiling. -->
		<svg class="swash" viewBox="0 0 360 96" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<linearGradient id="swash-band" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0" />
					<stop offset="0.45" stop-color="#ffffff" stop-opacity="0.13" />
					<stop offset="1" stop-color="#ffd7e6" stop-opacity="0.2" />
				</linearGradient>
				<linearGradient id="swash-line" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0" />
					<stop offset="0.5" stop-color="#ffffff" stop-opacity="0.5" />
					<stop offset="1" stop-color="#ffc6dc" stop-opacity="0.15" />
				</linearGradient>
			</defs>
			<path
				fill="url(#swash-band)"
				d="M0 78 C 70 54, 130 92, 205 70 S 320 40, 360 62 V96 C 300 76, 250 100, 190 88 S 70 76, 0 96 Z"
			/>
			<path
				fill="none"
				stroke="url(#swash-line)"
				stroke-width="1"
				vector-effect="non-scaling-stroke"
				d="M0 78 C 70 54, 130 92, 205 70 S 320 40, 360 62"
			/>
			<path
				fill="none"
				stroke="url(#swash-line)"
				stroke-width="1"
				vector-effect="non-scaling-stroke"
				opacity="0.6"
				d="M0 90 C 90 70, 150 100, 230 82 S 330 60, 360 74"
			/>
		</svg>
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
	<details
		class="panel edged"
		{open}
		style="--t-ink:{c.ink}; --t-tint:{c.tint}; --edge-ink:{c.ink}"
	>
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
		background: var(--glass);
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		overflow: hidden;
		box-shadow: var(--glass-shadow);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 58px;
		padding: 8px 16px 8px 18px;
	}
	summary {
		cursor: pointer;
		list-style: none;
	}
	summary:focus-visible {
		outline: 2px solid var(--t-ink);
		outline-offset: -4px;
		border-radius: var(--r-md);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	/* A small lit orb, not a flat disc. */
	.glyph {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: radial-gradient(circle at 34% 24%, #ffffff 0%, #ffffff 46%, #e9e4fb 100%);
		box-shadow:
			inset 0 1px 0 #ffffff,
			inset 0 -5px 8px -5px rgba(86, 66, 170, 0.4),
			0 3px 8px -2px color-mix(in srgb, var(--t-ink) 45%, transparent);
		color: var(--t-ink);
		flex: none;
	}
	.titles {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}
	/* The three stage names are the app's own vocabulary, so they are
	   set the way nothing else is: heavy caps, tracked wide. */
	.label {
		margin: 0;
		font-family: var(--font-label);
		font-size: 15px;
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: var(--track-stage);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--t-ink) 78%, var(--ink));
	}
	.lede {
		font-size: 13.5px;
		line-height: 1.35;
		color: var(--ink-3);
		text-wrap: balance;
	}
	/* A glossy bead: highlight top-left, its own colour in the shadow. */
	.count {
		min-width: 28px;
		height: 28px;
		padding: 0 8px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: radial-gradient(
			circle at 34% 24%,
			color-mix(in srgb, var(--t-ink) 48%, #ffffff) 0%,
			var(--t-ink) 54%,
			color-mix(in srgb, var(--t-ink) 76%, #000000) 100%
		);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 5px 12px -4px color-mix(in srgb, var(--t-ink) 80%, transparent);
		color: #ffffff;
		font-family: var(--font-label);
		font-size: 15px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		flex: none;
	}
	.chev {
		margin-left: auto;
		width: 10px;
		height: 10px;
		border-right: 2.2px solid var(--ink-2);
		border-bottom: 2.2px solid var(--ink-2);
		border-radius: 1px;
		transform: rotate(45deg) translate(-2px, -2px);
		flex: none;
	}
	/* margin-left:auto on both would push the count away from the label. */
	.count + .chev {
		margin-left: 4px;
	}
	.panel[open] .chev {
		transform: rotate(225deg) translate(-2px, -2px);
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px;
		/* Inside the panel the ground is glass, so anything that defaults
		   to white-on-field goes back to ink. */
		--label-ink: var(--ink-3);
		/* Rows in here are panes on a pane: a hairline and a short shadow
		   are enough, or the panel turns into a stack of floating cards. */
		--pane-line: var(--line-3);
		--pane-shadow:
			inset 0 1px 0 #ffffff, 0 1px 2px rgba(30, 20, 90, 0.1),
			0 8px 16px -10px rgba(30, 20, 90, 0.35);
	}

	/* ── Secondary ───────────────────────────────────────────────────── */
	.panel:not(.lead) summary {
		/* The section's own tone rising from its edge, clear glass in the
		   middle, and the field's violet gathering at the far side — so a
		   closed row is recognisable without reading it. */
		background:
			linear-gradient(
				96deg,
				color-mix(in srgb, var(--t-ink) 24%, #ffffff) 0%,
				color-mix(in srgb, var(--t-ink) 7%, #ffffff) 30%,
				rgba(255, 255, 255, 0) 58%
			),
			linear-gradient(96deg, rgba(255, 255, 255, 0) 52%, rgba(205, 194, 250, 0.55) 100%);
	}
	.panel:not(.lead) .lede {
		display: none;
	}
	.panel:not(.lead)[open] summary {
		box-shadow: 0 1px 0 var(--line-3);
	}

	/* ── Leading ─────────────────────────────────────────────────────── */
	/* The whole panel is the colour, not just a header strip on a white
	   card: the composer is a light object held inside it. */
	.panel.lead {
		position: relative;
		border-radius: var(--r-lg);
		border-color: color-mix(in srgb, var(--t-ink) 30%, #ffd9e6);
		background:
			radial-gradient(110% 80% at 100% 0%, rgba(255, 158, 150, 0.42), transparent 62%),
			linear-gradient(
				150deg,
				color-mix(in srgb, var(--t-ink) 80%, #ff9a8a) 0%,
				var(--t-ink) 30%,
				color-mix(in srgb, var(--t-ink) 58%, #4a1f8a) 68%,
				color-mix(in srgb, var(--t-ink) 30%, #3b1f92) 100%
			);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			inset 0 -24px 34px -24px rgba(26, 6, 60, 0.6),
			0 0 0 1px color-mix(in srgb, var(--t-ink) 40%, transparent),
			0 0 30px color-mix(in srgb, var(--t-ink) 45%, #ff7ad0 12%),
			0 24px 46px -18px rgba(30, 8, 70, 0.75);
	}
	.swash {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 96px;
		pointer-events: none;
	}
	.panel.lead .head {
		position: relative;
		min-height: 78px;
		padding: 16px 16px 12px;
		gap: 14px;
	}
	.panel.lead .label {
		font-size: 19px;
		color: #ffffff;
		text-shadow: 0 1px 10px rgba(40, 6, 40, 0.45);
	}
	.panel.lead .lede {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.9);
	}
	.panel.lead .glyph {
		width: 50px;
		height: 50px;
		background:
			radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 58%),
			rgba(255, 255, 255, 0.14);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.42),
			inset 0 -8px 12px -8px rgba(40, 6, 50, 0.55),
			0 8px 18px -8px rgba(30, 6, 50, 0.7);
		color: #ffffff;
	}
	.panel.lead .glyph :global(svg) {
		width: 25px;
		height: 25px;
	}
	.panel.lead .body {
		position: relative;
		padding: 2px 12px 12px;
	}

	@media (min-width: 48rem) {
		.panel.lead .head {
			min-height: 84px;
			padding: 18px 18px 14px;
		}
		.panel:not(.lead) summary {
			min-height: 66px;
		}
		.panel:not(.lead) .lede {
			display: block;
		}
		.body {
			padding: 14px;
		}
		.panel.lead .body {
			padding: 2px 14px 14px;
		}
	}
</style>
