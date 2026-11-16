<script>
	/**
	 * Business plans is designed and not built. Signed out it shows the design with
	 * samples; signed in it says so, rather than put sample records
	 * beside an account's own.
	 */
	import NotBuilt from '$lib/shell/NotBuilt.svelte';
	import { session } from '$lib/session.svelte.js';

	let { children } = $props();
</script>

{#if session.signedIn}
	<NotBuilt
		title="Business plans"
		back="/sphere"
		will="A plan will tie to one organization and push out the endeavors, tasks and assets it calls for. The Sphere Game will live here too."
		meanwhile={[
			{
				href: '/work/endeavors',
				title: 'Endeavors',
				meta: 'Name an outcome and the tasks under it'
			}
		]}
	/>
{:else}
	{@render children()}
{/if}
