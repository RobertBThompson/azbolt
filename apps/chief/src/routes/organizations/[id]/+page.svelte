<script>
	/**
	 * F1 Directory — Organization.
	 *
	 * Two views behind one address. The account's own record shows what
	 * is actually kept about it; a sample id shows the design sample,
	 * with everything the finished screen is meant to hold.
	 */
	import Live from './Live.svelte';
	import Sample from './Sample.svelte';

	let { data } = $props();
</script>

{#if data.live}
	{#key data.live.id}<Live org={data.live} />{/key}
{:else}
	<Sample />
{/if}
