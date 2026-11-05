<script>
	import { Card } from '@azbolt/ui';
</script>

<svelte:head>
	<title>About · Chaim</title>
</svelte:head>

<Card label="About">
	<p class="note">
		One of five AZBOLT apps in a single repository. Each runs on its own subdomain, which means its
		own service worker scope and its own install entry.
	</p>
</Card>

<style>
	.note {
		font-size: var(--size-body);
		line-height: 1.55;
		color: var(--muted);
		margin: 0;
	}
</style>
