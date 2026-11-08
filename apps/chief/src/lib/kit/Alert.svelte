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
		background: var(--tone-alert-tint);
		border: 1px solid var(--tone-alert);
		border-radius: 11px;
		padding: 11px 13px;
		display: flex;
		gap: 10px;
	}
	.bang {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--tone-alert);
		color: #fff;
		font-size: 12px;
		font-weight: 700;
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
		font-size: 14.5px;
		font-weight: 600;
		line-height: 1.3;
		color: var(--tone-alert-ink);
	}
	.m {
		display: block;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--ink-2);
		margin-top: 4px;
	}
</style>
