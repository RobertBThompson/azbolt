<script>
	import ReportCard from '$lib/components/ReportCard.svelte';
	import Quadrant from '$lib/components/Quadrant.svelte';

	let { data } = $props();
</script>

<svelte:head><title>{data.object.name} · LIP</title></svelte:head>

<div class="wrap">
	<a class="back" href="/">← Map</a>

	<Quadrant objects={[data.object]} height={200} showLabels={false} />

	<ReportCard object={data.object} />

	<p class="sep">
		This is a Measure surface. Agreeing, adjusting or flagging happens in QC, never here.
	</p>
</div>

<style>
	.wrap {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.back {
		min-height: var(--tap-min);
		display: inline-flex;
		align-items: center;
		font-size: var(--size-small);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
	}
	.sep {
		font-size: var(--size-small);
		color: var(--muted);
		text-align: center;
		margin: 0;
	}
</style>
