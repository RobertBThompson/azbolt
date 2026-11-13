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
		/* The field. Three layers: a warm sunrise behind the masthead, a
		   cool one opposite it, and the violet-to-near-white fall that
		   carries the page down to the nav. Fixed attachment so the
		   gradient belongs to the screen rather than scrolling with the
		   content and banding at the seam. */
		background-color: #a79cdf;
		background-image:
			radial-gradient(120% 260px at 88% -6%, rgba(255, 186, 120, 0.5), transparent 62%),
			radial-gradient(100% 220px at 4% 2%, rgba(120, 150, 230, 0.45), transparent 66%),
			linear-gradient(
				180deg,
				var(--field-1) 0%,
				var(--field-2) 18%,
				var(--field-3) 52%,
				#a79cdf 100%
			);
		background-attachment: fixed;
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
