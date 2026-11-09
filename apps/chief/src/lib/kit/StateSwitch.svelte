<script>
	/**
	 * The Jot / Dash state switch.
	 *
	 * Its own component rather than a variant of Seg, because it is not a
	 * choice inside a form — it swaps the whole page. It reads as a raised
	 * physical control: one track, a lifted thumb on the active half, and
	 * a shadow that puts it above the sections rather than among them.
	 *
	 * role="tablist" is accurate here: two panels, one visible, state kept
	 * on the page. That gives arrow-key movement and the right
	 * announcement for free.
	 */
	/**
	 * @type {{
	 *   a: string, b: string, aIcon?: string, bIcon?: string,
	 *   active?: number, labelledby?: string
	 * }}
	 */
	let { a, b, aIcon = '', bIcon = '', active = $bindable(0), labelledby = 'Page state' } = $props();
	import Icon from './Icon.svelte';

	/** @type {HTMLButtonElement[]} */
	let tabs = $state([]);

	/**
	 * Roving tabindex: the tablist itself is not focusable, the tabs are,
	 * and arrow keys both switch and move focus. Putting the handler on
	 * the list instead would need the list focusable, which is the wrong
	 * half of the pattern.
	 *
	 * @param {KeyboardEvent} e
	 */
	function keys(e) {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		e.preventDefault();
		active = active === 0 ? 1 : 0;
		tabs[active]?.focus();
	}
</script>

<div class="track" role="tablist" aria-label={labelledby}>
	<button
		bind:this={tabs[0]}
		role="tab"
		type="button"
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
		role="tab"
		type="button"
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
	.track {
		display: flex;
		gap: 4px;
		padding: 4px;
		border-radius: 999px;
		background: var(--card);
		box-shadow:
			0 1px 2px rgba(30, 26, 24, 0.05),
			0 6px 16px rgba(30, 26, 24, 0.08);
	}
	button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 40px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font-family: inherit;
		font-size: 14.5px;
		font-weight: 600;
		color: var(--ink-3);
		cursor: pointer;
	}
	.on {
		background: var(--brand-wine);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(30, 26, 24, 0.18);
	}
	@media (prefers-reduced-motion: no-preference) {
		button {
			transition:
				background 140ms ease,
				color 140ms ease;
		}
	}
</style>
