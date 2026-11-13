<script>
	/**
	 * @type {{
	 *   a: string, b: string, aIcon?: string, bIcon?: string,
	 *   active?: number, id: string, label?: string
	 * }}
	 */
	let { a, b, aIcon = '', bIcon = '', active = $bindable(0), id, label = 'Page state' } = $props();
	import Icon from './Icon.svelte';

	/** @type {HTMLButtonElement[]} */
	let tabs = $state([]);

	/** @param {KeyboardEvent} e */
	function keys(e) {
		if (e.key === 'Home') active = 0;
		else if (e.key === 'End') active = 1;
		else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') active = active === 0 ? 1 : 0;
		else return;
		e.preventDefault();
		tabs[active]?.focus();
	}
</script>

<div class="track" role="tablist" aria-label={label}>
	<button
		bind:this={tabs[0]}
		id="{id}-tab-0"
		role="tab"
		type="button"
		aria-controls="{id}-panel-0"
		aria-selected={active === 0}
		tabindex={active === 0 ? 0 : -1}
		class:on={active === 0}
		onclick={() => (active = 0)}
		onkeydown={keys}
	>
		{#if aIcon}<Icon name={aIcon} size={16} />{/if}
		{a}
	</button>
	<button
		bind:this={tabs[1]}
		id="{id}-tab-1"
		role="tab"
		type="button"
		aria-controls="{id}-panel-1"
		aria-selected={active === 1}
		tabindex={active === 1 ? 0 : -1}
		class:on={active === 1}
		onclick={() => (active = 1)}
		onkeydown={keys}
	>
		{#if bIcon}<Icon name={bIcon} size={16} />{/if}
		{b}
	</button>
</div>

<style>
	/* One size for every switch in the app. 75% on a phone so it reads as
	   a control over the page rather than another band of content.

	   The track is smoke and the thumb is the lit part, which is the
	   reverse of how it was: a white track with a wine thumb made the
	   whole control a card, and the eye went to the track. */
	.track {
		width: 75%;
		max-width: 22rem;
		margin: 0 auto;
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--smoke);
		border: 1px solid var(--smoke-line);
		box-shadow: var(--smoke-shadow);
		backdrop-filter: blur(14px) saturate(1.3);
		-webkit-backdrop-filter: blur(14px) saturate(1.3);
	}
	button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-width: 0;
		min-height: 42px;
		padding: 0 6px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--on-field);
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
	}
	.on {
		background: var(--thumb);
		color: var(--thumb-ink);
		box-shadow: var(--thumb-shadow);
		font-weight: 700;
	}
	button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	@media (min-width: 48rem) {
		.track {
			width: 13rem;
			margin: 0;
		}
		button {
			min-height: 44px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		button {
			transition:
				background 160ms ease,
				color 160ms ease,
				box-shadow 160ms ease;
		}
	}
</style>
