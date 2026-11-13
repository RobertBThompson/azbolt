<script>
	/** Rust is attention required. Never a section colour, never decorative. */
	/** @type {{ title: string, meta?: string }} */
	let { title, meta = '' } = $props();
</script>

<div class="alert">
	<span class="bang" aria-hidden="true">!</span>
	<span class="body">
		<span class="t">{title}</span>
		{#if meta}<span class="m">{meta}</span>{/if}
	</span>
</div>

<style>
	.alert {
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-alert-tint) 80%);
		border: 1px solid color-mix(in srgb, var(--tone-alert) 55%, #ffffff);
		border-radius: var(--r-sm);
		padding: 13px 15px;
		display: flex;
		gap: 11px;
		box-shadow:
			inset 0 1px 0 #ffffff,
			0 0 0 3px color-mix(in srgb, var(--tone-alert) 14%, transparent),
			0 12px 26px -10px rgba(30, 20, 90, 0.42);
	}
	.bang {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 34% 24%,
			color-mix(in srgb, var(--tone-alert) 50%, #ffffff) 0%,
			var(--tone-alert) 58%
		);
		box-shadow: 0 4px 9px -3px var(--tone-alert);
		color: #fff;
		font-size: 14.5px;
		font-weight: 800;
		display: grid;
		place-items: center;
		flex: none;
		margin-top: 1px;
	}
	.body {
		flex: 1;
		min-width: 0;
	}
	.t {
		display: block;
		font-size: 16.5px;
		font-weight: 700;
		line-height: 1.3;
		color: var(--tone-alert-ink);
	}
	.m {
		display: block;
		font-size: 14.5px;
		line-height: 1.4;
		color: var(--ink-2);
		margin-top: 4px;
	}
</style>
