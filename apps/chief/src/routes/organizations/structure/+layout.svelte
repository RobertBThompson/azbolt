<script>
	/**
	 * Structure is designed and not built. Signed out it shows the design with
	 * samples; signed in it says so, rather than put sample records
	 * beside an account's own.
	 */
	import NotBuilt from '$lib/shell/NotBuilt.svelte';
	import { session } from '$lib/session.svelte.js';

	let { children } = $props();
</script>

{#if session.signedIn}
	<NotBuilt
		title="Structure"
		back="/organizations"
		will="Who directs whom inside and between organizations: governance, kept apart from ownership."
		meanwhile={[
			{
				href: '/records/ownership',
				title: 'Ownership',
				meta: 'Who holds what, which is kept today'
			}
		]}
	/>
{:else}
	{@render children()}
{/if}
