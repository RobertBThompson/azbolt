<script>
	/**
	 * The headline: the one figure a screen is for, said once, at the top.
	 *
	 * Drawn on the same night gradient as the Stats tiles, so it reads as
	 * a figure and not a record, but full width and larger, so it is the
	 * first thing the eye lands on. Nothing else on a screen looks like
	 * it, and it is given room below before the screen goes on.
	 *
	 * When it opens something, every asset behind an asset total, it says
	 * so in words across its foot. A bare chevron would make it one more
	 * row, and the point is that it is not.
	 *
	 * Whatever screen it heads, the figure adds up exactly what that
	 * screen shows under it. A total that disagrees with its own rows is
	 * read first and believed first.
	 *
	 * @type {{
	 *   figure: string,
	 *   label: string,
	 *   meta?: string,
	 *   href?: string|null,
	 *   more?: string
	 * }}
	 */
	let { figure, label, meta = '', href = null, more = '' } = $props();
</script>

<svelte:element this={href ? 'a' : 'div'} class="lead" class:link={!!href} {href}>
	<span class="figure">{figure}</span>
	<span class="label">{label}</span>
	{#if meta}<span class="meta">{meta}</span>{/if}
	{#if href && more}<span class="more">{more}<span class="arrow" aria-hidden="true">›</span></span
		>{/if}
</svelte:element>

<style>
	.lead {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3px;
		padding: 18px 20px 17px;
		margin-bottom: 8px;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: var(--r-md);
		background: var(--gloss), var(--grad-night);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			0 16px 30px -14px rgba(16, 14, 40, 0.7);
		color: #ffffff;
		text-decoration: none;
	}
	.figure {
		font-family: var(--font-display);
		font-size: 38px;
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.01em;
		color: var(--pop);
		font-variant-numeric: tabular-nums lining-nums;
	}
	.label {
		font-size: 16.5px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.96);
	}
	.meta {
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.82);
	}
	.more {
		align-self: stretch;
		margin-top: 12px;
		padding-top: 11px;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		font-family: var(--font-display);
		font-size: 15.5px;
		font-weight: 700;
		color: #ffffff;
	}
	.arrow {
		margin-left: 7px;
	}
	.link:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: no-preference) {
		.link {
			transition:
				transform 140ms ease,
				box-shadow 140ms ease;
		}
		.link:hover {
			transform: translateY(-1px);
		}
	}
</style>
