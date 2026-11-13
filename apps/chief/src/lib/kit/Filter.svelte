<script>
	/**
	 * One choice from a short row of pills, as a real control.
	 *
	 * Chips are labels — under the tap minimum on purpose, so they cannot
	 * be mistaken for buttons. This is the other thing: each pill is a
	 * button at full height, the row scrolls rather than wrapping so a
	 * long set never pushes the list it filters off the screen, and it
	 * runs out to the screen edge so the cut-off pill reads as "more this
	 * way" instead of as a clipped box.
	 */
	/**
	 * @type {{
	 *   label: string,
	 *   items: { key: string, label: string, count?: number }[],
	 *   active?: string,
	 *   t?: string
	 * }}
	 */
	let { label, items, active = $bindable(''), t = 'warm' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
</script>

<div class="filter" role="group" aria-label={label} style="--t-ink:{c.ink}; --t-tint:{c.tint}">
	{#each items as it (it.key)}
		<button
			type="button"
			class:on={active === it.key}
			aria-pressed={active === it.key}
			onclick={() => (active = it.key)}
		>
			{it.label}{#if it.count !== undefined}<span class="n">{it.count}</span>{/if}
		</button>
	{/each}
</div>

<style>
	.filter {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scrollbar-width: none;
		padding: 2px var(--shell-gutter) 8px;
		margin: -2px calc(var(--shell-gutter) * -1) -6px;
	}
	.filter::-webkit-scrollbar {
		display: none;
	}
	button {
		display: flex;
		align-items: center;
		gap: 7px;
		flex: none;
		min-height: 38px;
		padding: 0 15px;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: var(--glass);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 4px 10px -5px rgba(30, 20, 90, 0.45);
		font-family: var(--font-display);
		font-size: 14.5px;
		font-weight: 600;
		color: var(--ink-2);
		white-space: nowrap;
		cursor: pointer;
	}
	button.on {
		border-color: color-mix(in srgb, var(--t-ink) 55%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--t-tint) 100%);
		color: var(--t-ink);
		font-weight: 700;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--t-ink) 16%, transparent),
			0 5px 12px -5px color-mix(in srgb, var(--t-ink) 60%, transparent);
	}
	button:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	.n {
		font-size: 13px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
	}
	@media (min-width: 900px) {
		.filter {
			flex-wrap: wrap;
			overflow-x: visible;
		}
	}
</style>
