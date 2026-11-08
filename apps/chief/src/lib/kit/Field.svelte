<script>
	/**
	 * @type {{
	 *   label: string,
	 *   placeholder?: string,
	 *   value?: string,
	 *   type?: 'text'|'email'|'password'|'tel'|'url',
	 *   autocomplete?: AutoFill|null,
	 *   required?: boolean,
	 *   disabled?: boolean
	 * }}
	 */
	let {
		label,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		autocomplete = null,
		required = false,
		disabled = false
	} = $props();
</script>

<label class="fld">
	<span class="eyebrow">{label}</span>
	<!--
		`type` cannot be bound dynamically alongside bind:value in Svelte,
		so each input type the app actually uses gets its own branch rather
		than a spread that silently degrades to text.
	-->
	{#if type === 'password'}
		<input
			type="password"
			{placeholder}
			{required}
			{disabled}
			autocomplete={autocomplete ?? 'current-password'}
			bind:value
		/>
	{:else if type === 'email'}
		<input
			type="email"
			{placeholder}
			{required}
			{disabled}
			autocomplete={autocomplete ?? 'email'}
			autocapitalize="none"
			spellcheck="false"
			bind:value
		/>
	{:else}
		<input {type} {placeholder} {required} {disabled} {autocomplete} bind:value />
	{/if}
</label>

<style>
	.fld {
		display: block;
	}
	.eyebrow {
		display: block;
		margin-bottom: 5px;
	}
	input {
		width: 100%;
		min-height: var(--tap-min);
		border: 1px solid var(--line-2);
		border-radius: 10px;
		background: var(--sunk);
		padding: 9px 13px;
		font-family: inherit;
		font-size: 13.5px;
		color: var(--ink);
	}
	input::placeholder {
		color: var(--ink-4);
	}
	input:disabled {
		opacity: 0.55;
	}
</style>
