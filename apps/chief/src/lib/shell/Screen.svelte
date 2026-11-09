<script>
	/**
	 * The frame every screen renders inside. No branch renders its own
	 * app bar or nav — that is the whole reason Shell is a branch.
	 */
	import SphereBar from './SphereBar.svelte';
	import BottomNav from './BottomNav.svelte';

	/** @type {{ search?: boolean, back?: string|null, nav?: boolean, children: import('svelte').Snippet }} */
	let { search = false, back = null, nav = true, children } = $props();
</script>

<div class="screen">
	<SphereBar {search} {back} />
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
		/* The mark is lifted 18px above the nav, so content needs more
		   clearance at the bottom than a flat bar would have asked for. */
		padding: 22px 15px 28px;
		overflow-x: hidden;
	}
</style>
