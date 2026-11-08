<script>
	/**
	 * The frame every screen renders inside. No branch renders its own
	 * app bar or nav — that is the whole reason Shell is a branch.
	 */
	import ContextBar from './ContextBar.svelte';
	import BottomNav from './BottomNav.svelte';

	/** @type {{ search?: boolean, back?: string|null, nav?: boolean, children: import('svelte').Snippet }} */
	let { search = false, back = null, nav = true, children } = $props();
</script>

<div class="screen">
	<ContextBar {search} {back} />
	<main>{@render children()}</main>
	{#if nav}<BottomNav />{/if}
</div>

<style>
	.screen {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		max-width: 480px;
		margin: 0 auto;
		background: var(--paper);
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding: 13px 15px 20px;
		overflow-x: hidden;
	}
</style>
