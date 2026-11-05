<script>
	/**
	 * @type {{
	 *   variant?: 'ghost' | 'solid' | 'accent',
	 *   type?: 'button' | 'submit' | 'reset',
	 *   disabled?: boolean,
	 *   onclick?: (event: MouseEvent) => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { variant = 'ghost', type = 'button', disabled = false, onclick, children } = $props();
</script>

<button class={variant} {type} {disabled} {onclick}>
	{@render children?.()}
</button>

<style>
	button {
		min-height: var(--tap-min);
		width: 100%;
		border-radius: var(--radius-sm);
		font: 700 12px var(--font-sans);
		letter-spacing: 0.04em;
		cursor: pointer;
	}
	button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
	.ghost {
		background: var(--white);
		border: 1px solid var(--ink);
		color: var(--ink);
	}
	.solid {
		background: var(--ink);
		border: 1px solid var(--ink);
		color: var(--white);
	}
	.accent {
		background: var(--app-accent);
		border: 1px solid var(--app-accent);
		color: var(--white);
	}
</style>
