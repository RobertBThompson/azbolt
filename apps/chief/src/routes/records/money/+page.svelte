<script>
	/**
	 * Money. An account's own book leads with its money accounts and
	 * their balances; the sample book keeps the designed cash flow.
	 */
	import { ownBook } from '$lib/assets.js';
	import Own from './Own.svelte';
	import Sample from './Sample.svelte';
</script>

{#if ownBook()}
	<Own />
{:else}
	<Sample />
{/if}
