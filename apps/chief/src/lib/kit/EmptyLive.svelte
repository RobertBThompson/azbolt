<script>
	/**
	 * What a signed-in account sees before it has any records.
	 *
	 * An empty list and a broken list look identical, so this says which
	 * one it is. It used to offer to write the design fixtures in as
	 * real records, which put made-up people into a real account and
	 * left nobody able to tell them from their own.
	 */
	/** @type {{ what: string, add?: string }} */
	let { what, add = '' } = $props();
</script>

<div class="empty">
	<p class="t">No {what} yet</p>
	<p class="m">
		You are signed in and this list is genuinely empty — nothing is failing.
		{#if add}Add the first one and it will be here when you come back.{/if}
	</p>
</div>

<style>
	.empty {
		border: 1.5px dashed rgba(255, 255, 255, 0.9);
		border-radius: var(--r-md);
		padding: 20px 16px;
		text-align: center;
		background: var(--glass-dim);
		box-shadow: 0 12px 26px -12px rgba(30, 20, 90, 0.4);
	}
	.t {
		margin: 0 0 5px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 17px;
		color: var(--ink);
	}
	.m {
		margin: 0 0 13px;
		font-size: 14.5px;
		line-height: 1.45;
		color: var(--ink-2);
	}
</style>
