<script>
	/**
	 * Five ideological bins. Filled chips have weighed in; dashed chips are
	 * still needed. The user's own bin is called out in text beneath the
	 * row, never by colour alone.
	 *
	 * @type {{ quorum: Record<string, number>, yourBin?: string }}
	 */
	let { quorum, yourBin = '' } = $props();

	const bins = ['L', 'CL', 'C', 'CR', 'R'];
	let met = $derived(bins.filter((b) => quorum[b] > 0).length);
</script>

<div class="k">Quorum {met} of 5 bins</div>
<div class="quorum">
	{#each bins as b (b)}
		<div class={quorum[b] > 0 ? 'met' : 'unmet'}>
			<b>{b}</b><span class="num">{quorum[b]}</span>
		</div>
	{/each}
</div>
{#if yourBin}
	<p class="yours">You are {yourBin}. This item is in front of you because that bin is unmet.</p>
{/if}

<style>
	.k {
		font: 700 var(--size-label) var(--font-sans);
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 10px;
	}
	.quorum {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
		text-align: center;
	}
	.quorum div {
		padding: 10px 0;
		border-radius: var(--radius-sm);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.quorum b {
		font-size: var(--size-small);
		font-weight: 700;
	}
	.quorum span {
		font-size: var(--size-label);
		opacity: 0.8;
	}
	.met {
		background: var(--ink-2);
		color: #fff;
	}
	.unmet {
		border: 2px dashed var(--ink);
		color: var(--ink);
	}
	.yours {
		font-size: var(--size-small);
		color: var(--muted);
		margin: 12px 0 0;
	}
</style>
