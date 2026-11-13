<script>
	/**
	 * Two lenses on one branch, as a switch at the top of the screen.
	 *
	 * Built from links, not a bound toggle. These navigate, so an anchor
	 * is the honest element: middle-click opens a tab, it is announced as
	 * a link, and there is no local state to drift out of sync with the
	 * route. The branch decides which lens is current and says so.
	 */
	import { Icon } from '$lib/kit';

	/**
	 * @type {{
	 *   label: string,
	 *   items: { label: string, href: string, icon: string }[],
	 *   at: string
	 * }}
	 */
	let { label, items, at } = $props();
</script>

<nav class="track" aria-label={label}>
	{#each items as item (item.href)}
		<a
			href={item.href}
			class:on={at === item.href}
			aria-current={at === item.href ? 'page' : undefined}
		>
			<Icon name={item.icon} size={16} />
			{item.label}
		</a>
	{/each}
</nav>

<style>
	/* One size for every switch in the app. 75% on a phone so it reads as
	   a control over the page rather than another band of content.

	   The track is smoke and the thumb is the lit part, which is the
	   reverse of how it was: a white track with a wine thumb made the
	   whole control a card, and the eye went to the track. */
	.track {
		width: 75%;
		margin: 0 auto;
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--smoke);
		border: 1px solid var(--smoke-line);
		box-shadow: var(--smoke-shadow);
		backdrop-filter: blur(14px) saturate(1.3);
		-webkit-backdrop-filter: blur(14px) saturate(1.3);
	}
	a {
		/* Grows from its own width, not from zero: 'Organizations' is
		   twice 'People', and equal halves clipped it. */
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-width: 0;
		min-height: 42px;
		padding: 0 12px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--on-field);
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
	}
	.on {
		background: var(--thumb);
		color: var(--thumb-ink);
		box-shadow: var(--thumb-shadow);
		font-weight: 700;
	}
	a:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	@media (min-width: 900px) {
		.track {
			width: 340px;
			margin-left: 0;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		a {
			transition:
				background 160ms ease,
				color 160ms ease,
				box-shadow 160ms ease;
		}
	}
</style>
