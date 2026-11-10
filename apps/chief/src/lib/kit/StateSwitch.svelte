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
	.track {
		width: 75%;
		max-width: 22rem;
		margin: 0 auto;
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
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-3);
		cursor: pointer;
		white-space: nowrap;
	}
	.on {
		background: var(--brand-wine);
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(30, 26, 24, 0.18);
	}
	button:focus-visible {
		outline: 2px solid var(--tone-cool);
		outline-offset: 2px;
	}
	@media (min-width: 48rem) {
		.track {
			width: 12rem;
			margin: 0;
		}
		button {
			min-height: 42px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		button {
			transition:
				background 140ms ease,
				color 140ms ease;
		}
	}
</style>
