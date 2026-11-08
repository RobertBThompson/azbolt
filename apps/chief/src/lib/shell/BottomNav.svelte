<script>
	/**
	 * v3 nav: Today · Work · Jot · People · Records.
	 * Jot is centred because capture is cheaper than filing. Assets gave up
	 * its slot to People — frequency earns a tab, not importance — and
	 * "More" became "Records", a real destination rather than a menu.
	 */
	import { page } from '$app/stores';

	const tabs = [
		{ label: 'Today', href: '/' },
		{ label: 'Work', href: '/work' },
		{ label: 'Jot', href: '/jot', center: true },
		{ label: 'People', href: '/people' },
		{ label: 'Records', href: '/records' }
	];
</script>

<nav>
	{#each tabs as tab (tab.href)}
		{@const on = $page.url.pathname === tab.href}
		<a href={tab.href} aria-current={on ? 'page' : undefined}>
			<span class="mark" class:center={tab.center} class:on></span>
			<span class="label" class:on>{tab.label}</span>
		</a>
	{/each}
</nav>

<style>
	nav {
		flex: none;
		height: calc(var(--nav) + env(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		border-top: 1px solid var(--line-4);
		background: #faf9f7;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
	}
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		text-decoration: none;
	}
	.mark {
		width: 16px;
		height: 16px;
		border-radius: 5px;
		background: #c2bcb3;
	}
	.mark.on {
		background: var(--ink);
	}
	.mark.center {
		width: 25px;
		height: 25px;
		border-radius: 12px;
		background: var(--tone-ai);
	}
	.label {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--ink-4);
	}
	.label.on {
		color: var(--ink);
	}
</style>
