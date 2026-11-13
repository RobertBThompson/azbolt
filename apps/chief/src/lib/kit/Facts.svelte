<script>
	/**
	 * A record's own fields, as label and value.
	 *
	 * One pane with a hairline between rows rather than a pane per field:
	 * these are properties of one thing, and a stack of separate cards
	 * would make each look like something to open. A value can carry a
	 * link when it names another record.
	 */
	/** @type {{ items: { label: string, value: string, href?: string }[] }} */
	let { items } = $props();
</script>

<dl class="facts">
	{#each items as it (it.label)}
		<div>
			<dt>{it.label}</dt>
			<dd>
				{#if it.href}<a href={it.href}>{it.value}</a>{:else}{it.value}{/if}
			</dd>
		</div>
	{/each}
</dl>

<style>
	.facts {
		margin: 0;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		background: var(--line-3);
		box-shadow: var(--glass-shadow);
		display: flex;
		flex-direction: column;
		gap: 1px;
		overflow: hidden;
	}
	div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		min-height: 48px;
		padding: 12px 16px;
		background: var(--card);
	}
	dt {
		flex: none;
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	dd {
		margin: 0;
		min-width: 0;
		font-size: 16px;
		font-weight: 500;
		text-align: right;
		color: var(--ink);
		overflow-wrap: anywhere;
	}
	dd a {
		color: var(--tone-cool);
		font-weight: 600;
	}
</style>
