<script>
	/** @type {{ label: string, primary?: boolean, t?: string, href?: string|null, onclick?: (() => void)|null }} */
	let { label, primary = true, t = 'neutral', href = null, onclick = null } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

{#if href}
	<a class="btn" class:primary {href} style="--t-ink:{c.ink}">{label}</a>
{:else}
	<button type="button" class="btn" class:primary {onclick} style="--t-ink:{c.ink}">{label}</button>
{/if}

<style>
	.btn {
		height: var(--tap-min);
		border-radius: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: inherit;
		font-size: 14.5px;
		font-weight: 600;
		width: 100%;
		background: var(--card);
		border: 1px solid var(--line-2);
		color: var(--ink);
		text-decoration: none;
	}
	.btn.primary {
		background: var(--t-ink);
		border-color: var(--t-ink);
		color: #ffffff;
	}
</style>
