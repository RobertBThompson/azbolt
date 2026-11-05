<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { InstallPrompt } from '@azbolt/ui';

	let { children } = $props();

	const tabs = [
		{ href: '/', label: 'Home', icon: '⌂' },
		{ href: '/explore', label: 'Explore', icon: '⌕' },
		{ href: '/debate', label: 'Debate', icon: '◉' },
		{ href: '/qc', label: 'QC', icon: '✓' },
		{ href: '/me', label: 'Me', icon: '○' }
	];

	/**
	 * Tabs stay lit for their whole section, not just the exact path.
	 * @param {string} href
	 * @param {string} path
	 */
	function isActive(href, path) {
		return href === '/' ? path === '/' : path.startsWith(href);
	}

	/**
	 * Onboarding is pre-tab. Showing the nav mid-instrument invites the user
	 * to wander off before they have a position, and a half-finished
	 * instrument is worse than an unstarted one.
	 */
	let onboarding = $derived($page.url.pathname.startsWith('/welcome'));
</script>

<div class="shell">
	<header>
		<a class="appmark" href="/">LIP</a>
		{#if onboarding}
			<span class="method">Private setup</span>
		{:else}
			<a class="method" href="/method">Method</a>
		{/if}
	</header>

	<main>
		<div class="installbar"><InstallPrompt /></div>
		{@render children()}
	</main>

	{#if !onboarding}
		<nav>
			{#each tabs as tab (tab.href)}
				<a
					href={tab.href}
					class:active={isActive(tab.href, $page.url.pathname)}
					aria-current={isActive(tab.href, $page.url.pathname) ? 'page' : undefined}
				>
					<b aria-hidden="true">{tab.icon}</b>
					{tab.label}
				</a>
			{/each}
		</nav>
	{/if}
</div>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
	header {
		flex: none;
		height: 48px;
		display: flex;
		align-items: center;
		padding: 0 14px;
		background: var(--white);
		border-bottom: 1px solid var(--line);
		position: sticky;
		top: 0;
		z-index: 20;
	}
	.appmark {
		font: 600 19px var(--font-serif);
		letter-spacing: 0.14em;
		text-decoration: none;
	}
	.method {
		margin-left: auto;
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	main {
		flex: 1;
		padding-bottom: 14px;
	}
	.installbar:not(:empty) {
		padding: 12px 12px 0;
	}
	nav {
		flex: none;
		position: sticky;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		background: var(--white);
		border-top: 1px solid var(--line);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 20;
	}
	nav a {
		min-height: var(--tap-min);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		font-size: 9px;
		color: var(--muted-2);
		text-decoration: none;
	}
	nav a b {
		font-size: 15px;
		line-height: 1;
	}
	nav a.active {
		color: var(--ink);
		font-weight: 700;
	}
</style>
