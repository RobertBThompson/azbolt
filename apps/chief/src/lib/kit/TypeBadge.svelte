<script>
	/**
	 * An Organization's type code, as a badge.
	 *
	 * The code leads and the name follows, because the codes are the
	 * canonical vocabulary and are worth learning — C, B, CO, CC, DO,
	 * DB, P, DN, CN. Only C is marked as controlling, since it is the
	 * only type that is itself an intelligence; everything else governs
	 * how Cs are tied together.
	 */
	/** @type {{ code: string, showName?: boolean }} */
	let { code, showName = true } = $props();
	import { orgType } from '$lib/orgtypes.js';
	const t = $derived(orgType(code));
</script>

<span class="badge" class:controls={t.controls} title={t.intension}>
	<span class="code">{t.code}</span>
	{#if showName}<span class="name">{t.name}</span>{/if}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: none;
	}
	.code {
		min-width: 24px;
		height: 20px;
		padding: 0 6px;
		border-radius: 5px;
		display: grid;
		place-items: center;
		background: var(--tone-graphite);
		color: #ffffff;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.04em;
	}
	/* The one controlling type reads differently, on purpose. */
	.badge.controls .code {
		background: var(--tone-brand);
	}
	.name {
		font-size: 11.5px;
		color: var(--ink-3);
	}
</style>
