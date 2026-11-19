<script>
	/**
	 * The fields kept about a person. One form for adding and editing,
	 * so the two can never ask for different things.
	 */
	/**
	 * @type {{
	 *   value: { first_name: string, last_name: string, role: string,
	 *            relationship: string, email: string, phone: string, notes: string }
	 * }}
	 */
	let { value = $bindable() } = $props();
	import { Field } from '$lib/kit';
</script>

<Field label="First name" bind:value={value.first_name} autocomplete="off" required />
<Field label="Last name" bind:value={value.last_name} autocomplete="off" />
<Field label="What they do" placeholder="Accountant, pastor, neighbour" bind:value={value.role} />
<Field
	label="Who they are to you"
	placeholder="Brother, client, friend"
	bind:value={value.relationship}
/>
<Field label="Email" type="email" bind:value={value.email} autocomplete="off" />
<Field label="Phone" type="tel" bind:value={value.phone} autocomplete="off" />
<Field label="Notes" bind:value={value.notes} lines={3} />
