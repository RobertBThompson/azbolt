<script>
	/**
	 * @type {{
	 *   label: string,
	 *   placeholder?: string,
	 *   value?: string,
	 *   type?: 'text'|'email'|'password'|'tel'|'url'|'date'|'money',
	 *   autocomplete?: AutoFill|null,
	 *   required?: boolean,
	 *   disabled?: boolean,
	 *   lines?: number
	 * }}
	 */
	let {
		label,
		placeholder = '',
		value = $bindable(''),
		type = 'text',
		autocomplete = null,
		required = false,
		disabled = false,
		lines = 1
	} = $props();
</script>

<label class="fld">
	<span class="eyebrow">{label}</span>
	<!--
		`type` cannot be bound dynamically alongside bind:value in Svelte,
		so each input type the app actually uses gets its own branch rather
		than a spread that silently degrades to text.
	-->
	{#if lines > 1}
		<textarea rows={lines} {placeholder} {required} {disabled} bind:value></textarea>
	{:else if type === 'password'}
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
	{:else if type === 'date'}
		<!-- A date typed as words cannot be checked, sorted or compared. -->
		<input type="date" {required} {disabled} {autocomplete} bind:value />
	{:else if type === 'money'}
		<!--
			text rather than number: a number input drops what it cannot
			parse, so a typo is silently lost. inputmode brings up the
			number keyboard on a phone all the same.
		-->
		<input
			type="text"
			inputmode="decimal"
			{placeholder}
			{required}
			{disabled}
			{autocomplete}
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
		margin-bottom: 6px;
		/* Most forms sit straight on the field, so the label defaults to
		   white; a card that holds a Field sets --label-ink to an ink
		   value and inheritance carries it down. */
		color: var(--label-ink, var(--on-field-2));
	}
	input,
	textarea {
		width: 100%;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-family: inherit;
		/* 16px and up: below that a phone zooms the page on focus. */
		font-size: 16.5px;
		color: var(--ink);
	}
	input {
		min-height: 50px;
		padding: 10px 16px;
	}
	textarea {
		padding: 12px 16px;
		line-height: 1.5;
		resize: vertical;
	}
	input:focus-visible,
	textarea:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	input::placeholder,
	textarea::placeholder {
		color: var(--ink-4);
	}
	input:disabled,
	textarea:disabled {
		opacity: 0.55;
	}
</style>
