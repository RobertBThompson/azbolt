<script>
	/**
	 * The spheres a person belongs to, as swatches with names.
	 *
	 * A person is rarely in exactly one area of a life, so this is always
	 * a list. Unknown names resolve to a stable colour of their own, which
	 * is what lets a Chief put someone in "Australian Rugby" without that
	 * sphere having to exist anywhere first.
	 */
	/** @type {{ keys: string[], size?: 'sm'|'md' }} */
	let { keys, size = 'md' } = $props();
	import { sphereOf } from '$lib/spheres.js';
</script>

<ul class="tags" class:sm={size === 'sm'}>
	{#each keys as key (key)}
		{@const s = sphereOf(key)}
		<li><span class="sw" style="background:{s.swatch}"></span>{s.name}</li>
	{/each}
</ul>

<style>
	.tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px 4px 8px;
		border-radius: 999px;
		background: var(--well);
		box-shadow: var(--well-shadow);
		font-family: var(--font-label);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-2);
	}
	/* A bead in the sphere's colour. */
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.55),
			0 1px 3px rgba(30, 20, 90, 0.35);
		flex: none;
	}
	.sm li {
		font-size: 11.5px;
		padding: 3px 8px 3px 6px;
	}
</style>
