<script>
	/**
	 * The frame every screen renders inside. No branch renders its own
	 * app bar or nav — that is the whole reason Shell is a branch.
	 *
	 * One shell, two shapes. Below 900px it is a phone: a column with the
	 * bar on top and the nav riding the bottom edge. At 900px and above
	 * the nav becomes a rail down the left and the content gets room to
	 * breathe beside it.
	 *
	 * Being a PWA has nothing to do with this. Installability, offline
	 * and the home-screen icon come from the manifest and the service
	 * worker; what a layout does at 1400px is ordinary CSS and has to be
	 * written. Nobody had written it, so the app was a phone column
	 * stranded in the middle of a desktop.
	 */
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
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		max-width: 480px;
		margin: 0 auto;
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
		display: flex;
		flex-direction: column;
		gap: 9px;
		/* The mark is lifted 18px above the nav, so content needs more
		   clearance at the bottom than a flat bar would have asked for. */
		padding: 22px 15px 28px;
		overflow-x: hidden;
	}

	/* ── Desktop ─────────────────────────────────────────────────────── */
	@media (min-width: 900px) {
		.screen {
			max-width: 1120px;
		}
		/* row-reverse, not row: the nav comes after main in the markup so
		   that a screen reader and the tab order meet the content first,
		   which is the right order on a phone and stays right here. */
		.body {
			flex-direction: row-reverse;
			align-items: flex-start;
			gap: 30px;
			padding: 0 26px 40px;
		}
		main {
			/* Measure, not width. A line of body text past ~70 characters
			   is harder to read, and the page has no more to say at 1100px
			   than it does at 720. */
			max-width: 720px;
			padding: 26px 0 0;
		}
		.railed main {
			flex: 1;
		}
	}
</style>
