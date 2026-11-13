<script>
	/**
	 * The name of the thing a screen is about, set straight on the field.
	 *
	 * A banner is a pane, and a pane says "one item among several". A
	 * record's own page is not one item among several, so its name is not
	 * boxed: an optional line saying what kind of thing it is, the name,
	 * and an optional sentence under it.
	 */
	/** @type {{ title: string, eyebrow?: string, meta?: string }} */
	let { title, eyebrow = '', meta = '' } = $props();
	/* The last word is lit in marigold; the words read the same. */
	const cut = $derived(title.lastIndexOf(' '));
	const lead = $derived(cut > 0 ? title.slice(0, cut + 1) : '');
	const last = $derived(cut > 0 ? title.slice(cut + 1) : title);
</script>

<header class="head">
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	<h1>{lead}<span class="pop-word">{last}</span></h1>
	{#if meta}<p class="meta">{meta}</p>{/if}
</header>

<style>
	.head {
		padding: 2px 2px 2px;
	}
	.eyebrow {
		margin: 0 0 3px;
		color: var(--on-field-2);
	}
	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--fs-xl);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--on-field);
		text-shadow: var(--on-field-shade);
		text-wrap: balance;
	}
	.meta {
		margin: 5px 0 0;
		font-size: 16px;
		line-height: 1.4;
		color: var(--on-field-2);
		text-wrap: pretty;
	}
</style>
