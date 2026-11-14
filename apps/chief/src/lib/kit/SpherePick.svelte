<script>
	/**
	 * Which spheres a record belongs to, chosen from the Chief's own.
	 *
	 * More than one is normal: a brother who works in the business is
	 * Family and Business. All life is not offered — it is every sphere
	 * at once, so being "in" it says nothing about a record.
	 */
	/** @type {{ picked: string[], onchange: (next: string[]) => void, disabled?: boolean }} */
	let { picked, onchange, disabled = false } = $props();
	import { placeable, sphereOf } from '$lib/spheres.svelte.js';

	const offered = $derived([
		...placeable()
			.filter(([k]) => k !== 'all')
			.map(([k]) => k),
		...picked.filter((k) => !placeable().some(([pk]) => pk === k))
	]);

	/** @param {string} key */
	const toggle = (key) =>
		onchange(picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key]);
</script>

{#if offered.length === 0}
	<p class="none">
		No spheres yet. <a href="/sphere/switch">Make your first one</a>, then come back.
	</p>
{:else}
	<div class="picks">
		{#each offered as key (key)}
			{@const s = sphereOf(key)}
			<button
				type="button"
				class="pick"
				class:on={picked.includes(key)}
				aria-pressed={picked.includes(key)}
				{disabled}
				onclick={() => toggle(key)}
			>
				<span class="sw" style="background:{s.swatch}"></span>
				{s.name}
			</button>
		{/each}
	</div>
{/if}

<style>
	.picks {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.pick {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 14px;
		border-radius: 999px;
		border: 1px solid var(--glass-line);
		background: var(--glass);
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-3);
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 4px 10px -5px rgba(30, 20, 90, 0.45);
	}
	.pick.on {
		border-color: color-mix(in srgb, var(--tone-cool) 55%, #ffffff);
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-cool-tint) 100%);
		color: var(--tone-cool);
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--tone-cool) 16%, transparent),
			0 5px 12px -5px color-mix(in srgb, var(--tone-cool) 60%, transparent);
	}
	.pick:disabled {
		opacity: 0.6;
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 1px 3px rgba(30, 20, 90, 0.35);
	}
	.none {
		margin: 0;
		padding: 13px 16px;
		border: 1.5px dashed rgba(255, 255, 255, 0.75);
		border-radius: var(--r-sm);
		font-size: 14.5px;
		color: var(--on-field);
		background: rgba(255, 255, 255, 0.14);
	}
	.none a {
		color: inherit;
		font-weight: 700;
	}
</style>
