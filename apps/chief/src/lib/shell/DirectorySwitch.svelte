<script>
	/**
	 * The Directory has two lenses on one class of record.
	 *
	 * Every person is an Organization — type C — so People is not a
	 * different kind of thing from Organizations. It is the Directory
	 * filtered to the individuals; the other lens shows the bodies those
	 * individuals are tied together by.
	 *
	 * Built from links, not a bound toggle. This navigates, so the honest
	 * element is an anchor: it opens in a new tab on middle-click, it is
	 * announced as a link, and there is no local state to drift out of
	 * sync with the route.
	 */
	import { Icon } from '$lib/kit';

	/** @type {{ at: 'people'|'organizations' }} */
	let { at } = $props();
</script>

<nav class="track" aria-label="Directory view">
	<a href="/people" class:on={at === 'people'} aria-current={at === 'people' ? 'page' : undefined}>
		<Icon name="people" size={16} />
		People
	</a>
	<a
		href="/organizations"
		class:on={at === 'organizations'}
		aria-current={at === 'organizations' ? 'page' : undefined}
	>
		<Icon name="sphere" size={16} />
		Organizations
	</a>
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
