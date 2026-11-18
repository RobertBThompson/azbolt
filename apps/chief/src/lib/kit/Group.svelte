<script>
	/**
	 * One end of a set of links, and everything at the other end.
	 *
	 * Ownership was a run of small capitals on the field with white rows
	 * under them. The small capitals were the part that said whose the
	 * rows were, and they were the part the eye skipped, so the links
	 * themselves went unseen. Here the name heads the panel the rows sit
	 * in, larger than they are, with what the link is ("owns 4") under
	 * it, and a line runs down from it beside the rows. Who holds what is
	 * read off the shape before a word of it.
	 *
	 * Rows inside sit flatter than on the open field, the way Expander
	 * asks of its rows, so the panel is the object and they are its parts.
	 *
	 * @type {{
	 *   title: string,
	 *   caption?: string,
	 *   icon?: string,
	 *   hue?: 'wine'|'blue'|'night',
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { title, caption = '', icon = '', hue = 'wine', children } = $props();
	import Icon from './Icon.svelte';
</script>

<section class="group">
	<header>
		{#if icon}<span class="tile {hue}" aria-hidden="true"><Icon name={icon} size={18} /></span>{/if}
		<span class="titles">
			<h2>{title}</h2>
			{#if caption}<span class="cap">{caption}</span>{/if}
		</span>
	</header>
	<div class="body">
		{@render children()}
	</div>
</section>

<style>
	.group {
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		padding: 14px 12px 12px;
	}
	header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 4px 12px;
	}
	.tile {
		width: 40px;
		height: 40px;
		flex: none;
		border-radius: var(--r-xs);
		display: grid;
		place-items: center;
		color: #ffffff;
		background: var(--gloss), var(--grad-wine);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 6px 14px -4px rgba(154, 43, 59, 0.45);
	}
	.tile.blue {
		background: var(--gloss), var(--grad-blue);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			0 6px 14px -4px rgba(45, 98, 163, 0.45);
	}
	.tile.night {
		background: var(--gloss), var(--grad-night);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.22),
			0 6px 14px -4px rgba(30, 42, 66, 0.45);
	}
	.titles {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--ink);
		overflow-wrap: anywhere;
	}
	.cap {
		font-size: 14px;
		color: var(--ink-3);
		margin-top: 1px;
	}
	/* The line from the name down beside what it holds. It starts under
	   the centre of the tile, so the rows hang off the name. */
	.body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-left: 23px;
		padding-left: 14px;
		border-left: 2px solid color-mix(in srgb, var(--brand-wine) 38%, #ffffff);
		--pane-line: var(--line-3);
		--pane-shadow: 0 1px 2px rgba(20, 12, 80, 0.08);
	}
</style>
