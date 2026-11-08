<script>
	/** @type {{ label: string, placeholder?: string, value?: string }} */
	let { label, placeholder = '', value = $bindable('') } = $props();
</script>

<label class="fld">
	<span class="eyebrow">{label}</span>
	<input type="text" {placeholder} bind:value />
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
</style>
