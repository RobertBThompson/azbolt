<script>
	/** @type {{ label?: string, children?: import('svelte').Snippet }} */
	let { label = '', children } = $props();
</script>

<section>
	{#if label}<div class="k">{label}</div>{/if}
	{@render children?.()}
</section>

<style>
	section {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--white);
		padding: 16px;
	}
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 10px;
	}
</style>
