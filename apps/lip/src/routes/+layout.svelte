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

	/** Home paints its own header, which carries the score. */
	let ownHeader = $derived($page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

<div class="shell">
	{#if !ownHeader}
		<header>
			<a class="appmark" href="/">LIP</a>
			{#if onboarding}
				<span class="method">Private setup</span>
			{:else}
				<a class="method" href="/method">Method</a>
			{/if}
		</header>
	{/if}

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
		display: flex;
		align-items: center;
		padding: 16px 18px 18px;
		background: var(--header);
		box-shadow: 0 6px 24px rgba(15, 74, 77, 0.3);
		position: sticky;
		top: 0;
		z-index: 20;
	}
	.appmark {
		font-family: var(--font-serif);
		font-size: 27px;
		font-weight: 600;
		letter-spacing: 0.14em;
		color: #fff;
		text-decoration: none;
	}
	.method {
		margin-left: auto;
		font-size: var(--size-label);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--on-teal);
		text-decoration: none;
		min-height: var(--tap-min);
		display: inline-flex;
		align-items: center;
	}
	main {
		flex: 1;
		padding-bottom: 18px;
	}
	.installbar:not(:empty) {
		padding: 14px 16px 0;
	}
	nav {
		flex: none;
		position: sticky;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		background: var(--white);
		box-shadow: 0 -4px 20px rgba(21, 32, 31, 0.1);
		padding: 10px 0 14px;
		padding-bottom: calc(14px + env(safe-area-inset-bottom));
		z-index: 20;
	}
	nav a {
		min-height: var(--tap-min);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		font-size: var(--size-label);
		color: var(--muted-2);
		text-decoration: none;
	}
	nav a b {
		font-size: 19px;
		line-height: 1;
	}
	nav a.active {
		color: var(--teal-900);
		font-weight: 700;
	}
</style>
