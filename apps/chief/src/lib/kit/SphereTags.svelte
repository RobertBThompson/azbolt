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
		gap: 5px;
	}
	li {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 3px 8px 3px 6px;
		border-radius: 999px;
		background: var(--wash-1);
		font-family: var(--font-mono);
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: var(--ink-2);
	}
	.sw {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		flex: none;
	}
	.sm li {
		font-size: 8.5px;
		padding: 2px 6px 2px 5px;
	}
</style>
