<script>
	import { Card, Button, InstallPrompt } from '@azbolt/ui';

	let count = $state(0);
</script>

<svelte:head>
	<title>LIP</title>
</svelte:head>

<div class="stack">
	<InstallPrompt />

	<Card label="Status">
		<h2>LIP is running.</h2>
		<p class="note">
			Static SvelteKit PWA, installable, offline-capable. Shared shell, tokens and components come
			from <code>@azbolt/ui</code> and <code>@azbolt/config</code>.
		</p>
	</Card>

	<Card label="Workspace check">
		<p class="note">Confirms shared components render and state is reactive.</p>
		<p class="num big">{count}</p>
		<Button variant="solid" onclick={() => (count += 1)}>Increment</Button>
	</Card>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	h2 {
		font-size: 20px;
		margin-bottom: 6px;
	}
	.note {
		font-size: var(--size-body);
		line-height: 1.55;
		color: var(--muted);
		margin: 0 0 10px;
	}
	.big {
		font: 600 var(--size-display) / 1.1 var(--font-serif);
		margin: 0 0 12px;
	}
	code {
		font-size: 12px;
		background: var(--paper);
		padding: 1px 4px;
		border-radius: 3px;
	}
</style>
