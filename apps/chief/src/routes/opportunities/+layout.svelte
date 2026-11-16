<script>
	/**
	 * Opportunities is designed and not built. Signed out it shows the design with
	 * samples; signed in it says so, rather than put sample records
	 * beside an account's own.
	 */
	import NotBuilt from '$lib/shell/NotBuilt.svelte';
	import { session } from '$lib/session.svelte.js';

	let { children } = $props();
</script>

{#if session.signedIn}
	<NotBuilt
		title="Opportunities"
		back="/"
		will="Chief will point out what your own records suggest: an asset sitting idle, a value gone stale, money owed and not collected."
		meanwhile={[
			{ href: '/records', title: 'Assets', meta: 'What needs attention is flagged there today' }
		]}
	/>
{:else}
	{@render children()}
{/if}
