<script>
	/** @type {{ title: string, value?: number, meta?: string, t?: string }} */
	let { title, value = 0, meta = '', t = 'neutral' } = $props();
	import { tone } from './tone.js';
	const c = $derived(tone(t));
	const pct = $derived(Math.round(value * 100));
</script>

<div class="prog" style="--t-ink:{c.ink}; --pct:{pct}">
	<span class="ring" aria-hidden="true"><span class="w">{pct}%</span></span>
	<div class="main">
		<div class="head">
			<span class="t">{title}</span>
		</div>
		<div
			class="track"
			role="progressbar"
			aria-valuenow={pct}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-label={title}
		>
			<div class="fill" style="width:{pct}%; background-color:{c.ink}"></div>
		</div>
		{#if meta}<div class="m">{meta}</div>{/if}
	</div>
</div>

<style>
	/* Was bare text and a bar on paper. On the field it needs a pane of
	   its own, or the title and the figure are ink on violet. */
	.prog {
		display: flex;
		align-items: center;
		gap: 14px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		padding: 12px 15px 11px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
	}
	.t {
		font-size: 16px;
		font-weight: 600;
	}
	.w {
		font-family: var(--font-label);
		font-size: 14.5px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--ink-2);
	}
	/* A well with a lit bar lying in it. */
	.track {
		height: 10px;
		border-radius: 999px;
		background: var(--well);
		box-shadow: var(--well-shadow);
		margin: 8px 0 6px;
		overflow: hidden;
	}
	.fill {
		height: 10px;
		border-radius: 999px;
		background-image: var(--gloss);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}
	.m {
		font-size: 14px;
		color: var(--ink-3);
	}
	.ring {
		width: 58px;
		height: 58px;
		flex: none;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background:
			radial-gradient(closest-side, #ffffff 74%, transparent 75% 100%),
			conic-gradient(var(--t-ink) calc(var(--pct) * 1%), var(--wash-2) 0);
		box-shadow: 0 6px 14px color-mix(in srgb, var(--t-ink) 24%, transparent);
	}
	.main {
		flex: 1;
		min-width: 0;
	}
</style>
