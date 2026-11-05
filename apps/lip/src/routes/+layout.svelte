<script>
	import '../app.css';
	import { AppShell } from '@azbolt/ui';
	import { page } from '$app/stores';

	let { children } = $props();

	const tabs = [
		{ href: '/', label: 'Home', icon: '⌂' },
		{ href: '/about', label: 'About', icon: '○' }
	];
</script>

<AppShell title="LIP" subtitle="AZBOLT" {tabs} active={$page.url.pathname}>
	{@render children()}
</AppShell>
