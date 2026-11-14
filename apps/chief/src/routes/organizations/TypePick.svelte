<script>
	/**
	 * What kind of body an organization is.
	 *
	 * The eight types that are groupings. C — one person — is left out:
	 * a person comes in through People, and the Chief's own is made with
	 * the account.
	 */
	/** @type {{ value: string }} */
	let { value = $bindable('') } = $props();
	import { ORG_TYPES } from '$lib/orgtypes.js';

	const types = Object.values(ORG_TYPES).filter((t) => t.code !== 'C');
</script>

<fieldset class="types">
	<legend>Type</legend>
	{#each types as t (t.code)}
		<label class:on={value === t.code}>
			<input type="radio" name="org-type" value={t.code} bind:group={value} />
			<span class="code">{t.code}</span>
			<span class="words">
				<span class="nm">{t.name}</span>
				<span class="what">{t.intension}</span>
			</span>
		</label>
	{/each}
</fieldset>

<style>
	.types {
		margin: 0;
		padding: 0;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-md);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: var(--line-3);
		box-shadow: var(--glass-shadow);
	}
	legend {
		float: left;
		width: 100%;
		padding: 10px 16px 8px;
		background: var(--card);
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	label {
		clear: both;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		padding: 8px 16px;
		background: var(--card);
		cursor: pointer;
	}
	label.on {
		background: linear-gradient(180deg, #ffffff 0%, var(--tone-cool-tint) 100%);
		box-shadow: inset var(--edge, 4px) 0 0 var(--tone-cool);
	}
	input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
	label:has(input:focus-visible) {
		outline: 3px solid var(--tone-cool);
		outline-offset: -3px;
	}
	.code {
		flex: none;
		width: 34px;
		font-family: var(--font-label);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--tone-cool);
	}
	.words {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.nm {
		font-size: 16px;
		font-weight: 600;
		color: var(--ink);
	}
	.what {
		font-size: 13.5px;
		line-height: 1.35;
		color: var(--ink-3);
	}
</style>
