<script>
	/**
	 * A labelled choice from a known list.
	 *
	 * The native control, restyled. On a phone it opens the system picker,
	 * which is larger, scrollable and already works with a screen reader
	 * and a switch — none of which a drawn dropdown gets for free.
	 */
	/**
	 * @type {{
	 *   label: string,
	 *   options: (string | { value: string, label: string })[],
	 *   value?: string,
	 *   placeholder?: string,
	 *   required?: boolean
	 * }}
	 */
	let {
		label,
		options,
		value = $bindable(''),
		placeholder = 'Choose',
		required = false
	} = $props();
	const opts = $derived(options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)));
</script>

<label class="fld">
	<span class="eyebrow">{label}</span>
	<span class="wrap">
		<select bind:value {required} class:unset={!value}>
			<option value="">{placeholder}</option>
			{#each opts as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select>
		<span class="chev" aria-hidden="true"></span>
	</span>
</label>

<style>
	.fld {
		display: block;
	}
	.eyebrow {
		display: block;
		margin-bottom: 6px;
		color: var(--label-ink, var(--on-field-2));
	}
	.wrap {
		position: relative;
		display: block;
	}
	select {
		width: 100%;
		min-height: 50px;
		padding: 10px 44px 10px 16px;
		border: 1px solid var(--glass-line);
		border-radius: var(--r-sm);
		background: var(--glass);
		box-shadow: var(--glass-shadow);
		font-family: inherit;
		font-size: 16.5px;
		color: var(--ink);
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
	}
	/* Nothing chosen yet reads as a placeholder, not as an answer. */
	select.unset {
		color: var(--ink-4);
	}
	select:focus-visible {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
	.chev {
		position: absolute;
		right: 19px;
		top: 50%;
		width: 9px;
		height: 9px;
		border-right: 2.2px solid var(--ink-2);
		border-bottom: 2.2px solid var(--ink-2);
		border-radius: 1px;
		transform: translateY(-70%) rotate(45deg);
		pointer-events: none;
	}
</style>
