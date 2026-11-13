<script>
	/**
	 * @type {{
	 *   label: string,
	 *   primary?: boolean,
	 *   t?: string,
	 *   href?: string|null,
	 *   onclick?: (() => void)|null,
	 *   type?: 'button'|'submit',
	 *   disabled?: boolean
	 * }}
	 */
	let {
		label,
		primary = true,
		t = 'neutral',
		href = null,
		onclick = null,
		type = 'button',
		disabled = false
	} = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

{#if href}
	<a class="btn" class:primary {href} style="--t-ink:{c.ink}">{label}</a>
{:else if type === 'submit'}
	<button type="submit" class="btn" class:primary {onclick} {disabled} style="--t-ink:{c.ink}"
		>{label}</button
	>
{:else}
	<button type="button" class="btn" class:primary {onclick} {disabled} style="--t-ink:{c.ink}"
		>{label}</button
	>
{/if}

<style>
	/* Every button is a pill. Secondary is unlit glass; primary is its
	   tone with a gloss over it and its own colour in the shadow, so it
	   looks pressed up out of the page rather than printed on it. */
	.btn {
		height: var(--tap-min);
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 16.5px;
		font-weight: 600;
		letter-spacing: 0.01em;
		width: 100%;
		background: var(--glass);
		border: 1px solid var(--glass-line);
		box-shadow: var(--glass-shadow);
		color: var(--ink);
		text-decoration: none;
		cursor: pointer;
	}
	.btn.primary {
		background:
			var(--gloss),
			linear-gradient(
				118deg,
				color-mix(in srgb, var(--t-ink) 78%, #ffffff) 0%,
				var(--t-ink) 46%,
				color-mix(in srgb, var(--t-ink) 76%, #170c5c) 100%
			);
		border-color: color-mix(in srgb, var(--t-ink) 70%, #ffffff);
		color: #ffffff;
		font-weight: 700;
		text-shadow: 0 1px 2px rgba(10, 6, 50, 0.35);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.55),
			0 12px 22px -10px color-mix(in srgb, var(--t-ink) 90%, #000000),
			0 2px 4px rgba(20, 12, 80, 0.25);
	}
	.btn:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 3px;
	}
	.btn:disabled {
		opacity: 0.55;
		cursor: default;
	}
</style>
