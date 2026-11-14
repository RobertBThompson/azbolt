<script>
	/**
	 * B3 Work — W5 Task.
	 * The account's own task, or the design sample for a sample id.
	 */
	import { page } from '$app/stores';
	import Live from './Live.svelte';
	import Sample from './Sample.svelte';

	let { data } = $props();
</script>

{#if data.own}
	{#key $page.params.id}<Live id={$page.params.id ?? ''} />{/key}
{:else}
	<Sample />
{/if}
