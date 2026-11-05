<script>
	/**
	 * Common frame for every AZBOLT app: fixed header, scrolling body,
	 * optional bottom tab bar. Mobile-first, 390x844 baseline.
	 */
	/**
	 * @type {{
	 *   title?: string,
	 *   subtitle?: string,
	 *   tabs?: { href: string, label: string, icon?: string }[],
	 *   active?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { title = '', subtitle = '', tabs = [], active = '', children } = $props();
</script>

<div class="shell">
	<header>
		<span class="mark">{title}</span>
		{#if subtitle}<small>{subtitle}</small>{/if}
	</header>

	<main>
		{@render children?.()}
	</main>

	{#if tabs.length}
		<nav>
			{#each tabs as tab (tab.href)}
				<a href={tab.href} class:active={tab.href === active}>
					<b>{tab.icon ?? '•'}</b>
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
		gap: 10px;
		padding: 0 14px;
		background: var(--white);
		border-bottom: 1px solid var(--line);
		position: sticky;
		top: 0;
		z-index: 20;
	}
	.mark {
		font: 600 19px var(--font-serif);
		letter-spacing: 0.14em;
	}
	header small {
		margin-left: auto;
		font-size: var(--size-caption);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	main {
		flex: 1;
		padding: 14px;
	}
	nav {
		flex: none;
		position: sticky;
		bottom: 0;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		background: var(--white);
		border-top: 1px solid var(--line);
		padding-bottom: env(safe-area-inset-bottom);
	}
	nav a {
		min-height: var(--tap-min);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		font-size: var(--size-caption);
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
