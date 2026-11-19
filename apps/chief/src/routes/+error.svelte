<script>
	/**
	 * Every error in the app lands here. A 404 from mustExist() arrives
	 * with the words for its own case; anything else gets the plain
	 * version, which still says that nothing was changed.
	 */
	import { page } from '$app/stores';
	import Screen from '$lib/shell/Screen.svelte';
	import { Missing } from '$lib/kit';

	const what = $derived($page.error?.what ?? 'record');
	const back = $derived($page.error?.back ?? '/');
	const backLabel = $derived($page.error?.backLabel ?? 'Go to Chief');
	const missing = $derived($page.status === 404);
</script>

<svelte:head><title>{missing ? 'Not found' : 'Something went wrong'} · Chief</title></svelte:head>

<Screen back="/" nav={false}>
	<h1 class="sr-only">{missing ? 'Not found' : 'Something went wrong'}</h1>
	{#if missing}
		<Missing {what} {back} {backLabel} />
	{:else}
		<Missing what="screen is not working" back="/" backLabel="Go to Chief" />
	{/if}
</Screen>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
</style>
