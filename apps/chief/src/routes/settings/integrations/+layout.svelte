<script>
	/**
	 * Integrations is designed and not built. Signed out it shows the design with
	 * samples; signed in it says so, rather than put sample records
	 * beside an account's own.
	 */
	import NotBuilt from '$lib/shell/NotBuilt.svelte';
	import { session } from '$lib/session.svelte.js';

	let { children } = $props();
</script>

{#if session.signedIn}
	<NotBuilt
		title="Integrations"
		back="/settings"
		will="Connecting a calendar, contacts or file storage. Nothing is connected, and Chief reads nothing from outside itself today."
		meanwhile={[]}
	/>
{:else}
	{@render children()}
{/if}
