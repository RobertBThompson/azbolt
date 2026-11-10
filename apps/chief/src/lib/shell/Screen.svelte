<script>
	import SphereBar from './SphereBar.svelte';
	import BottomNav from './BottomNav.svelte';

	/** @type {{ search?: boolean, back?: string|null, nav?: boolean, children: import('svelte').Snippet }} */
	let { search = false, back = null, nav = true, children } = $props();
</script>

<div class="screen" class:railed={nav}>
	<SphereBar {search} {back} />
	<div class="body">
		<main>{@render children()}</main>
		{#if nav}<BottomNav />{/if}
	</div>
</div>

<style>
	.screen {
		--shell-gutter: clamp(15px, calc(5vw - 9px), 28px);
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--paper);
	}
	.body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 9px;
		/* The mark is lifted 18px above the nav, so content needs more
		   clearance at the bottom than a flat bar would have asked for. */
		padding: 22px var(--shell-gutter) 28px;
		overflow-x: hidden;
	}

	@media (min-width: 48rem) {
		.screen {
			--shell-width: 74rem;
			--shell-gutter: clamp(20px, 3vw, 36px);
		}
		.body {
			width: 100%;
			max-width: var(--shell-width);
			margin-inline: auto;
			padding: 24px var(--shell-gutter) 40px;
		}
		.railed .body {
			display: grid;
			grid-template-areas: 'primary content';
			grid-template-columns: clamp(10rem, 18vw, 13rem) minmax(0, 1fr);
			align-items: start;
			gap: clamp(20px, 2.75vw, 36px);
		}
		main {
			padding: 0;
			overflow: visible;
		}
		.railed main {
			grid-area: content;
		}
		.screen:not(.railed) main {
			width: 100%;
			max-width: 44rem;
			margin-inline: auto;
		}
	}
</style>
