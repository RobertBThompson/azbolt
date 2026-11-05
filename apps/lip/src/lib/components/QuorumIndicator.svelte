<script>
	/**
	 * Five ideological bins. Filled chips have weighed in; dashed chips are
	 * still needed. The user's own bin is called out in text beneath the row,
	 * never by color alone.
	 *
	 * @type {{ quorum: Record<string, number>, yourBin?: string }}
	 */
	let { quorum, yourBin = '' } = $props();

	const bins = ['L', 'CL', 'C', 'CR', 'R'];
	let met = $derived(bins.filter((b) => quorum[b] > 0).length);
</script>

<div class="k">Quorum {met} / 5 bins</div>
<div class="quorum">
	{#each bins as b (b)}
		<div class={quorum[b] > 0 ? 'met' : 'unmet'}>
			{b}<br /><span class="num">{quorum[b]}</span>
		</div>
	{/each}
</div>
{#if yourBin}
	<p class="yours">You are {yourBin}. This item is in front of you because that bin is unmet.</p>
{/if}

<style>
	.k {
		font: 700 10px var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 6px;
	}
	.quorum {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
		text-align: center;
		font-size: 9px;
	}
	.quorum div {
		padding: 6px 0;
		border-radius: 4px;
	}
	.met {
		background: var(--ink-2);
		color: #fff;
	}
	.unmet {
		border: 1.5px dashed var(--ink);
		color: var(--ink);
	}
	.yours {
		font-size: 9px;
		color: var(--muted);
		margin: 8px 0 0;
	}
</style>
