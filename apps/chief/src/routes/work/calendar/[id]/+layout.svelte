<script>
	/**
	 * Appointments and open blocks are designed and not built. Signed in,
	 * the calendar shows dated tasks and payments, which have pages of
	 * their own.
	 */
	import NotBuilt from '$lib/shell/NotBuilt.svelte';
	import { session } from '$lib/session.svelte.js';

	let { children } = $props();
</script>

{#if session.signedIn}
	<NotBuilt
		title="Appointments"
		back="/work/calendar"
		will="Blocks of time, and Chief suggesting a task into an open one. Chief keeps no appointments today."
		meanwhile={[{ href: '/work/calendar', title: 'By date', meta: 'Dated tasks and payments due' }]}
	/>
{:else}
	{@render children()}
{/if}
