<script>
	/**
	 * F0 Shell — SH4 App menu.
	 * The overflow owns routing, not settings content. Context switching
	 * stays in SH1; account, help and legal destinations hand off to B8 so
	 * the shell never grows a second settings model.
	 */
	import Screen from '$lib/shell/Screen.svelte';
	import { Banner, Row, Btn } from '$lib/kit';
	import { CONTEXTS } from '$lib/contexts.js';
	import { shell } from '$lib/state.svelte.js';
	import { session } from '$lib/session.svelte.js';

	const ctx = $derived(CONTEXTS[shell.context] ?? CONTEXTS.all);
</script>

<svelte:head><title>Menu · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<Banner title={ctx.name} meta="Sphere controls and account actions." />
	<Row href="/settings" title="Settings" meta="AI, privacy and integrations" trailing="↗" />
	<Row href="/settings/help" title="Help" meta="Guides and support" trailing="↗" />
	<Row
		href="/settings/account"
		title="Account & legal"
		meta="Profile, export and terms"
		trailing="↗"
	/>
	<Row href="/context" title="Switch sphere" meta="Open the context switcher" trailing="↗" />
	{#if session.signedIn}
		<Row href="/signin" title="Account" meta={session.label} trailing="↗" />
		<Btn primary={false} label="Sign out" onclick={() => session.signOut()} />
	{:else}
		<Btn t="cool" href="/signin" label="Sign in" />
	{/if}
</Screen>
