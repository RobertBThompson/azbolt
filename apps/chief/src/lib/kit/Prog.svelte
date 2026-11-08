<script>
	/** @type {{ title: string, value?: number, meta?: string, t?: string }} */
	let { title, value = 0, meta = '', t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	const pct = $derived(Math.round(value * 100));
</script>

<div class="prog">
	<div class="head">
		<span class="t">{title}</span>
		<span class="w">{pct}%</span>
	</div>
	<div
		class="track"
		role="progressbar"
		aria-valuenow={pct}
		aria-valuemin="0"
		aria-valuemax="100"
		aria-label={title}
	>
		<div class="fill" style="width:{pct}%; background:{c.ink}"></div>
	</div>
	{#if meta}<div class="m">{meta}</div>{/if}
</div>

<style>
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.t {
		font-size: 13px;
		font-weight: 600;
	}
	.w {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--tone-graphite);
	}
	.track {
		height: 8px;
		border-radius: 4px;
		background: #eae5de;
		margin: 6px 0 5px;
		overflow: hidden;
	}
	.fill {
		height: 8px;
		border-radius: 4px;
	}
	.m {
		font-size: 12px;
		color: var(--ink-3);
	}
</style>
