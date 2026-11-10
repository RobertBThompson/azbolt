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
	.track {
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--card);
		box-shadow:
			0 1px 2px rgba(30, 26, 24, 0.05),
			0 6px 16px rgba(30, 26, 24, 0.08);
	}
	a {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 40px;
		border-radius: 999px;
		font-size: 14.5px;
		font-weight: 600;
		color: var(--ink-3);
		text-decoration: none;
	}
	.on {
		background: var(--tone-brand);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(30, 26, 24, 0.18);
	}
	@media (min-width: 900px) {
		.track {
			max-width: 380px;
		}
	}
</style>
