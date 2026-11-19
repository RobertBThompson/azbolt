<script>
	/**
	 * F1 Directory — D3 Person.
	 *
	 * The account's own record shows what is kept about the person. A
	 * sample id shows the design sample, relationship rhythm included.
	 */
	import Live from './Live.svelte';
	import Sample from './Sample.svelte';

	let { data } = $props();
</script>

{#if data.live}
	{#key data.live.id}<Live person={data.live} />{/key}
{:else}
	<Sample />
{/if}
