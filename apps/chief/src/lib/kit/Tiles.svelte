<script>
	/**
	 * Places to look, as a shelf of tiles.
	 *
	 * A category is somewhere to go and look, not a record, so it is not
	 * drawn as a row. Rows are the records themselves, and when "All
	 * assets", a notice and eight categories were all rows, nothing said
	 * which was which. Tiles sit two to a line on a phone, name on top,
	 * what they add up to under it, so a set of categories reads as one
	 * set and takes half the height the rows did.
	 *
	 * A quiet tile is one with nothing in it yet: there, but set back.
	 *
	 * @type {{
	 *   items: {
	 *     key: string,
	 *     href: string,
	 *     title: string,
	 *     line: string,
	 *     value?: string,
	 *     quiet?: boolean
	 *   }[],
	 *   label: string
	 * }}
	 */
	let { items, label } = $props();
</script>

<ul class="tiles" aria-label={label}>
	{#each items as it (it.key)}
		<li>
			<a class="tile" class:quiet={it.quiet} href={it.href}>
				<span class="t">{it.title}</span>
				{#if it.value}<span class="v">{it.value}</span>{/if}
				<span class="m">{it.line}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.tiles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
		gap: 10px;
	}
	li {
		display: flex;
	}
	.tile {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 2px;
		min-height: 98px;
		padding: 13px 14px 12px;
		border: 1px solid var(--glass-line);
		border-top: 3px solid color-mix(in srgb, var(--brand-wine) 62%, #ffffff);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		color: var(--ink);
		text-decoration: none;
	}
	.t {
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}
	.v {
		margin-top: auto;
		padding-top: 8px;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 700;
		font-variant-numeric: tabular-nums lining-nums;
		color: var(--ink);
	}
	.m {
		font-size: 13.5px;
		color: var(--ink-3);
		line-height: 1.25;
	}
	/* With no value, the count line takes the foot instead. */
	.t + .m {
		margin-top: auto;
		padding-top: 8px;
	}
	.tile.quiet {
		background: var(--glass-dim, rgba(255, 255, 255, 0.72));
		border-top-color: var(--glass-line);
		box-shadow: none;
		min-height: 76px;
	}
	.tile:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	@media (prefers-reduced-motion: no-preference) {
		.tile {
			transition:
				transform 140ms ease,
				box-shadow 140ms ease;
		}
		.tile:hover {
			transform: translateY(-1px);
			box-shadow: var(--glass-shadow-lift);
		}
	}
</style>
